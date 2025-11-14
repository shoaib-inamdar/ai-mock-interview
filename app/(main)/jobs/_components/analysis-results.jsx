"use client"

import { Card } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { ExternalLink, Briefcase, User, Code } from 'lucide-react'

export function AnalysisResults({ data }) {
  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <Card className="bg-white border-gray-300 p-8 shadow-sm">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Summary
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-black">Experience Level:</span>{" "}
                {data.experienceLevel || "Not specified"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-black">Years of Experience:</span>{" "}
                {data.yearsOfExperience || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <Code className="w-5 h-5" />
              Key Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(data.skills || []).slice(0, 5).map((skill, idx) => (
                <Badge key={idx} className="bg-black text-white border border-black">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Match Score
            </h3>
            <div className="space-y-2">
              {data.matchScores &&
                Object.entries(data.matchScores).map(([role, score]) => (
                  <div key={role} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{role}</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Job Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Recommended Jobs</h2>
        <div className="grid gap-4">
          {(data.jobs || []).map((job, idx) => (
            <Card
              key={idx}
              className="bg-white border-gray-300 p-6 hover:border-black transition-colors hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-black">{job.title}</h3>
                    <p className="text-gray-700">{job.company}</p>
                  </div>
                  <Badge className="bg-black text-white border border-black">
                    {job.matchPercentage}% Match
                  </Badge>
                </div>

                <p className="text-gray-700 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-gray-700">
                    <p className="text-gray-600 text-xs">Location</p>
                    <p className="text-black font-medium">{job.location}</p>
                  </div>
                  <div className="text-gray-700">
                    <p className="text-gray-600 text-xs">Salary Range</p>
                    <p className="text-black font-medium">{job.salary}</p>
                  </div>
                  <div className="text-gray-700">
                    <p className="text-gray-600 text-xs">Job Type</p>
                    <p className="text-black font-medium">{job.type}</p>
                  </div>
                  <div className="text-gray-700">
                    <p className="text-gray-600 text-xs">Experience</p>
                    <p className="text-black font-medium">{job.experience}</p>
                  </div>
                </div>

                {job.requiredSkills && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-black">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 5).map((skill, sidx) => (
                        <Badge key={sidx} className="bg-gray-200 text-black border border-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {job.aiSuggestion && (
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <p className="text-sm font-semibold text-black mb-1">AI Tip</p>
                    <p className="text-sm text-gray-700">{job.aiSuggestion}</p>
                  </div>
                )}

                <a
                  href={job.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-black hover:text-gray-600 font-medium transition-colors"
                >
                  View Job <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations && (
        <Card className="bg-white border-gray-300 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {data.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <span className="text-black font-bold mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
