"use client"

import { useState } from "react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Target, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"

// interface Stage {
//   id: string
//   title: string
//   duration: string
//   skills: string[]
//   resources: string[]
//   resourceLinks?: Array<{
//     title: string
//     url: string
//     type: "documentation" | "course" | "tutorial" | "official"
//   }>
//   youtubeLinks?: Array<{
//     title: string
//     url: string
//   }>
//   milestones: string[]
//   order: number
// }

// interface RoadmapFlowchartProps {
//   stages: Stage[]
// }

export default function RoadmapFlowchart({ stages }) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set([stages[0]?.id]))

  const sortedStages = [...stages].sort((a, b) => a.order - b.order)

  const toggleStage = (stageId) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId)
    } else {
      newExpanded.add(stageId)
    }
    setExpandedStages(newExpanded)
  }

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case "documentation":
        return "📖"
      case "course":
        return "🎓"
      case "tutorial":
        return "🎬"
      case "official":
        return "✓"
      default:
        return "🔗"
    }
  }

  const getResourceTypeColor = (type) => {
    switch (type) {
      case "documentation":
        return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
      case "course":
        return "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
      case "tutorial":
        return "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50"
      case "official":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50"
      default:
        return "bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Flowchart Container */}
      <div className="relative">
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "100%" }}>
          {sortedStages.map((stage, index) => {
            if (index >= sortedStages.length - 1) return null
            return (
              <line
                key={`connection-${stage.id}`}
                x1="24"
                y1={100 + index * 280}
                x2="24"
                y2={100 + (index + 1) * 280}
                stroke="url(#gradientLine)"
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            )
          })}
          <defs>
            <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Stage Nodes */}
        <div className="relative space-y-8">
          {sortedStages.map((stage, index) => (
            <div key={stage.id} className="relative">
              {/* Timeline dot and connector */}
              <div className="absolute left-0 top-6 flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg border-4 border-background">
                  {stage.order}
                </div>
              </div>

              {/* Clickable Card */}
              <button onClick={() => toggleStage(stage.id)} className="w-full text-left transition-all duration-300">
                <Card
                  className={`ml-20 border-2 transition-all duration-300 cursor-pointer
                    ${
                      expandedStages.has(stage.id)
                        ? "border-primary/60 bg-primary/5 shadow-lg"
                        : "border-primary/20 hover:border-primary/40"
                    }
                  `}
                >
                  <CardContent className="pt-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-primary">{stage.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">⏱️ Duration: {stage.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={20} className="text-primary/60 flex-shrink-0" />
                        {expandedStages.has(stage.id) ? (
                          <ChevronUp size={20} className="text-primary" />
                        ) : (
                          <ChevronDown size={20} className="text-primary/60" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedStages.has(stage.id) && (
                      <div className="mt-4 space-y-4 border-t border-primary/10 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Skills */}
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-2">Skills to Learn:</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-2">Milestones:</p>
                          <ul className="space-y-2">
                            {stage.milestones.map((milestone) => (
                              <li key={milestone} className="text-sm flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Learning Resources */}
                        {stage.resourceLinks && stage.resourceLinks.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">Learning Resources:</p>
                            <ul className="space-y-2">
                              {stage.resourceLinks.map((link, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded transition-colors flex-1 ${getResourceTypeColor(link.type)}`}
                                  >
                                    <span className="flex-shrink-0">{getResourceTypeIcon(link.type)}</span>
                                    <div className="flex-1">
                                      <span className="font-medium">{link.title}</span>
                                      <span className="text-xs opacity-75 ml-1">({link.type})</span>
                                    </div>
                                    <svg className="w-4 h-4 flex-shrink-0 opacity-60">
                                      <path
                                        fill="currentColor"
                                        d="M13.5 6.5h3v3h1.5v-5h-5v1.5zm0 9.5v1.5h5v-5h-1.5v3.5h-3.5zm-8-9.5v1.5h3.5v3h-1.5v-1.5h-2zm0 9.5h2v-3.5h1.5v5h-3.5z"
                                      />
                                    </svg>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* YouTube Links */}
                        {stage.youtubeLinks && stage.youtubeLinks.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-2">Recommended YouTube Tutorials:</p>
                            <ul className="space-y-2">
                              {stage.youtubeLinks.map((link, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex-1"
                                  >
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19.615 3.175h-15.23c-2.267 0-4.108 1.846-4.108 4.113v9.424c0 2.267 1.841 4.113 4.108 4.113h15.23c2.267 0 4.108-1.846 4.108-4.113V7.288c0-2.267-1.841-4.113-4.108-4.113zm-11.145 9.732V8.019l4.808 2.444-4.808 2.444z" />
                                    </svg>
                                    <span className="font-medium">{link.title}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Progress Indicator */}
                    {!expandedStages.has(stage.id) && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1 flex-1 bg-primary/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (stage.skills.length / 5) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{stage.skills.length} skills</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Card */}
      <Card className="border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-600" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                You&apos;re on track to achieve your goal!
              </p>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Follow this roadmap consistently and you&apos;ll reach your target role in approximately{" "}
                {sortedStages.reduce((acc, s) => {
                  const months = Number.parseInt(s.duration) || 0
                  return acc + months
                }, 0)}{" "}
                months
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
