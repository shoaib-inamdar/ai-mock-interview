import { GoogleGenerativeAI } from "@google/generative-ai"

async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const isRateLimitError =
        error instanceof Error && (error.message.includes("429") || error.message.includes("Resource exhausted"))

      if (!isRateLimitError || attempt === maxRetries - 1) {
        throw error
      }

      const delayMs = initialDelayMs * Math.pow(2, attempt)
      console.log(`[v0] Rate limited, retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  throw new Error("Max retries exceeded")
}

async function extractTextFromPDF(buffer) {
  try {
    console.log("[v0] Attempting PDF text extraction, buffer size:", buffer.length)

    const bufferString = buffer.toString("latin1")
    const textMatches = bufferString.match(/BT[\s\n]+(.*?)[\s\n]+ET/gs) || []
    let extractedText = ""

    for (const match of textMatches) {
      const textContent = match.match(/\$\$(.*?)\$\$/g) || []
      for (const content of textContent) {
        extractedText += content.slice(1, -1) + " "
      }
    }

    if (!extractedText.trim()) {
      console.log("[v0] No structured PDF text found, using fallback extraction")
      extractedText = bufferString.replace(/[^\x20-\x7E\n]/g, " ").trim()
    }

    console.log("[v0] PDF text extracted, length:", extractedText.length)
    return extractedText.substring(0, 10000)
  } catch (error) {
    console.error("[v0] PDF extraction error details:", error instanceof Error ? error.message : String(error))
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function extractTextFromImage(buffer, mimeType, genAI) {
  try {
    console.log("[v0] Attempting image text extraction via Gemini vision")

    const extractedText = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const base64Image = buffer.toString("base64")

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType ,
            data: base64Image,
          },
        },
        "Extract all text from this resume image. Return only the extracted text without any additional commentary.",
      ])

      return result.response.text()
    })

    console.log("[v0] Image text extracted, length:", extractedText.length)
    return extractedText.substring(0, 10000)
  } catch (error) {
    console.error("[v0] Image extraction error details:", error instanceof Error ? error.message : String(error))
    throw new Error(`Failed to extract image text: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// interface ResumeAnalysis {
//   feedback: {
//     currentLevel: string
//     strengths: string[]
//     improvements: string[]
//     technicalSkills: string[]
//     recommendations: string[]
//   }
//   roadmap: {
//     title: string
//     currentLevel: string
//     targetRole: string
//     stages: Array<{
//       id: string
//       title: string
//       duration: string
//       skills: string[]
//       resources: string[]
//       resourceLinks: Array<{
//         title: string
//         url: string
//         type: "documentation" | "course" | "tutorial" | "official"
//       }>
//       youtubeLinks: Array<{
//         title: string
//         url: string
//       }>
//       milestones: string[]
//       order: number
//     }>
//   }
// }

async function determineCurrentLevel(resumeText, desiredRole) {
  try {
    console.log("[v0] Determining user's current career level")

    const levelPrompt = `Analyze this resume and determine the person's current career level relative to the desired role "${desiredRole}".

Resume Content:
${resumeText}

Respond with ONLY one of these exact values and nothing else:
- "entry_level" (0-2 years experience, junior, graduate)
- "mid_level" (2-5 years experience, some project experience)
- "senior_level" (5+ years experience, leadership experience)
- "expert_level" (10+ years experience, multiple roles, significant impact)
- "career_changer" (experienced in different field, no direct experience in target role)`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(levelPrompt)
    const level = result.response.text().trim().toLowerCase()

    console.log("[v0] Determined user level:", level)
    return level
  } catch (error) {
    console.error("[v0] Error determining level:", error instanceof Error ? error.message : String(error))
    return "mid_level" // Default to mid-level if detection fails
  }
}

async function analyzeWithGemini(resumeText, desiredRole){
  try {
    console.log("[v0] Initializing Gemini with API key:", process.env.GEMINI_API_KEY ? "SET" : "NOT SET")

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not configured")
    }

    const currentLevel = await retryWithBackoff(async () => {
      return await determineCurrentLevel(resumeText, desiredRole)
    })

    console.log("[v0] Extracting current skills from resume")
    const currentSkillsText = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const skillsPrompt = `Extract ONLY the technical skills from this resume. List them as a comma-separated string with no additional text.

Resume:
${resumeText}

Examples of what to extract: JavaScript, React, Python, AWS, Docker, SQL, etc.
Respond with ONLY the skill list, nothing else.`

      const result = await model.generateContent(skillsPrompt)
      return result.response.text().trim()
    })

    console.log("[v0] Current skills extracted:", currentSkillsText)

    console.log("[v0] Determining required skills for target role:", desiredRole)
    const requiredSkillsText = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const skillsPrompt = `List the top technical skills required for a ${desiredRole} role. List them as a comma-separated string with no additional text.

Respond with ONLY the skill list, nothing else. Focus on practical, learnable skills.`

      const result = await model.generateContent(skillsPrompt)
      return result.response.text().trim()
    })

    console.log("[v0] Required skills identified:", requiredSkillsText)

    let roadmapGuidance = ""

    switch (currentLevel) {
      case "entry_level":
        roadmapGuidance = `The user is entry-level with these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a 5-stage roadmap that: 1) Covers MISSING fundamental technologies, 2) Builds MISSING core competencies through projects, 3) Develops the MISSING advanced techniques needed, 4) Prepares for interviews with their SKILL GAPS, 5) Positions them for their first ${desiredRole} role.`
        break
      case "mid_level":
        roadmapGuidance = `The user is mid-level with these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a 4-stage roadmap that: 1) Closes the SKILL GAPS for advanced techniques, 2) Develops MISSING specialized skills for ${desiredRole}, 3) Builds architecture/design patterns they're missing, 4) Prepares to transition into ${desiredRole}.`
        break
      case "senior_level":
        roadmapGuidance = `The user is senior-level with these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a 3-stage roadmap that: 1) Masters domain-specific techniques MISSING from their profile, 2) Develops strategic understanding of ${desiredRole}, 3) Positions them as a leader in ${desiredRole}.`
        break
      case "expert_level":
        roadmapGuidance = `The user is expert-level with these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a 2-stage roadmap that: 1) Acquires the SPECIFIC MISSING skills for ${desiredRole}, 2) Establishes thought leadership in the ${desiredRole} space.`
        break
      case "career_changer":
        roadmapGuidance = `The user is changing careers with these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a 6-stage roadmap that: 1) Establishes FOUNDATIONAL concepts in ${desiredRole} field, 2) Teaches CORE technologies completely new to them, 3) Builds practical experience with MISSING technologies, 4) Creates portfolio projects using the NEW skills, 5) Builds credibility and networks in ${desiredRole} field, 6) Successfully transitions to ${desiredRole} role.`
        break
      default:
        roadmapGuidance = `The user has these skills: ${currentSkillsText}. They need these skills for ${desiredRole}: ${requiredSkillsText}. Create a practical, skill-gap focused 4-stage roadmap.`
    }

    const prompt = `You are an expert career coach. Analyze this resume and create a PERSONALIZED, SKILL-GAP-FOCUSED roadmap.

Resume Content:
${resumeText}

Desired Role: ${desiredRole}
Current Career Level: ${currentLevel}
Current Skills: ${currentSkillsText}
Required Skills: ${requiredSkillsText}

${roadmapGuidance}

IMPORTANT: Make this roadmap SPECIFIC to their skill gaps. Every skill and resource must address what they're MISSING to get the job, not generic advice.

CRITICAL: For resourceLinks, you MUST provide REAL, WORKING URLs based on the specific skills mentioned in each stage. Do NOT use placeholder URLs or generic links. 

Examples of REAL URLs to use:
- Documentation: "https://react.dev/docs/getting-started", "https://docs.python.org/3/tutorial/", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "https://nodejs.org/en/docs/", "https://docs.docker.com/get-started/"
- Courses: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "https://www.coursera.org/learn/python", "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", "https://www.codecademy.com/learn/learn-python-3"
- Tutorials: "https://www.freecodecamp.org/news/", "https://www.tutorialspoint.com/javascript/index.htm", "https://www.w3schools.com/js/", "https://javascript.info/"
- Official: "https://react.dev/", "https://www.python.org/", "https://nodejs.org/", "https://www.docker.com/"

For youtubeLinks, provide actual YouTube search URLs or specific video URLs:
- Search: "https://www.youtube.com/results?search_query=react+tutorial+for+beginners"
- Specific video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" (use actual tutorial videos)

IMPORTANT: Match the URLs to the specific technologies and skills mentioned in each stage. If a stage mentions "React", provide React-specific URLs. If it mentions "Python", provide Python-specific URLs.

Please provide ONLY valid JSON in the following format, no additional text:
{
  "feedback": {
    "currentLevel": "${currentLevel}",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"],
    "technicalSkills": ["skill 1", "skill 2", "skill 3"],
    "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
  },
  "roadmap": {
    "title": "Personalized Career Path to ${desiredRole}",
    "currentLevel": "${currentLevel}",
    "targetRole": "${desiredRole}",
    "stages": [`

    const stageTemplates = {
      entry_level: [
        { id: "stage_1", title: "Master Missing Fundamentals", duration: "2-3 months", order: 1 },
        { id: "stage_2", title: "Build Core Project Experience", duration: "3-4 months", order: 2 },
        { id: "stage_3", title: "Advanced Techniques & Patterns", duration: "2-3 months", order: 3 },
        { id: "stage_4", title: "Interview Prep for ${desiredRole}", duration: "1-2 months", order: 4 },
        { id: "stage_5", title: "Land Your First ${desiredRole} Role", duration: "1-3 months", order: 5 },
      ],
      mid_level: [
        { id: "stage_1", title: "Fill Specialized Skill Gaps", duration: "2-3 months", order: 1 },
        { id: "stage_2", title: "Master ${desiredRole} Technologies", duration: "3-4 months", order: 2 },
        { id: "stage_3", title: "Architecture & Design for ${desiredRole}", duration: "2-3 months", order: 3 },
        { id: "stage_4", title: "Transition to ${desiredRole}", duration: "2-3 months", order: 4 },
      ],
      senior_level: [
        { id: "stage_1", title: "Domain Mastery in ${desiredRole}", duration: "2-4 months", order: 1 },
        { id: "stage_2", title: "Strategic Leadership in ${desiredRole}", duration: "2-3 months", order: 2 },
        { id: "stage_3", title: "Executive Positioning & Success", duration: "1-2 months", order: 3 },
      ],
      expert_level: [
        { id: "stage_1", title: "Specialized ${desiredRole} Expertise", duration: "2-3 months", order: 1 },
        { id: "stage_2", title: "Thought Leadership & Impact", duration: "2-3 months", order: 2 },
      ],
      career_changer: [
        { id: "stage_1", title: "${desiredRole} Fundamentals", duration: "3-4 months", order: 1 },
        { id: "stage_2", title: "Essential Technologies & Tools", duration: "2-3 months", order: 2 },
        { id: "stage_3", title: "Hands-On Project Experience", duration: "3-4 months", order: 3 },
        { id: "stage_4", title: "Portfolio Projects for ${desiredRole}", duration: "3-4 months", order: 4 },
        { id: "stage_5", title: "Network & Build Credibility", duration: "2-3 months", order: 5 },
        { id: "stage_6", title: "Successful ${desiredRole} Transition", duration: "1-3 months", order: 6 },
      ],
    }

    const stages = stageTemplates[currentLevel ] || stageTemplates.mid_level
    const stagesJSON = stages
      .map(
        (stage) => `{
        "id": "${stage.id}",
        "title": "${stage.title}",
        "duration": "${stage.duration}",
        "skills": ["skill 1 for ${stage.title}", "skill 2 for ${stage.title}"],
        "resources": ["resource 1"],
        "resourceLinks": [
          {"title": "REAL documentation title here", "url": "REAL_WORKING_URL_HERE", "type": "documentation"},
          {"title": "REAL course title here", "url": "REAL_WORKING_URL_HERE", "type": "course"}
        ],
        "youtubeLinks": [{"title": "REAL YouTube tutorial title", "url": "https://www.youtube.com/results?search_query=${encodeURIComponent(stage.title + ' ' + desiredRole)}"}],
        "milestones": ["milestone 1"],
        "order": ${stage.order}
      }`,
      )
      .join(",")

    const fullPrompt =
      prompt +
      stagesJSON +
      `
    ]
  }
}

REMEMBER: Replace ALL "REAL_WORKING_URL_HERE" placeholders with actual, working URLs. Each resourceLink must have:
- A descriptive title that matches the actual resource
- A real, working URL that users can click and visit
- The correct type (documentation, course, tutorial, or official)

For each stage, provide 2-4 resourceLinks that are directly relevant to the skills being taught in that stage.`

    console.log("[v0] Sending skill-gap focused prompt to Gemini API, prompt length:", fullPrompt.length)

    const analysis = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(fullPrompt)

      console.log("[v0] Gemini response received")
      const responseText = result.response.text()
      console.log("[v0] Response text length:", responseText.length)

      let parsedAnalysis
      try {
        parsedAnalysis = JSON.parse(responseText)
        console.log("[v0] JSON parsed successfully")
      } catch (parseError) {
        console.log("[v0] Direct JSON parse failed, attempting to extract JSON object")
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          console.error("[v0] No JSON found in response. Response:", responseText.substring(0, 500))
          throw new Error("Failed to extract valid JSON from AI response")
        }
        parsedAnalysis = JSON.parse(jsonMatch[0])
        console.log("[v0] Extracted JSON parsed successfully")
      }

      return parsedAnalysis
    })

    return analysis
  } catch (error) {
    console.error("[v0] Gemini analysis error:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Full error stack:", error instanceof Error ? error.stack : "No stack trace")
    throw error
  }
}

