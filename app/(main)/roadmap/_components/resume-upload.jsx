"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Upload, Loader2, AlertCircle } from "lucide-react"

// interface ResumeUploadProps {
//   onAnalyze: (resume: File, desiredRole: string) => Promise<void>
//   loading: boolean
//   error: string | null
// }

export default function ResumeUpload({ onAnalyze, loading, error }) {
  const [file, setFile] = useState(null)
  const [desiredRole, setDesiredRole] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validTypes = ["application/pdf", "image/png", "image/jpeg"]
      const isPDF = selectedFile.type === "application/pdf"
      const isImage = selectedFile.type === "image/png" || selectedFile.type === "image/jpeg"

      if (isPDF || isImage) {
        setFile(selectedFile)
        setFileName(selectedFile.name)
      } else {
        alert("Please select a PDF or image file (PNG, JPG)")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !desiredRole.trim()) {
      alert("Please upload a resume and enter your desired role")
      return
    }
    await onAnalyze(file, desiredRole)
  }

  const isRateLimitError = error?.includes("Resource exhausted") || error?.includes("429")

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Share your resume (PDF or image) and let us know what role you&apos;re targeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">Resume (PDF or Image)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  disabled={loading}
                />
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
                    {fileName ? (
                      <>
                        <p className="font-semibold text-sm">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF or image files (PNG, JPG)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Desired Role Input */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-3">
                Desired Role
              </label>
              <input
                id="role"
                type="text"
                placeholder="e.g., Senior Full-Stack Engineer, Product Manager, Data Scientist"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                disabled={loading}
              />
            </div>

            {/* Error Message with special handling for rate limits */}
            {error && (
              <div
                className={`p-3 rounded-lg text-sm flex items-start gap-2 ${isRateLimitError ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-destructive/10 text-destructive"}`}
              >
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{isRateLimitError ? "API Rate Limited" : "Error"}</p>
                  <p className="text-sm mt-1">
                    {isRateLimitError
                      ? "We're experiencing high traffic. The system will automatically retry your request with exponential backoff. Please keep this page open and wait."
                      : error}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading || !file || !desiredRole.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  {isRateLimitError ? "Retrying..." : "Analyzing..."}
                </>
              ) : (
                "Get Feedback & Roadmap"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
