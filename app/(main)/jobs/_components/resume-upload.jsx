"use client"

import { useState, useRef } from "react"
import { Button } from "../../../../components/ui/button"
import { Card } from "../../../../components/ui/card"
import { Upload, Loader2, FileText } from 'lucide-react'

export function ResumeUpload({
  onAnalyze,
  loading,
}) {
  const [file, setFile] = useState(null)
  const [desiredRoles, setDesiredRoles] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !desiredRoles.trim()) {
      alert("Please select a PDF and enter desired roles")
      return
    }

    // Use the first desired role (or combine them if needed)
    const desiredRole = desiredRoles.split(",")[0].trim()
    onAnalyze(file, desiredRole)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold text-black text-balance">Find Your Next Opportunity</h2>
        <p className="text-xl text-gray-600 text-balance">
          Upload your resume and let AI match you with perfect job opportunities
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="bg-white border-gray-300 p-8 hover:border-black transition-colors shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-black">Upload Resume (PDF)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-black rounded-lg p-8 text-center cursor-pointer transition-colors bg-gray-50"
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                {file ? (
                  <div className="space-y-2">
                    <FileText className="w-10 h-10 text-black mx-auto" />
                    <p className="text-black font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-black font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-600">PDF files only</p>
                  </div>
                )}
              </div>
            </div>

            {/* Desired Roles */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-black">Desired Job Roles</label>
              <textarea
                value={desiredRoles}
                onChange={(e) => setDesiredRoles(e.target.value)}
                placeholder="e.g., Senior Frontend Developer, Full Stack Engineer, React Developer"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-black placeholder-gray-400 focus:border-black focus:outline-none resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !file || !desiredRoles.trim()}
              className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                  Analyzing...
                </>
              ) : (
                "Analyze & Find Jobs"
              )}
            </Button>
          </form>
        </Card>

        {/* Features Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black mb-6">How It Works</h3>
          <div className="space-y-4">
            {[
              { num: "1", title: "Upload Resume", desc: "Add your PDF resume" },
              { num: "2", title: "Enter Desired Roles", desc: "Specify job positions you want" },
              { num: "3", title: "AI Analysis", desc: "Gemini AI analyzes your profile" },
              { num: "4", title: "Job Matches", desc: "Get matched job opportunities" },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-black">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
