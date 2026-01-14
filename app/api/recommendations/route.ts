import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth"
import { getUserProfile } from "@/lib/services/profile-service"
import { CVAnalysisService } from "@/lib/services/cv-analysis-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile with skills
    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Convert user skills to CV analysis format
    const levelMap: Record<number, "beginner" | "intermediate" | "advanced" | "expert"> = {
      0: "beginner",
      25: "beginner",
      50: "intermediate",
      75: "advanced",
      100: "expert"
    }

    const convertLevel = (level: number | string): "beginner" | "intermediate" | "advanced" | "expert" => {
      if (typeof level === "string") {
        return level as "beginner" | "intermediate" | "advanced" | "expert"
      }
      // Convert numeric level (0-100) to string level
      if (level <= 25) return "beginner"
      if (level <= 50) return "intermediate"
      if (level <= 75) return "advanced"
      return "expert"
    }

    const cvData = {
      skills: (profile.skills || []).map((skill: any) => ({
        name: skill.name || skill.skillName,
        level: convertLevel(skill.level || skill.skillLevel || 50),
        category: skill.category || "other"
      })),
      experiences: [],
      education: [],
      languages: [],
      summary: ""
    }

    // Generate recommendations based on user skills
    const recommendations = await CVAnalysisService.generateRecommendations(cvData)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}
