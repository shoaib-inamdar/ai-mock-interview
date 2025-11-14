"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { CheckCircle2, ExternalLink, Zap, ChevronRight } from "lucide-react"

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

// interface ReactFlowRoadmapProps {
//   stages: Stage[]
//   targetRole: string
// }

export default function InteractiveRoadmap({ stages, targetRole }) {
  const [selectedStage, setSelectedStage] = useState(stages[0] || null)
  const sortedStages = [...stages].sort((a, b) => a.order - b.order)
  const totalDuration = sortedStages.reduce((acc, s) => {
    const months = Number.parseInt(s.duration) || 0
    return acc + months
  }, 0)

  return (
    <div className="w-full space-y-6">
      {/* Main Flowchart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your Career Progression Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-center gap-2 min-w-max px-4 py-6">
              {/* Stage Nodes */}
              {sortedStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStage(stage)}
                    className={`flex flex-col items-center justify-center w-32 h-24 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      selectedStage?.id === stage.id
                        ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg ring-2 ring-primary/50"
                        : "bg-muted hover:bg-muted/80 text-foreground border-2 border-primary/30"
                    }`}
                  >
                    <div className="text-2xl font-bold">{stage.order}</div>
                    <div className="text-xs font-semibold text-center leading-tight truncate px-1 max-w-[120px]">
                      {stage.title}
                    </div>
                    <div className="text-xs opacity-75">{stage.duration}</div>
                  </button>

                  {/* Arrow */}
                  {index < sortedStages.length - 1 && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary/60">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
              ))}

              {/* Target Role Node */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-600">
                  <ChevronRight size={20} />
                </div>
                <div className="flex flex-col items-center justify-center w-32 h-24 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg border-2 border-orange-400">
                  <Zap size={20} />
                  <div className="text-xs font-semibold text-center">Target Role</div>
                  <div className="text-xs opacity-90 truncate px-1 max-w-[120px]">{targetRole}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Summary */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">Total Timeline</p>
                <p className="text-xs text-muted-foreground">Estimated time to reach your goal</p>
              </div>
              <div className="text-3xl font-bold text-primary">{totalDuration}+ months</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Details Panel */}
      {selectedStage && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm opacity-90">Stage {selectedStage.order}</div>
                <CardTitle className="text-white">{selectedStage.title}</CardTitle>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Duration</div>
                <div className="text-lg font-bold">{selectedStage.duration}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Skills to Learn
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Milestones
                </h4>
                <ul className="space-y-2">
                  {selectedStage.milestones.map((milestone, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Learning Resources */}
            {selectedStage.resourceLinks && selectedStage.resourceLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink size={16} className="text-blue-600" />
                  Learning Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedStage.resourceLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition group"
                    >
                      <span className="text-lg flex-shrink-0">{getResourceIcon(link.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium group-hover:underline truncate">{link.title}</p>
                        <p className="text-xs opacity-75 capitalize">{link.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Tutorials */}
            {selectedStage.youtubeLinks && selectedStage.youtubeLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.175h-15.23c-2.267 0-4.108 1.846-4.108 4.113v9.424c0 2.267 1.841 4.113 4.108 4.113h15.23c2.267 0 4.108-1.846 4.108-4.113V7.288c0-2.267-1.841-4.113-4.108-4.113zm-11.145 9.732V8.019l4.808 2.444-4.808 2.444z" />
                  </svg>
                  YouTube Tutorials
                </h4>
                <div className="space-y-2">
                  {selectedStage.youtubeLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition group"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.175h-15.23c-2.267 0-4.108 1.846-4.108 4.113v9.424c0 2.267 1.841 4.113 4.108 4.113h15.23c2.267 0 4.108-1.846 4.108-4.113V7.288c0-2.267-1.841-4.113-4.108-4.113zm-11.145 9.732V8.019l4.808 2.444-4.808 2.444z" />
                      </svg>
                      <span className="font-medium group-hover:underline flex-1">{link.title}</span>
                      <ExternalLink size={14} className="flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-dashed border-2">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-semibold">Pro Tip:</span> Click on any stage above to see detailed skills, learning
            resources, and recommended tutorials. Follow each stage consistently to stay on track with your career
            goals.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function getResourceIcon(type) {
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
