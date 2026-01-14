"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, CheckCircle, User, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

type UserSkill = {
  id?: string
  name: string
  level: number
  category?: string
}

type UserProfileData = {
  id?: string
  name: string
  email: string
  bio?: string
  jobTitle?: string
  company?: string
  location?: string
  website?: string
  image?: string | null
  skills?: UserSkill[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "loading") {
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in to view your profile")
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          const errorData = await response.json().catch(() => ({ error: "Error retrieving profile" }))
          throw new Error(errorData.error || "Error retrieving profile")
        }
        
        const data = await response.json()
        console.log("Profile data received:", data)
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError(error instanceof Error ? error.message : "Unable to load your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev: UserProfileData | null) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSkillLevelChange = (skillIndex: number, value: number[]) => {
    if (!profile || !profile.skills) return

    const updatedSkills = [...profile.skills]
    updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], level: value[0] }

    setProfile({ ...profile, skills: updatedSkills })
  }

  const handleAddSkill = () => {
    if (!profile) return

    const newSkills = [...(profile.skills || [])]
    newSkills.push({ name: "", level: 50, category: "other" })

    setProfile({ ...profile, skills: newSkills })
  }

  const handleSkillNameChange = (skillIndex: number, value: string) => {
    if (!profile || !profile.skills) return

    const updatedSkills = [...profile.skills]
    updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], name: value }

    setProfile({ ...profile, skills: updatedSkills })
  }

  const handleSkillCategoryChange = (skillIndex: number, value: string) => {
    if (!profile || !profile.skills) return

    const updatedSkills = [...profile.skills]
    updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], category: value }

    setProfile({ ...profile, skills: updatedSkills })
  }

  const handleRemoveSkill = (skillIndex: number) => {
    if (!profile || !profile.skills) return

    const updatedSkills = profile.skills.filter((_: UserSkill, index: number) => index !== skillIndex)
    setProfile({ ...profile, skills: updatedSkills })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      setError("You must be logged in to update your profile")
      return
    }
    
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        const errorData = await response.json().catch(() => ({ error: "Error updating profile" }))
        throw new Error(errorData.error || "Error updating profile")
      }

      const updatedProfile = await response.json()
      console.log("Profile updated:", updatedProfile)
      setProfile(updatedProfile)
      setSuccess("Profile updated successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error instanceof Error ? error.message : "Unable to update your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Loading your profile...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile?.image || ""} alt={profile?.name || "Avatar"} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : <User />}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <p className="text-muted-foreground">{profile?.jobTitle || "Job Title"}</p>
                <p className="text-sm text-muted-foreground mt-1">{profile?.location || "Location"}</p>

                <div className="w-full mt-6">
                  <h3 className="font-medium mb-2">Main Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.slice(0, 5).map((skill: UserSkill, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Edit my profile</CardTitle>
                <CardDescription>Update your personal and professional information</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="personal">Personal Information</TabsTrigger>
                      <TabsTrigger value="professional">Professional Information</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profile?.name || ""}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={profile?.email || ""}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profile?.bio || ""}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profile?.location || ""}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={profile?.website || ""}
                            onChange={handleInputChange}
                            placeholder="https://votre-site.com"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="professional" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            value={profile?.jobTitle || ""}
                            onChange={handleInputChange}
                            placeholder="Ex: Full Stack Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            value={profile?.company || ""}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">My Skills</h3>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                          Add Skill
                        </Button>
                      </div>

                      {profile?.skills?.map((skill: UserSkill, index: number) => (
                        <div key={index} className="border p-4 rounded-md space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                              <div className="space-y-2">
                                <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                                <Input
                                  id={`skill-name-${index}`}
                                  value={skill.name}
                                  onChange={(e) => handleSkillNameChange(index, e.target.value)}
                                  placeholder="Ex: Python"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`skill-category-${index}`}>Category</Label>
                                <select
                                  id={`skill-category-${index}`}
                                  value={skill.category}
                                  onChange={(e) => handleSkillCategoryChange(index, e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                >
                                  <option value="programming">Programming</option>
                                  <option value="data">Data</option>
                                  <option value="ai">Artificial Intelligence</option>
                                  <option value="design">Design</option>
                                  <option value="management">Management</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label htmlFor={`skill-level-${index}`}>Level</Label>
                                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                                </div>
                                <Slider
                                  id={`skill-level-${index}`}
                                  defaultValue={[skill.level]}
                                  max={100}
                                  step={5}
                                  onValueChange={(value) => handleSkillLevelChange(index, value)}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Beginner</span>
                                  <span>Intermediate</span>
                                  <span>Expert</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSkill(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {(!profile?.skills || profile.skills.length === 0) && (
                        <div className="flex items-center justify-center h-32 border rounded-md border-dashed">
                          <p className="text-muted-foreground">
                            You haven't added any skills yet. Click "Add Skill" to get started.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
