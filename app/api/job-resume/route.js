import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function extractTextFromPDF(buffer) {
  try {
    console.log("[job-resume] Attempting PDF text extraction, buffer size:", buffer.length)

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
      console.log("[job-resume] No structured PDF text found, using fallback extraction")
      extractedText = bufferString.replace(/[^\x20-\x7E\n]/g, " ").trim()
    }

    console.log("[job-resume] PDF text extracted, length:", extractedText.length)
    return extractedText.substring(0, 10000)
  } catch (error) {
    console.error("[job-resume] PDF extraction error:", error instanceof Error ? error.message : String(error))
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

async function extractTextFromImage(buffer, mimeType) {
  try {
    console.log("[job-resume] Attempting image text extraction via Gemini vision")

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const base64Image = buffer.toString("base64")

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      "Extract all text from this resume image. Return only the extracted text without any additional commentary.",
    ])

    const extractedText = result.response.text()
    console.log("[job-resume] Image text extracted, length:", extractedText.length)
    return extractedText.substring(0, 10000)
  } catch (error) {
    console.error("[job-resume] Image extraction error:", error instanceof Error ? error.message : String(error))
    throw new Error(`Failed to extract image text: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

const jobDatabase = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Startup Inc",
    description: "Build scalable frontend applications with React and TypeScript.",
    location: "San Francisco, CA",
    salary: "$150,000 - $200,000",
    type: "Full-time",
    experience: "5+ years",
    requiredSkills: ["React", "TypeScript", "CSS", "REST API"],
    link: "https://example.com/jobs/1",
  },
  {
    title: "Full Stack Engineer",
    company: "Cloud Solutions Ltd",
    description: "Develop end-to-end solutions using modern web technologies.",
    location: "New York, NY",
    salary: "$130,000 - $180,000",
    type: "Full-time",
    experience: "3+ years",
    requiredSkills: ["JavaScript", "Node.js", "React", "PostgreSQL"],
    link: "https://example.com/jobs/2",
  },
  {
    title: "Backend Developer",
    company: "Financial Services Co",
    description: "Design and maintain robust backend systems for financial applications.",
    location: "Boston, MA",
    salary: "$140,000 - $190,000",
    type: "Full-time",
    experience: "4+ years",
    requiredSkills: ["Python", "Java", "SQL", "AWS"],
    link: "https://example.com/jobs/3",
  },
  {
    title: "DevOps Engineer",
    company: "Infrastructure Pro",
    description: "Manage cloud infrastructure and implement CI/CD pipelines.",
    location: "Remote",
    salary: "$120,000 - $170,000",
    type: "Full-time",
    experience: "3+ years",
    requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    link: "https://example.com/jobs/4",
  },
  {
    title: "Mobile Developer",
    company: "Mobile First Apps",
    description: "Create innovative mobile applications for iOS and Android.",
    location: "Austin, TX",
    salary: "$110,000 - $160,000",
    type: "Full-time",
    experience: "2+ years",
    requiredSkills: ["React Native", "JavaScript", "Mobile UI"],
    link: "https://example.com/jobs/5",
  },
]

function extractSkillsAndExperience(resumeText, desiredRoles) {
  const skills = []

  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "CSS",
    "HTML",
    "REST API",
    "GraphQL",
    "Next.js",
    "Express",
    "Vue",
    "Angular",
    "Git",
    "Linux",
    "Agile",
    "Scrum",
    "Firebase",
    "Tailwind",
  ]

  commonSkills.forEach((skill) => {
    const regex = new RegExp(`\\b${skill}\\b`, "gi")
    if (regex.test(resumeText)) {
      if (!skills.includes(skill)) {
        skills.push(skill)
      }
    }
  })

  const expMatch = resumeText.match(/(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?experience/i)
  const yearsOfExperience = expMatch ? expMatch[1] : "3"

  const years = Number.parseInt(yearsOfExperience)
  let experienceLevel = "Mid-level"
  if (years < 2) experienceLevel = "Junior"
  else if (years >= 2 && years < 5) experienceLevel = "Mid-level"
  else if (years >= 5) experienceLevel = "Senior"

  return {
    skills: skills.length > 0 ? skills : ["JavaScript", "React", "TypeScript", "Node.js"],
    yearsOfExperience,
    experienceLevel,
  }
}

async function searchRealJobs(desiredRoles, skills) {
  try {
    const query = desiredRoles
      .split(",")
      .map((r) => r.trim())
      .join(" OR ")

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.JSEARCH_API_KEY || "",
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    }

    const searchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + " India")}&country=IN&page=1&num_pages=1`

    const response = await fetch(searchUrl, options)
    const data = await response.json()

    if (data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 5).map((job) => {
        const fullDescription = job.job_description || "No description available"
        const shortDescription =
          fullDescription.length > 150 ? fullDescription.substring(0, 150) + "..." : fullDescription

        return {
          title: job.job_title || "Job Title",
          company: job.employer_name || "Company",
          description: shortDescription,
          location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : "Remote",
          salary:
            job.job_salary_max && job.job_salary_min
              ? `₹${job.job_salary_min.toLocaleString()} - ₹${job.job_salary_max.toLocaleString()}`
              : "Salary not specified",
          type: job.job_employment_type || "Full-time",
          experience: "See job details",
          requiredSkills: skills.slice(0, 5),
          link: job.job_apply_link || job.job_google_link || "#",
          matchPercentage: calculateJobMatch(job, skills),
        }
      })
    }

    return []
  } catch (error) {
    console.log("[v0] Real job search failed:", error)
    return []
  }
}

