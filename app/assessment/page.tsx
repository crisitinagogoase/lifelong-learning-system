'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";  
import { SkillEvaluationForm } from "@/components/skill-assessment/skill-evaluation-form";
import { CVUploadAnalyzer } from "@/components/skill-assessment/cv-upload-analyzer";
import { SkillGapAnalysis } from "@/components/skill-assessment/skill-gap-analysis";

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Skills Assessment</h1>

        <Tabs defaultValue="auto">
          <TabsList>
            <TabsTrigger value="auto">Self-Assessment</TabsTrigger>
            <TabsTrigger value="cv">Import CV</TabsTrigger>
            <TabsTrigger value="test">Skills Test</TabsTrigger>
          </TabsList>

          <TabsContent value="auto">
            <SkillEvaluationForm />
          </TabsContent>

          <TabsContent value="cv">
            <CVUploadAnalyzer />
          </TabsContent>

          <TabsContent value="test">
            <SkillGapAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
