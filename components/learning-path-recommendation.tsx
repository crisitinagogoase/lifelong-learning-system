"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Clock, GraduationCap, LayoutGrid, List, Star, Trophy } from "lucide-react"

export function LearningPathRecommendation() {
  const [viewMode, setViewMode] = useState("list")

  const courses = [
    {
      id: 1,
      title: "Adavanced Deep Learning with PyTorch",
      provider: "DataCamp",
      duration: "8 weeks",
      level: "Advanced",
      rating: 4.8,
      skills: ["Deep Learning", "PyTorch", "Computer Vision"],
      priority: "High",
      startDate: "15 june 2023",
    },
    {
      id: 2,
      title: "Data Engineering with Apache Spark",
      provider: "Coursera",
      duration: "6 weeks",
      level: "Intermediate",
      rating: 4.5,
      skills: ["Data Engineering", "Spark", "Big Data"],
      priority: "Medium",
      startDate: "1 july 2023",
    },
    {
      id: 3,
      title: "Statistics for Data Scientists",
      provider: "edX",
      duration: "4 weeks",
      level: "Intermediate",
      rating: 4.7,
      skills: ["Statistiques", "R", "Analyse de Données"],
      priority: "High",
      startDate: "10 june 2023",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Parcours d'Apprentissage Recommandé
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-slate-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-slate-100" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommended">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="inprogress">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended">
            {viewMode === "list" ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="text-sm text-slate-500">{course.provider}</div>
                        <div className="flex items-center mt-2 space-x-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-slate-400" />
                            {course.duration}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                            {course.rating}
                          </div>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-1 text-slate-400" />
                            {course.level}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {course.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge
                        className={
                          course.priority === "Élevée"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {course.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Start: {course.startDate}
                      </div>
                      <Button size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="text-sm text-slate-600">{course.provider}</div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {course.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-slate-400" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inprogress">
            <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
              <p className="text-slate-500">No courses currently in progress</p>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
              <p className="text-slate-500">No completed courses</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
