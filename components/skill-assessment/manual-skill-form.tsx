"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ManualSkillForm() {
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({
    python: 50,
    "data-analysis": 30,
    "machine-learning": 20,
    communication: 70,
    "project-management": 60,
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSkillChange = (skill: string, value: number[]) => {
    setSkillLevels((prev) => ({ ...prev, [skill]: value[0] }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    console.log("Submitted manual assessment:", { experienceLevel, skillLevels })
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self-Assessment</CardTitle>
        <CardDescription>Evaluate your skills and experience level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
            {[
              ["beginner", "Beginner (0-2 years)"],
              ["intermediate", "Intermediate (3-5 years)"],
              ["advanced", "Advanced (6-10 years)"],
              ["expert", "Expert (10+ years)"],
            ].map(([val, label]) => (
              <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={val} />
                <Label htmlFor={val}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Technical Skills</Label>
          {Object.entries(skillLevels).map(([skill, level]) => (
            <div key={skill} className="space-y-2">
              <div className="flex justify-between">
                <span className="capitalize">{skill.replace("-", " ")}</span>
                <span>{level}%</span>
              </div>
              <Slider
                defaultValue={[level]}
                max={100}
                step={5}
                onValueChange={(val) => handleSkillChange(skill, val)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} loading={isSubmitting} className="w-full">
          {isSubmitting ? "Processing..." : "Save Self-Assessment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
