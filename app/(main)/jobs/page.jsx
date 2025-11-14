"use client"

import { useState } from "react"
import { Header } from "./_components/header"
import { ResumeUpload } from "./_components/resume-upload"
import { AnalysisResults } from "./_components/analysis-results"

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyzeResume = async (resumeFile, desiredRole) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("desiredRole", desiredRole)

      const response = await fetch("/api/job-resume", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error analyzing resume:", errorData.error)
        alert("Error: " + (errorData.error || "Failed to analyze resume"))
        return
      }
      const data = await response.json()
      if (data.error) {
        console.error("Error analyzing resume:", data.error)
        alert("Error: " + data.error)
        return
      }
      setAnalysisData(data)
    } catch (error) {
      console.error("Error analyzing resume:", error)
      alert("Failed to analyze resume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Updated background from dark gradient to clean white */
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!analysisData ? (
          <ResumeUpload onAnalyze={handleAnalyzeResume} loading={loading} />
        ) : (
          <div className="space-y-8">
            <button
              onClick={() => setAnalysisData(null)}
              /* Updated button color from indigo to black */
              className="text-black hover:text-gray-600 transition-colors underline"
            >
              ← Upload Another Resume
            </button>
            <AnalysisResults data={analysisData} />
          </div>
        )}
      </main>
    </div>
  )
}
