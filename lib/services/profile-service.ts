import prisma from "@/lib/prisma"

export type UserSkill = {
  id?: string
  name: string
  level: number
  category: string
}

export type UserProfile = {
  id: string
  name: string | null
  email: string
  bio: string | null
  jobTitle: string | null
  company: string | null
  location: string | null
  website: string | null
  image: string | null
  skills: UserSkill[]
}

// ExtendedUser type is no longer needed - User model now has all fields

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

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })

    if (!user) {
      console.log("User not found with id:", userId)
      return null
    }
    
    console.log("User found:", { id: user.id, name: user.name, email: user.email, bio: user.bio, jobTitle: user.jobTitle })

    // Try to get skills using raw SQL query since SkillProfile/Skill tables may not be in Prisma schema
    let skills: UserSkill[] = []
    try {
      const skillProfile = await prisma.$queryRaw<Array<{
        id: number
        userId: number
        skillId?: number
        skillName?: string
        skillLevel?: number
        skillCategory?: string | null
      }>>`
        SELECT sp.id, sp."userId", s.id as "skillId", s.name as "skillName", s.level as "skillLevel", s.category as "skillCategory"
        FROM "SkillProfile" sp 
        LEFT JOIN "Skill" s ON s."profileId" = sp.id 
        WHERE sp."userId" = ${parseInt(userId)}
      `

      if (skillProfile && skillProfile.length > 0) {
        skills = skillProfile
          .filter(row => row.skillId)
          .map(row => ({
            id: row.skillId?.toString(),
            name: row.skillName || "",
            level: row.skillLevel || 0,
            category: row.skillCategory || "other",
          }))
      }
    } catch (skillError) {
      console.log("Skills not found or tables don't exist, returning empty skills array")
      // If SkillProfile/Skill tables don't exist, just return empty skills
    }

    // Return profile with all available data
    const profile: UserProfile = {
      id: user.id.toString(),
      name: user.name,
      email: user.email || "",
      bio: user.bio || null,
      jobTitle: user.jobTitle || null,
      company: user.company || null,
      location: user.location || null,
      website: user.website || null,
      image: user.image,
      skills,
    }
    
    console.log("Returning profile:", profile)
    return profile
  } catch (error) {
    console.error("Error retrieving profile:", error)
    throw error
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    console.log("updateUserProfile called with userId:", userId, "data:", data)
    
    // Update user using Prisma - only include fields that are explicitly provided
    const updateData: {
      name?: string | null
      bio?: string | null
      jobTitle?: string | null
      company?: string | null
      location?: string | null
      website?: string | null
    } = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.bio !== undefined) updateData.bio = data.bio || null
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle || null
    if (data.company !== undefined) updateData.company = data.company || null
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.website !== undefined) updateData.website = data.website || null
    
    if (Object.keys(updateData).length > 0) {
      console.log("Updating user with data:", updateData)
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
      })
      console.log("User updated successfully with Prisma")
    }

    // Handle skills if provided
    if (data.skills && data.skills.length > 0) {
      try {
        // Get or create skill profile
        let skillProfile = await prisma.$queryRaw<Array<{ id: number }>>`
          SELECT id FROM "SkillProfile" WHERE "userId" = ${parseInt(userId)} LIMIT 1
        `

        let profileId: number
        if (!skillProfile || skillProfile.length === 0) {
          const newProfile = await prisma.$queryRaw<Array<{ id: number }>>`
            INSERT INTO "SkillProfile" ("userId") 
            VALUES (${parseInt(userId)})
            RETURNING id
          `
          profileId = newProfile[0].id
        } else {
          profileId = skillProfile[0].id
        }

        // Delete existing skills
        await prisma.$executeRaw`
          DELETE FROM "Skill" WHERE "profileId" = ${profileId}
        `

        // Insert new skills
        for (const skill of data.skills) {
          await prisma.$executeRaw`
            INSERT INTO "Skill" ("name", "level", "category", "profileId")
            VALUES (${skill.name}, ${skill.level}, ${skill.category || "other"}, ${profileId})
          `
        }
      } catch (skillError) {
        console.log("Could not update skills - tables may not exist:", skillError)
        // Continue without updating skills if tables don't exist
      }
    }

    return getUserProfile(userId)
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}
