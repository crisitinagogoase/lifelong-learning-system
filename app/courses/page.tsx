'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { BookOpen, Clock, BarChart, Search, Loader2, ExternalLink } from "lucide-react"

type Course = {
  id: number
  title: string
  description: string | null
  provider: string | null
  level: string | null
  duration: string | null
  url: string | null
  marketRelevance: number | null
  skills: Array<{ skillName: string }>
  prerequisites: Array<{ prerequisiteSkill: string }>
}

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading') {
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch courses
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (levelFilter !== 'all') params.append('level', levelFilter)

        const coursesResponse = await fetch(`/api/courses?${params.toString()}`, {
          credentials: "include",
        })

        if (!coursesResponse.ok) {
          throw new Error("Failed to load courses")
        }

        const coursesData = await coursesResponse.json()
        setCourses(coursesData)

        // Fetch enrollments if user is logged in
        if (session?.user?.id) {
          const enrollmentsResponse = await fetch("/api/enrollments", {
            credentials: "include",
          })

          if (enrollmentsResponse.ok) {
            const enrollments = await enrollmentsResponse.json()
            setEnrolledCourseIds(enrollments.map((e: any) => e.courseId))
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError(error instanceof Error ? error.message : "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, status, router, searchTerm, levelFilter])

  const handleEnroll = async (courseId: number) => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to enroll')
      }

      setEnrolledCourseIds([...enrolledCourseIds, courseId])
      alert('Successfully enrolled in course!')
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(error instanceof Error ? error.message : 'Failed to enroll in course')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-primary/70 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No courses found</h2>
            <p className="text-slate-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id)
              
              return (
                <Card key={course.id} className="overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex justify-between text-sm text-slate-500 mb-4">
                      {course.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.level && (
                        <div className="flex items-center">
                          <BarChart className="h-4 w-4 mr-1" />
                          <span>{course.level}</span>
                        </div>
                      )}
                    </div>

                    {course.provider && (
                      <div className="text-sm text-slate-600 mb-4">
                        Provider: <span className="font-medium">{course.provider}</span>
                      </div>
                    )}

                    {course.skills && course.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-medium text-slate-500 mb-2">Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {skill.skillName}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-xs text-slate-500">+{course.skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {course.marketRelevance && (
                      <div className="text-xs text-slate-500">
                        Market Relevance: {(parseFloat(course.marketRelevance.toString()) * 100).toFixed(0)}%
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {isEnrolled ? (
                      <Link href={`/learning/${course.id}`} className="flex-1">
                        <Button className="w-full">Continue Learning</Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEnroll(course.id)}
                          className="flex-1"
                        >
                          Enroll
                        </Button>
                        {course.url && (
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
