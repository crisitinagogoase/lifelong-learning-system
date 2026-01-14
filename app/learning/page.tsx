'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import Link from "next/link"
import { BookOpen, Clock, BarChart, Loader2 } from "lucide-react"

type Enrollment = {
  id: number
  courseId: number
  progress: number
  enrolledAt: string
  completedAt: string | null
  course: {
    id: number
    title: string
    description: string | null
    provider: string | null
    level: string | null
    duration: string | null
    url: string | null
    skills: Array<{ skillName: string }>
  }
}

export default function LearningPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading') {
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in to view your courses")
      setLoading(false)
      return
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch("/api/enrollments", {
          credentials: "include",
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to load enrollments")
        }
        
        const data = await response.json()
        setEnrollments(data)
      } catch (error) {
        console.error("Error fetching enrollments:", error)
        setError(error instanceof Error ? error.message : "Failed to load your courses")
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [session, status, router])

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
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <BookOpen className="h-12 w-12 mx-auto text-primary/70" />
            </div>
            <h2 className="text-xl font-semibold mb-2">You are not enrolled in any courses</h2>
            <p className="text-slate-600 mb-6">Explore career paths to find courses that will help you achieve your goals.</p>
            <Link href="/dashboard">
              <Button>Explore Paths</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(enrollment => {
              const course = enrollment.course
              const progress = enrollment.progress
              
              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div 
                    className="h-3 bg-slate-100" 
                    style={{ 
                      background: `linear-gradient(to right, #3b82f6 ${progress}%, #e2e8f0 ${progress}%)` 
                    }} 
                  />
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description || "No description available"}</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                    
                    {course.skills && course.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {skill.skillName}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-xs text-slate-500">+{course.skills.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      {enrollment.completedAt && (
                        <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/learning/${course.id}`} className="w-full">
                      <Button className="w-full">
                        {progress === 100 ? "Review Course" : "Continue Learning"}
                      </Button>
                    </Link>
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
