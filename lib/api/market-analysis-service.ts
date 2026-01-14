export type TrendingSkill = {
  id: string
  name: string
  growth: number
  demandLevel: "high" | "medium" | "low"
  salaryImpact: string
  jobCount: number
}

export type EmergingRole = {
  id: string
  title: string
  growth: number
  avgSalary: string
  requiredSkills: string[]
  companies: string[]
}

export type MarketAnalysisParams = {
  timeframe: "3m" | "6m" | "1y" | "2y"
  region: "all" | "europe" | "na" | "asia"
  sector?: string
}

export class MarketAnalysisService {
  static async getTrendingSkills(params: MarketAnalysisParams): Promise<TrendingSkill[]> {
    try {
      console.log("Retrieving trending skills with parameters:", params)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const trendingSkills: TrendingSkill[] = [
        {
          id: "machine-learning",
          name: "Machine Learning",
          growth: 35,
          demandLevel: "high",
          salaryImpact: "+15%",
          jobCount: 12500,
        },
        {
          id: "cloud-computing",
          name: "Cloud Computing",
          growth: 42,
          demandLevel: "high",
          salaryImpact: "+18%",
          jobCount: 15800,
        },
      ]

      return trendingSkills
    } catch (error) {
      console.error("Error retrieving trending skills:", error)
      throw error
    }
  }

  static async getEmergingRoles(params: MarketAnalysisParams): Promise<EmergingRole[]> {
    try {
      console.log("Retrieving emerging roles with parameters:", params)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const emergingRoles: EmergingRole[] = [
        {
          id: "mlops-engineer",
          title: "MLOps Engineer",
          growth: 85,
          avgSalary: "85 000 €",
          requiredSkills: ["Machine Learning", "DevOps", "Cloud", "CI/CD"],
          companies: ["Google", "Amazon", "Microsoft", "Startups"],
        },
        {
          id: "ai-ethics",
          title: "AI Ethics Specialist",
          growth: 120,
          avgSalary: "78 000 €",
          requiredSkills: ["AI", "Ethics", "Compliance", "Research"],
          companies: ["IBM", "Meta", "Consultancies"],
        },
      ]

      return emergingRoles
    } catch (error) {
      console.error("Error retrieving emerging roles:", error)
      throw error
    }
  }

  static async getSkillForecast(
    sector: string,
    timeHorizon: "1y" | "3y" | "5y",
  ): Promise<
    {
      skill: string
      currentDemand: number
      projectedDemand: number
      confidence: number
    }[]
  > {
    try {
      console.log(
        "Récupération des prévisions de compétences pour le secteur:",
        sector,
        "avec un horizon de:",
        timeHorizon,
      )

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const forecast = [
        {
          skill: "Intelligence Artificielle",
          currentDemand: 100,
          projectedDemand: 180,
          confidence: 0.85,
        },
        {
          skill: "Cybersécurité",
          currentDemand: 100,
          projectedDemand: 150,
          confidence: 0.9,
        },
      ]

      return forecast
    } catch (error) {
      console.error("Erreur lors de la récupération des prévisions de compétences:", error)
      throw error
    }
  }
}
