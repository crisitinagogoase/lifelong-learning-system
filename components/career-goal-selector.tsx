"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight, Target, TrendingUp } from "lucide-react"

export function CareerGoalSelector() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const careerGoals = [
    { id: "data-scientist", name: "Data Scientist" },
    { id: "fullstack-dev", name: "Développeur Full Stack" },
    { id: "product-manager", name: "Chef de Produit" },
    { id: "ux-designer", name: "Designer UX/UI" },
    { id: "cloud-architect", name: "Architecte Cloud" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Career Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Select your career goal to personalize your learning journey.
          </div>

          <RadioGroup value={selectedGoal || ""} onValueChange={setSelectedGoal}>
            <div className="space-y-2">
              {careerGoals.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                  <RadioGroupItem value={goal.id} id={goal.id} />
                  <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                    {goal.name}
                  </Label>
                  <TrendingUp
                    className={`h-4 w-4 ${goal.id === "data-scientist" || goal.id === "cloud-architect" ? "text-green-500" : "text-slate-400"}`}
                  />
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button className="w-full mt-4" disabled={!selectedGoal}>
            Define the objective <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
