"use client"

import { useState } from "react"
import ResumeUpload from "./_components/resume-upload"
import AnalysisResults from "./_components/analysis-results"

// interface AnalysisData {
//   feedback: {
//     strengths: string[]
//     improvements: string[]
//     technicalSkills: string[]
//     recommendations: string[]
//   }
//   roadmap: {
//     title: string
//     currentLevel: string
//     targetRole?: string
//     stages: Array<{
//       id: string
//       title: string
//       duration: string
//       skills: string[]
//       resources: string[]
//       resourceLinks?: Array<{
//         title: string
//         url: string
//         type: "documentation" | "course" | "tutorial" | "official"
//       }>
//       youtubeLinks?: Array<{
//         title: string
//         url: string
//       }>
//       milestones: string[]
//       order: number
//     }>
//   }
// }

export default function Home() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [desiredRole, setDesiredRole] = useState("")

  const handleAnalysis = async (resume, role) => {
    setLoading(true)
    setError(null)
    setDesiredRole(role)

    try {
      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("desiredRole", role)

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()

      if (!response.ok) {
        let errorMessage = "Failed to analyze resume"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = responseText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = JSON.parse(responseText)
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.log("[v0] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Resume Feedback & Career Roadmap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and tell us your desired role. Get personalized feedback and an interactive career
            development roadmap powered by AI.
          </p>
        </div>

        {/* Main Content */}
        {!analysis ? (
          <ResumeUpload onAnalyze={handleAnalysis} loading={loading} error={error} />
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => {
                setAnalysis(null)
                setError(null)
              }}
              className="text-primary hover:underline mb-4"
            >
              ← Start Over
            </button>
            <AnalysisResults data={analysis} targetRole={desiredRole} />
          </div>
        )}
      </div>
    </main>
  )
}
