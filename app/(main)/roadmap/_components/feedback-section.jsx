"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { CheckCircle2, AlertCircle, Code, Lightbulb } from "lucide-react"

// interface FeedbackSectionProps {
//   feedback: {
//     strengths: string[]
//     improvements: string[]
//     technicalSkills: string[]
//     recommendations: string[]
//   }
// }

export default function FeedbackSection({ feedback }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 size={20} />
            Your Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <AlertCircle size={20} />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Technical Skills Gap */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Code size={20} />
            Technical Skills to Develop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.technicalSkills.map((skill, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Lightbulb size={20} />
            Key Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
