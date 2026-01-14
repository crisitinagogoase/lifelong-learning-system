import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth"
import { getUserProfile, updateUserProfile } from "@/lib/services/profile-service"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getUserProfile(session.user.id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error retrieving profile:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Updating profile with data:", data)
    
    const updatedProfile = await updateUserProfile(session.user.id, data)

    if (!updatedProfile) {
      return NextResponse.json({ error: "Update failed" }, { status: 400 })
    }

    console.log("Profile updated successfully:", updatedProfile)
    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Server error" 
    }, { status: 500 })
  }
}
