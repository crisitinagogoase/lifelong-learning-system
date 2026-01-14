import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type UserSkill = {
  id?: string
  name: string
  level: number
  category?: string
}

export type UserProfileData = {
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

type ExtendedUser = {
  id: number
  name: string | null
  email: string | null
  image: string | null
  bio?: string | null
  jobTitle?: string | null
  company?: string | null
  location?: string | null
  website?: string | null
}

type ExtendedSkill = {
  id: number
  name: string
  level: number
  category: string | null
  profileId: number
}

type ExtendedSkillProfile = {
  id: number
  userId: number
  skills: ExtendedSkill[]
}

export class UserProfileService {
  static async getUserProfile(userId: string): Promise<UserProfileData | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      }) as ExtendedUser | null

      if (!user) {
        return null
      }

      const skillProfile = await prisma.$queryRaw`
        SELECT sp.*, s.* 
        FROM "SkillProfile" sp 
        LEFT JOIN "Skill" s ON s."profileId" = sp.id 
        WHERE sp."userId" = ${parseInt(userId)}
      ` as ExtendedSkillProfile | null

      const userProfile: UserProfileData = {
        id: user.id.toString(),
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        jobTitle: user.jobTitle || "",
        company: user.company || "",
        location: user.location || "",
        website: user.website || "",
        image: user.image,
        skills: skillProfile?.skills.map(skill => ({
          id: skill.id.toString(),
          name: skill.name,
          level: skill.level,
          category: skill.category || undefined,
        })) || [],
      }

      return userProfile
    } catch (error) {
      console.error("Error retrieving user profile:", error)
      throw error
    }
  }

  static async updateUserProfile(userId: string, profileData: Partial<UserProfileData>): Promise<UserProfileData> {
    try {
      // Update user profile
      await prisma.$executeRaw`
        UPDATE "User"
        SET 
          name = ${profileData.name},
          bio = ${profileData.bio},
          jobTitle = ${profileData.jobTitle},
          company = ${profileData.company},
          location = ${profileData.location},
          website = ${profileData.website}
        WHERE id = ${parseInt(userId)}
      `

      // Get or create skill profile
      let skillProfile = await prisma.$queryRaw`
        SELECT sp.*, s.* 
        FROM "SkillProfile" sp 
        LEFT JOIN "Skill" s ON s."profileId" = sp.id 
        WHERE sp."userId" = ${parseInt(userId)}
      ` as ExtendedSkillProfile | null

      if (!skillProfile) {
        const newProfile = await prisma.$queryRaw`
          INSERT INTO "SkillProfile" ("userId") 
          VALUES (${parseInt(userId)})
          RETURNING *
        ` as unknown as ExtendedSkillProfile
        skillProfile = newProfile
      }

      if (profileData.skills && profileData.skills.length > 0) {
        await prisma.$executeRaw`
          DELETE FROM "Skill" 
          WHERE "profileId" = ${skillProfile.id}
        `
        
        for (const skill of profileData.skills) {
          await prisma.$executeRaw`
            INSERT INTO "Skill" ("name", "level", "category", "profileId")
            VALUES (${skill.name}, ${skill.level}, ${skill.category || "other"}, ${skillProfile.id})
          `
        }
      }

      const updatedProfile = await this.getUserProfile(userId)
      if (!updatedProfile) {
        throw new Error("Unable to retrieve updated profile")
      }
      return updatedProfile
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }
}
