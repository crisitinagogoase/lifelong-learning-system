'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from "next/link"

const careerPathData = {
  'Data Scientist': [
    { id: 'ds1', title: 'Introduction to Python for Data Science', duration: '6 weeks', level: 'Beginner' },
    { id: 'ds2', title: 'Statistics and Machine Learning', duration: '8 weeks', level: 'Intermediate' },
    { id: 'ds3', title: 'Deep Learning with TensorFlow', duration: '10 weeks', level: 'Advanced' },
  ],
  'Full Stack Developer': [
    { id: 'fs1', title: 'HTML, CSS and JavaScript Fundamentals', duration: '4 weeks', level: 'Beginner' },
    { id: 'fs2', title: 'React and Node.js', duration: '8 weeks', level: 'Intermediate' },
    { id: 'fs3', title: 'Microservices Architecture and Cloud Deployment', duration: '6 weeks', level: 'Advanced' },
  ],
  'Product Manager': [
    { id: 'pm1', title: 'Product Management Fundamentals', duration: '4 weeks', level: 'Beginner' },
    { id: 'pm2', title: 'User Research and Product Analytics', duration: '6 weeks', level: 'Intermediate' },
    { id: 'pm3', title: 'Product Leadership and Go-To-Market Strategy', duration: '8 weeks', level: 'Advanced' },
  ],
  'UX/UI Designer': [
    { id: 'ux1', title: 'UX/UI Design Principles', duration: '5 weeks', level: 'Beginner' },
    { id: 'ux2', title: 'Prototyping and User Testing', duration: '6 weeks', level: 'Intermediate' },
    { id: 'ux3', title: 'Design Systems and Accessibility', duration: '7 weeks', level: 'Advanced' },
  ],
  'Cloud Architect': [
    { id: 'cloud1', title: 'Cloud Computing Fundamentals', duration: '5 weeks', level: 'Beginner' },
    { id: 'cloud2', title: 'Multi-Cloud Architecture and Security', duration: '8 weeks', level: 'Intermediate' },
    { id: 'cloud3', title: 'Containerization and Kubernetes', duration: '6 weeks', level: 'Advanced' },
  ]
}

type Enrollment = {
  id: number
  courseId: number
  progress: number
  course: {
    id: number
    title: string
    description: string | null
    provider: string | null
    level: string | null
    duration: string | null
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [userSkills, setUserSkills] = useState<Record<string, number>>({})
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const savedCareer = localStorage.getItem('selectedCareer')
      if (savedCareer) {
        setSelectedCareer(savedCareer)
      }
      
      // Fetch real enrollments from API
      const fetchData = async () => {
        try {
          // Fetch enrollments
          const enrollmentsResponse = await fetch('/api/enrollments', {
            credentials: 'include',
          })
          if (enrollmentsResponse.ok) {
            const enrollmentsData = await enrollmentsResponse.json()
            setEnrollments(enrollmentsData)
          }

          // Fetch user skills from profile
          const profileResponse = await fetch('/api/profile', {
            credentials: 'include',
          })
          if (profileResponse.ok) {
            const profile = await profileResponse.json()
            if (profile.skills) {
              const skillsMap: Record<string, number> = {}
              profile.skills.forEach((skill: any) => {
                skillsMap[skill.name || skill.skillName] = skill.level || skill.skillLevel || 0
              })
              setUserSkills(skillsMap)
            }
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchData()
    } else if (status === 'authenticated') {
      setLoading(false)
    }
  }, [status, session])

  const handleCareerSelection = (career: string) => {
    setSelectedCareer(career)
    localStorage.setItem('selectedCareer', career)
  }

  const handleCourseEnroll = async (courseId: string) => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ courseId: parseInt(courseId) }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to enroll')
      }

      const enrollment = await response.json()
      setEnrollments([...enrollments, enrollment])
      alert('You have been successfully enrolled in the course!')
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(error instanceof Error ? error.message : 'Failed to enroll in course')
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="font-bold text-xl text-primary">CareerGrowth</div>
          </Link>
          <div className="flex items-center space-x-4">
            {session?.user?.email && (
              <span className="text-sm">{session.user.email}</span>
            )}
            <Link href="/profile">
              <Button onClick={() => {}}>My Account</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Career Goal Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>1</span>
              </div>
              <h2 className="text-xl font-bold ml-3">Career Goal</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Select your professional goal to personalize your learning path.
            </p>
            
            <div className="space-y-3">
              {Object.keys(careerPathData).map((career) => (
                <div 
                  key={career} 
                  onClick={() => handleCareerSelection(career)}
                  className={`p-3 rounded-md border cursor-pointer flex items-center justify-between ${
                    selectedCareer === career ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedCareer === career}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{career}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
            
            {!selectedCareer && (
              <Button 
                onClick={() => {}}
                className="w-full mt-4"
                disabled
              >
                Set Goal
              </Button>
            )}
          </div>

          {/* Skills Assessment */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>2</span>
              </div>
              <h2 className="text-xl font-bold ml-3">Current Skills</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(userSkills).length > 0 ? (
                Object.entries(userSkills).map(([skill, level]) => (
                  <div key={skill} className="flex flex-col mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill}</span>
                      <span className="text-sm text-slate-500">Level {Math.round((level / 100) * 5)}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, level)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No skills assessed yet</p>
              )}
            </div>
            
            <Link href="/assessment">
              <Button className="w-full mt-6">
                Assess my skills
              </Button>
            </Link>
          </div>

          {/* Course Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span>3</span>
              </div>
              <h2 className="text-xl font-bold ml-3">Recommended Path</h2>
            </div>
            
            {selectedCareer ? (
              <div className="space-y-4">
                <p className="text-slate-600">Path for: <strong>{selectedCareer}</strong></p>
                <p className="text-sm text-slate-500">
                  Visit the <Link href="/courses" className="text-blue-600 hover:underline">Courses page</Link> to browse and enroll in courses.
                </p>
                <Link href="/courses">
                  <Button className="w-full mt-3">
                    Browse All Courses
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-slate-500 mb-3">Select a career goal to see recommended courses</p>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Courses Section */}
        {enrollments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrollments.map(enrollment => {
                const course = enrollment.course
                return (
                  <div key={enrollment.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">{course.description || "No description"}</p>
                    <div className="flex justify-between text-xs text-slate-500 mb-3">
                      {course.level && <span>{course.level}</span>}
                      {course.duration && <span>{course.duration}</span>}
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link href={`/learning/${course.id}`}>
                      <Button className="w-full">
                        {enrollment.progress === 100 ? "Review Course" : "Continue Learning"}
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
