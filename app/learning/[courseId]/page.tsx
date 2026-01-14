'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import Link from "next/link"
import { Loader2, ExternalLink } from "lucide-react"

type Course = {
  id: number
  title: string
  description: string | null
  provider: string | null
  level: string | null
  duration: string | null
  url: string | null
  skills: Array<{ skillName: string }>
  prerequisites: Array<{ prerequisiteSkill: string }>
}

type Enrollment = {
  id: number
  progress: number
  completedAt: string | null
}

export default function CoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingProgress, setUpdatingProgress] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading') {
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in to view this course")
      setLoading(false)
      return
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const courseIdNum = parseInt(courseId)
        if (isNaN(courseIdNum)) {
          throw new Error("Invalid course ID")
        }

        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseIdNum}`, {
          credentials: "include",
        })
        
        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            throw new Error("Course not found")
          }
          throw new Error("Failed to load course")
        }
        
        const courseData = await courseResponse.json()
        setCourse(courseData)

        // Fetch enrollment data
        const enrollmentsResponse = await fetch("/api/enrollments", {
          credentials: "include",
        })
        
        if (enrollmentsResponse.ok) {
          const enrollments = await enrollmentsResponse.json()
          const userEnrollment = enrollments.find((e: any) => e.courseId === courseIdNum)
          if (userEnrollment) {
            setEnrollment(userEnrollment)
          } else {
            // User is not enrolled, redirect to enroll
            router.push(`/learning?enroll=${courseIdNum}`)
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        setError(error instanceof Error ? error.message : "Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseData()
    }
  }, [courseId, session, status, router])

  const updateProgress = async (newProgress: number) => {
    if (!enrollment) return

    try {
      setUpdatingProgress(true)
      const response = await fetch(`/api/enrollments/${enrollment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ progress: newProgress }),
      })

      if (!response.ok) {
        throw new Error("Failed to update progress")
      }

      const updated = await response.json()
      setEnrollment(updated)
    } catch (error) {
      console.error("Error updating progress:", error)
      alert("Failed to update progress. Please try again.")
    } finally {
      setUpdatingProgress(false)
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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error || "Course not found"}
          </div>
          <Link href="/learning">
            <Button className="mt-4">Back to My Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = enrollment?.progress || 0

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-slate-600 mb-4">{course.description || "No description available"}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                {course.duration && (
                  <div className="flex items-center">
                    <span className="mr-1">⏱️</span> {course.duration}
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center">
                    <span className="mr-1">📊</span> {course.level}
                  </div>
                )}
                {course.provider && (
                  <div className="flex items-center">
                    <span className="mr-1">🏢</span> {course.provider}
                  </div>
                )}
              </div>

              {course.skills && course.skills.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium mr-2">Skills covered:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {skill.skillName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium mr-2">Prerequisites:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.prerequisites.map((prereq, idx) => (
                      <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {prereq.prerequisiteSkill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white px-6 py-4 rounded-lg border text-center ml-6">
              <div className="text-3xl font-bold text-blue-500 mb-1">{progress}%</div>
              <div className="text-sm text-slate-500">Progress</div>
              {enrollment?.completedAt && (
                <div className="text-xs text-green-600 mt-2">✓ Completed</div>
              )}
            </div>
          </div>

          {course.url && (
            <div className="mb-4">
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open course on {course.provider || "external platform"}
              </a>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Course Content</h2>
          
          {course.url ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                This course is hosted on an external platform. Click the link above to access the full course content.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                You can track your progress here. Update your progress manually as you complete sections of the course.
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateProgress(Math.max(0, progress - 10))}
                    disabled={updatingProgress || progress === 0}
                    variant="outline"
                  >
                    -10%
                  </Button>
                  <Button
                    onClick={() => updateProgress(Math.min(100, progress + 10))}
                    disabled={updatingProgress || progress === 100}
                  >
                    +10%
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateProgress(0)}
                    disabled={updatingProgress || progress === 0}
                    variant="outline"
                    size="sm"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => updateProgress(100)}
                    disabled={updatingProgress || progress === 100}
                    size="sm"
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>Course content will be available here soon.</p>
              <p className="text-sm mt-2">For now, you can track your progress manually.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/learning">
            <Button variant="outline">Back to My Courses</Button>
          </Link>
          {course.url && (
            <a href={course.url} target="_blank" rel="noopener noreferrer">
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Course
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
} 