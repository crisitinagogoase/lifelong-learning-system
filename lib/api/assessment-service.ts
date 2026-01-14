export type Skill = {
  id: string
  name: string
  category: string
  level: number
}

export type SkillAssessment = {
  userId: string
  skills: Skill[]
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert"
  assessmentDate: Date
  source: "self-assessment" | "cv-analysis" | "skill-test"
}

export type SkillGap = {
  skillId: string
  skillName: string
  currentLevel: number
  requiredLevel: number
  gap: number
  priority: "high" | "medium" | "low"
  trend: "rising" | "stable" | "declining"
}

export class AssessmentService {
  static async evaluateSkills(
    userId: string,
    skills: Skill[],
    experienceLevel: string,
    source: string,
  ): Promise<SkillAssessment> {
    try {
      console.log("Évaluation des compétences pour l'utilisateur:", userId)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const assessment: SkillAssessment = {
        userId,
        skills,
        experienceLevel: experienceLevel as "beginner" | "intermediate" | "advanced" | "expert",
        assessmentDate: new Date(),
        source: source as "self-assessment" | "cv-analysis" | "skill-test",
      }

      return assessment
    } catch (error) {
      console.error("Erreur lors de l'évaluation des compétences:", error)
      throw error
    }
  }

  static async analyzeSkillGaps(userId: string, careerGoalId: string): Promise<SkillGap[]> {
    try {
      console.log("Analyse des écarts de compétences pour l'utilisateur:", userId, "et l'objectif:", careerGoalId)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const skillGaps: SkillGap[] = [
        {
          skillId: "deep-learning",
          skillName: "Deep Learning",
          currentLevel: 25,
          requiredLevel: 70,
          gap: 45,
          priority: "high",
          trend: "rising",
        },
        {
          skillId: "data-engineering",
          skillName: "Data Engineering",
          currentLevel: 30,
          requiredLevel: 65,
          gap: 35,
          priority: "medium",
          trend: "stable",
        },
      ]

      return skillGaps
    } catch (error) {
      console.error("Erreur lors de l'analyse des écarts de compétences:", error)
      throw error
    }
  }

  static async extractSkillsFromCV(cvFile: File): Promise<Skill[]> {
    try {
      console.log("Extraction des compétences du CV:", cvFile.name)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const extractedSkills: Skill[] = [
        { id: "python", name: "Python", category: "programming", level: 75 },
        { id: "data-analysis", name: "Data Analysis", category: "data", level: 70 },
        { id: "machine-learning", name: "Machine Learning", category: "ai", level: 60 },
      ]

      return extractedSkills
    } catch (error) {
      console.error("Erreur lors de l'extraction des compétences du CV:", error)
      throw error
    }
  }
}
