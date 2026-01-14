"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, LineChart, MapPin, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function JobMarketTrends() {
  const [activeTab, setActiveTab] = useState("skills")
  const [timeframe, setTimeframe] = useState("6m")
  const [region, setRegion] = useState("all")

  const trendingSkills = [
    {
      name: "Machine Learning",
      growth: 35,
      demandLevel: "high",
      salaryImpact: "+15%",
      jobCount: 12500,
    },
    {
      name: "Cloud Computing",
      growth: 42,
      demandLevel: "high",
      salaryImpact: "+18%",
      jobCount: 15800,
    },
    {
      name: "Data Engineering",
      growth: 28,
      demandLevel: "high",
      salaryImpact: "+12%",
      jobCount: 9200,
    },
  ]

  const emergingRoles = [
    {
      title: "MLOps Engineer",
      growth: 85,
      avgSalary: "85 000 €",
      requiredSkills: ["Machine Learning", "DevOps", "Cloud", "CI/CD"],
      companies: ["Google", "Amazon", "Microsoft", "Startups"],
    },
    {
      title: "AI Ethics Specialist",
      growth: 120,
      avgSalary: "78 000 €",
      requiredSkills: ["AI", "Ethics", "Compliance", "Research"],
      companies: ["IBM", "Meta", "Consultancies"],
    },
  ]

  const getDemandBadge = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "low":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Job Market Trends
            </CardTitle>
            <CardDescription>Analysis of in-demand skills and roles</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 months</SelectItem>
                <SelectItem value="6m">6 months</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
                <SelectItem value="2y">2 years</SelectItem>
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="na">North America</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="skills">In-Demand Skills</TabsTrigger>
            <TabsTrigger value="roles">Emerging Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">
                Skills with the highest demand growth over the{" "}
                {timeframe === "3m"
                  ? "last 3 months"
                  : timeframe === "6m"
                    ? "last 6 months"
                    : timeframe === "1y"
                      ? "last 12 months"
                      : "last 2 years"}
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="space-y-4">
              {trendingSkills.map((skill, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{skill.name}</h3>
                      <div className="flex items-center mt-1">
                        <Badge className={getDemandBadge(skill.demandLevel)}>
                          {skill.demandLevel === "high"
                            ? "Forte demande"
                            : skill.demandLevel === "medium"
                              ? "Demande moyenne"
                              : "Demande faible"}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-2 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{skill.growth}% en{" "}
                          {timeframe === "3m"
                            ? "3 mois"
                            : timeframe === "6m"
                              ? "6 mois"
                              : timeframe === "1y"
                                ? "1 an"
                                : "2 ans"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{skill.jobCount.toLocaleString()} offres</p>
                      <p className="text-xs text-green-600">Salary Impact: {skill.salaryImpact}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                        <span className="text-xs text-muted-foreground">
                          {region === "all"
                            ? "Mondial"
                            : region === "europe"
                              ? "Europe"
                              : region === "na"
                                ? "Amérique du Nord"
                                : "Asie"}
                        </span>
                      </div>
                      <Button variant="link" size="sm" className="h-6 p-0 text-primary">
                        See the recommended trainings
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Data based on the analysis of 1.2M job offers</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">
              New professional roles with the highest growth
            </p>

            {emergingRoles.map((role, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{role.title}</h3>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">emerging role</Badge>
                        <span className="text-sm text-muted-foreground ml-2 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{role.growth}% growth
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Average salary</p>
                      <p className="text-lg font-bold text-green-600">{role.avgSalary}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {role.requiredSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Hiring Companies</p>
                    <p className="text-sm">{role.companies.join(", ")}</p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button>Explore this career path</Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Forecasts based on trends from the last 24 months</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
