"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CVUploadAnalyzer } from "@/components/skill-assessment/cv-upload-analyzer"
import { ManualSkillForm} from "@/components/skill-assessment/manual-skill-form"
import { SkillGapAnalysis } from "@/components/skill-assessment/skill-gap-analysis"

export function SkillEvaluationForm() {
  const [activeTab, setActiveTab] = useState<"self" | "upload" | "gap">("self");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skills Assessment</CardTitle>
        <CardDescription>
          Choose a method to evaluate your profile and get recommendations
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "self" | "upload" | "gap")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="self">Self-Assessment</TabsTrigger>
            <TabsTrigger value="upload">Import CV</TabsTrigger>
            <TabsTrigger value="gap">Test / Gaps</TabsTrigger>
          </TabsList>

          {/* 1) Manual sliders */}
          <TabsContent value="self" className="mt-4">
            <ManualSkillForm />
          </TabsContent>

          {/* 2) CV upload & analyzer */}
          <TabsContent value="upload" className="mt-4">
            <CVUploadAnalyzer />
          </TabsContent>

          {/* 3) Skill-gap or test */}
          <TabsContent value="gap" className="mt-4">
            <SkillGapAnalysis />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}