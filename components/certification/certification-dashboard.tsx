"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, Clock, Download, ExternalLink, Lock, Share2, Shield } from "lucide-react"

export function CertificationDashboard() {
  const [activeTab, setActiveTab] = useState("earned")

  const earnedCertifications = [
    {
      id: "cert-001",
      title: "Python for Data Science",
      issuer: "DataCamp",
      issueDate: "15 march 2023",
      expiryDate: "15 march 2025",
      skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
      credentialId: "DC-PY-2023-78945",
      verified: true,
    },
    {
      id: "cert-002",
      title: "Machine Learning Fundamentals",
      issuer: "Coursera",
      issueDate: "22 june 2023",
      expiryDate: "Without expiration",
      skills: ["Supervised Learning", "Model Evaluation", "Scikit-Learn"],
      credentialId: "CRSRA-ML-2023-12345",
      verified: true,
    },
  ]

  const inProgressCertifications = [
    {
      id: "cert-003",
      title: "Deep Learning Specialization",
      issuer: "Coursera",
      progress: 65,
      estimatedCompletion: "15 july 2023",
      modules: [
        { name: "Neural Networks and Deep Learning", completed: true },
        { name: "Improving Deep Neural Networks", completed: true },
        { name: "Structuring Machine Learning Projects", completed: false },
        { name: "Convolutional Neural Networks", completed: false },
        { name: "Sequence Models", completed: false },
      ],
    },
    {
      id: "cert-004",
      title: "Data Engineering with Apache Spark",
      issuer: "edX",
      progress: 30,
      estimatedCompletion: "30 august 2023",
      modules: [
        { name: "Introduction to Apache Spark", completed: true },
        { name: "Spark SQL and DataFrames", completed: true },
        { name: "Spark Streaming", completed: false },
        { name: "Machine Learning with MLlib", completed: false },
      ],
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certifications and Badges
        </CardTitle>
        <CardDescription>Manage your certifications and track your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="in-progress">In progress</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="space-y-6">
            {earnedCertifications.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex items-center justify-center bg-slate-50 md:w-1/4">
                    <div className="relative w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full">
                      <Award className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      {cert.verified && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date of achievement</p>
                        <p className="text-sm">{cert.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expiration date</p>
                        <p className="text-sm">{cert.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Certification ID</p>
                        <p className="text-sm">{cert.credentialId}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Validated skills</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            {inProgressCertifications.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex items-center justify-center bg-slate-50 md:w-1/4">
                    <div className="relative w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full">
                      <Clock className="h-12 w-12 text-blue-500" />
                    </div>
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        In progress
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress: {cert.progress}%</span>
                        <span className="text-sm text-muted-foreground">Estimated completion: {cert.estimatedCompletion}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${cert.progress}%` }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Modules:</p>
                      <div className="space-y-2">
                        {cert.modules.map((module, idx) => (
                          <div key={idx} className="flex items-center">
                            {module.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <Lock className="h-4 w-4 text-slate-400 mr-2" />
                            )}
                            <span className={`text-sm ${module.completed ? "text-slate-900" : "text-slate-500"}`}>
                              {module.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button>Continue learning</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="flex items-center justify-center h-40 border rounded-md border-dashed">
              <p className="text-slate-500">No recommended certifications at the moment</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