function calculateJobMatch(job, skills) {
  let matchScore = 30

  const jobText = (job.job_title + " " + job.job_description).toLowerCase()

  skills.forEach((skill) => {
    if (jobText.includes(skill.toLowerCase())) {
      matchScore += 8
    }
  })

  return Math.min(matchScore, 100)
}

async function generateJobSuggestions(job, skills, experienceLevel) {
  return generateFallbackSuggestion(job.job_title || job.title, skills, experienceLevel)
}

function generateFallbackSuggestion(jobTitle, skills, level) {
  const suggestions = [
    `Highlight your ${skills[0]} expertise prominently in your application`,
    "Match your cover letter keywords to this job description",
    `Research the company culture and align your experience with their values`,
    "Include 2-3 relevant projects that showcase your capabilities",
    `Prepare to discuss how your ${level} experience adds value`,
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

async function generateRecommendations(
  resumeText,
  desiredRoles,
  skills,
  yearsOfExperience,
  experienceLevel,
) {
  const recommendationPrompt = `You are a career advisor for Indian job seekers. Based on this profile, provide 4 specific, actionable recommendations to land better jobs in India for the desired roles.

Resume Skills: ${skills.join(", ")}
Desired Roles: ${desiredRoles}
Experience Level: ${experienceLevel}
Years of Experience: ${yearsOfExperience}

Guidelines:
- Focus on India job market trends and requirements
- Be specific and actionable
- Consider current tech stack demand in India
- Include both technical and soft skills recommendations

Provide exactly 4 recommendations, one per line, without numbering or bullet points. Each should be a complete sentence (15-20 words max).`

  try {
    const { text: recommendationText } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: recommendationPrompt,
      temperature: 0.6,
      maxTokens: 500,
    })

    return recommendationText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 10)
      .slice(0, 4)
  } catch (error) {
    console.log("[v0] Gemini recommendations error:", error?.status)
    return getDefaultRecommendations(experienceLevel, skills)
  }
}

function getDefaultRecommendations(experienceLevel, skills) {
  const skillStr = skills.slice(0, 2).join(" and ")

  if (experienceLevel === "Junior") {
    return [
      "Build 3-4 impressive projects showcasing your skills on GitHub",
      `Master ${skillStr} through hands-on practice and real projects`,
      "Contribute to open source projects to gain practical experience",
      "Network actively on LinkedIn and attend local tech meetups",
    ]
  } else if (experienceLevel === "Senior") {
    return [
      "Lead technical initiatives and document your architectural decisions",
      "Build products or features used by thousands of users",
      "Mentor junior developers and contribute to your team's growth",
      "Stay updated with latest tech trends and ${skillStr} best practices",
    ]
  }

  return [
    "Deepen your expertise in 2-3 specific technologies",
    "Create a portfolio of production-grade applications",
    "Improve system design and optimization skills",
    "Build strong professional network in your tech niche",
  ]
}

