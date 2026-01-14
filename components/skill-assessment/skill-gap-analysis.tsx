"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowRight, BarChart, CheckCircle, Download, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SkillGapAnalysis() {
  const [activeTab, setActiveTab] = useState("gaps")

  const skillGaps = [
    {
      skill: "Deep Learning",
      currentLevel: 25,
      requiredLevel: 70,
      gap: 45,
      priority: "high",
      trend: "rising",
    },
    {
      skill: "Data Engineering",
      currentLevel: 30,
      requiredLevel: 65,
      gap: 35,
      priority: "medium",
      trend: "stable",
    },
    {
      skill: "Cloud Computing",
      currentLevel: 40,
      requiredLevel: 60,
      gap: 20,
      priority: "high",
      trend: "rising",
    },
  ]

  const strengths = [
    { skill: "Python Programming", level: 85, relevance: "high" },
    { skill: "Statistical Analysis", level: 80, relevance: "high" },
    { skill: "SQL", level: 75, relevance: "medium" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Skills Gap Analysis
        </CardTitle>
        <CardDescription>Based on your career goal: Data Scientist</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gaps">Gaps to Fill</TabsTrigger>
            <TabsTrigger value="strengths">Current Strengths</TabsTrigger>
          </TabsList>

          <TabsContent value="gaps" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">
                Here are the skills to develop to reach your career goal
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {skillGaps.map((gap, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{gap.skill}</span>
                    {gap.trend === "rising" && <TrendingUp className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(gap.priority)}>
                      {gap.priority === "high"
                        ? "High priority"
                        : gap.priority === "medium"
                          ? "Medeium priority"
                          : "Low priority"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Gap: {gap.gap}%</span>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-200">
                    <div
                      style={{ width: `${gap.currentLevel}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></div>
                    <div
                      style={{ width: `${gap.gap}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-primary/30"
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Actual level: {gap.currentLevel}%</span>
                  <span>Required level: {gap.requiredLevel}%</span>
                </div>

                <div className="flex justify-end">
                  <Button variant="link" size="sm" className="text-primary">
                    See the recommended trainings
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="p-4 bg-amber-50 rounded-lg mt-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Job Market Analysis</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Deep Learning and Cloud Computing skills are in high demand in your region, with
                    a 35% growth in job postings mentioning these skills over the past 6 months.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strengths" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Your most developed skills that are relevant to your career goal
            </p>

            {strengths.map((strength, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{strength.skill}</span>
                  </div>
                  <Badge
                    className={
                      strength.relevance === "high" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }
                  >
                    {strength.relevance === "high" ? "Très pertinent" : "Pertinent"}
                  </Badge>
                </div>

                <Progress value={strength.level} className="h-2" />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Level: {strength.level}%</span>
                  <span>{strength.level >= 80 ? "Expert" : strength.level >= 60 ? "Avancé" : "Intermédiaire"}</span>
                </div>
              </div>
            ))}

            <div className="p-4 bg-green-50 rounded-lg mt-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Your Distinctive Assets</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your combination of Python and statistical analysis skills places you in the top 15% of
                    candidates for Data Scientist positions. These skills are mentioned in 85% of job postings
                    in this field.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