export async function POST(request) {
  try {
    console.log("[v0] POST request started")

    const formData = await request.formData()
    const resumeFile = formData.get("resume")
    const desiredRole = formData.get("desiredRole") 

    console.log("[v0] Form data extracted - File:", resumeFile?.name, "Size:", resumeFile?.size, "Role:", desiredRole)

    if (!resumeFile || !desiredRole) {
      console.warn("[v0] Missing required fields")
      return Response.json({ error: "Missing resume or desired role" }, { status: 400 })
    }

    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[v0] Buffer created, size:", buffer.length)

    let resumeText

    if (resumeFile.type === "application/pdf") {
      console.log("[v0] Detected PDF file, using PDF extraction")
      resumeText = await extractTextFromPDF(buffer)
    } else if (resumeFile.type === "image/png" || resumeFile.type === "image/jpeg") {
      console.log("[v0] Detected image file, using Gemini vision extraction")
      resumeText = await extractTextFromImage(buffer, resumeFile.type, genAI)
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or image file.")
    }

    if (!resumeText || resumeText.trim().length < 10) {
      console.warn("[v0] Insufficient text extracted from file")
      return Response.json(
        { error: "Failed to extract sufficient text from file - content may be empty or corrupted" },
        { status: 400 },
      )
    }

    console.log("[v0] Extracted text length:", resumeText.length)
    console.log("[v0] Starting Gemini analysis")

    const analysis = await analyzeWithGemini(resumeText, desiredRole)

    console.log("[v0] Analysis complete, sending response")
    return Response.json(analysis)
  } catch (error) {
    console.error("[v0] Error in POST handler:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    const message = error instanceof Error ? error.message : "Internal server error occurred"
    return Response.json({ error: message }, { status: 500 })
  }
}
