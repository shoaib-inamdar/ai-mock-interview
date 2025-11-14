"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import FeedbackSection from "./feedback-section"
import ReactFlowRoadmap from "./reactflow-roadmap"

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

// interface AnalysisResultsProps {
//   data: AnalysisData
//   targetRole?: string
// }

export default function AnalysisResults({ data, targetRole = "Your Target Role" }) {
  const [activeTab, setActiveTab] = useState("feedback")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feedback">Feedback & Insights</TabsTrigger>
          <TabsTrigger value="roadmap">Career Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          <FeedbackSection feedback={data.feedback} />
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <ReactFlowRoadmap stages={data.roadmap.stages} targetRole={data.roadmap.targetRole || targetRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