export async function POST(request) {
  try {
    console.log("[job-resume] POST request started")

    const formData = await request.formData()
    const resumeFile = formData.get("resume")
    const desiredRole = formData.get("desiredRole")

    console.log("[job-resume] Form data extracted - File:", resumeFile?.name, "Size:", resumeFile?.size, "Role:", desiredRole)

    if (!resumeFile || !desiredRole) {
      console.warn("[job-resume] Missing required fields")
      return Response.json({ error: "Missing resume or desired role" }, { status: 400 })
    }

    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[job-resume] Buffer created, size:", buffer.length)

    let resumeText

    if (resumeFile.type === "application/pdf") {
      console.log("[job-resume] Detected PDF file, using PDF extraction")
      resumeText = await extractTextFromPDF(buffer)
    } else if (resumeFile.type === "image/png" || resumeFile.type === "image/jpeg") {
      console.log("[job-resume] Detected image file, using Gemini vision extraction")
      resumeText = await extractTextFromImage(buffer, resumeFile.type)
    } else {
      return Response.json({ error: "Unsupported file type. Please upload a PDF or image file." }, { status: 400 })
    }

    if (!resumeText || resumeText.trim().length < 10) {
      console.warn("[job-resume] Insufficient text extracted from file")
      return Response.json(
        { error: "Failed to extract sufficient text from file - content may be empty or corrupted" },
        { status: 400 },
      )
    }

    console.log("[job-resume] Extracted text length:", resumeText.length)

    // Use desiredRole as desiredRoles for compatibility with existing functions
    const desiredRoles = desiredRole

    const { skills, yearsOfExperience, experienceLevel } = extractSkillsAndExperience(resumeText, desiredRoles)

    const recommendations = await generateRecommendations(
      resumeText,
      desiredRoles,
      skills,
      yearsOfExperience,
      experienceLevel,
    )

    const jobs = await searchRealJobs(desiredRoles, skills)

    const jobsWithSuggestions = jobs.map((job) => ({
      ...job,
      aiSuggestion: generateFallbackSuggestion(job.title || job.job_title, skills, experienceLevel),
    }))

    if (jobsWithSuggestions.length === 0) {
      jobsWithSuggestions.push({
        title: "Senior Developer",
        company: "Tech Company",
        description: "Unable to load real jobs. Please check your JSearch API key.",
        location: "Remote",
        salary: "Competitive",
        type: "Full-time",
        experience: "3+ years",
        requiredSkills: skills,
        link: "https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(desiredRoles),
        matchPercentage: 0,
        aiSuggestion: "Make sure your LinkedIn profile is complete and up to date",
      })
    }

    const matchScores= {}
    desiredRoles.split(",").forEach((role) => {
      const roleText = role.toLowerCase()
      let score = 50

      // Calculate match based on skills and experience
      skills.forEach((skill) => {
        if (roleText.includes(skill.toLowerCase())) {
          score += 15
        }
      })

      // Adjust based on experience level
      if (roleText.includes("senior") && experienceLevel === "Senior") score += 20
      if (roleText.includes("junior") && experienceLevel === "Junior") score += 20
      if (roleText.includes("mid") && experienceLevel === "Mid-level") score += 20

      matchScores[role.trim()] = Math.min(score, 100)
    })

    return Response.json({
      experienceLevel,
      yearsOfExperience,
      skills: skills.slice(0, 8), // Show more skills
      matchScores,
      jobs: jobsWithSuggestions.sort((a, b) => b.matchPercentage - a.matchPercentage),
      recommendations,
    })
  } catch (error) {
    console.error("[v0] Error analyzing resume:", error)
    return Response.json({ error: "Error processing resume" }, { status: 500 })
  }
}
