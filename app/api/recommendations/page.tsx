"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, BriefcaseBusiness, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RecommendationsPage() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const [recommendations, setRecommendations] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("cvAnalysisResult")
    if (storedResult) {
      setAnalysisResult(JSON.parse(storedResult))
    }

    const loadRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations")
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to load recommendations")
        }

        const data = await response.json()
        setRecommendations(data)
      } catch (error) {
        console.error("Error loading recommendations:", error)
        setRecommendations(null)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [router])

  if (!analysisResult && !recommendations && loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Loading recommendations...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Personalized Recommendations</h1>
        <p className="text-center text-muted-foreground mb-8">
          Based on your skills assessment and market trends
        </p>

        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="careers">Careers</TabsTrigger>
            <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations?.courses.map((course: any) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                    <h3 className="font-medium text-lg">{course.title}</h3>
                    <div className="text-sm text-slate-600">{course.provider}</div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600 mb-3">{course.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.skills.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Niveau</p>
                        <p>{course.level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Durée</p>
                        <p>{course.duration}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-2 rounded-md text-xs text-amber-800 mb-4">
                      <p className="font-medium">Relevance</p>
                      <p>{(course.relevance * 100).toFixed(0)}% match</p>
                    </div>

                    {course.url ? (
                      <Button className="w-full" asChild>
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Course
                        </a>
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Course
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            {recommendations?.careerPaths.map((path: any) => (
              <Card key={path.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-1/3 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{path.title}</h3>
                      <Badge className="bg-green-100 text-green-800">Match: {path.match}</Badge>
                      <p className="text-sm text-slate-600 mt-3">{path.description}</p>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground">Salaire moyen</p>
                        <p className="font-medium">{path.averageSalary}</p>
                      </div>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{path.growthRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:w-2/3">
                    <div className="mb-6">
                      <h4 className="font-medium mb-2 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {path.matchedSkills?.map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-green-100 text-green-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        Skills to Develop
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {path.missingSkills?.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-amber-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="text-xs text-muted-foreground">Average Salary</p>
                      <p className="font-medium">{path.averageSalary}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{path.growthRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Skill Gap Analysis
                </CardTitle>
                <CardDescription>Based on your current skills and market requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recommendations?.skillGaps?.filter((gap: any) => gap.gap > 0).map((gap: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{gap.skill}</span>
                        {gap.trend === "rising" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            gap.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : gap.priority === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {gap.priority === "high"
                            ? "High Priority"
                            : gap.priority === "medium"
                              ? "Medium Priority"
                              : "Low Priority"}
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
                      <span>Current Level: {gap.currentLevel}%</span>
                      <span>Required Level: {gap.requiredLevel}%</span>
                    </div>
                  </div>
                ))}
                {(!recommendations?.skillGaps || recommendations.skillGaps.filter((gap: any) => gap.gap > 0).length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    No significant skill gaps identified. Great job!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
