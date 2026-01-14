import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth"
import prisma from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const enrollmentId = parseInt(params.enrollmentId)
    const data = await request.json()

    if (isNaN(enrollmentId)) {
      return NextResponse.json({ error: "Invalid enrollment ID" }, { status: 400 })
    }

    // Verify the enrollment belongs to the user
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    if (enrollment.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const progress = data.progress !== undefined ? parseInt(data.progress) : enrollment.progress

    const updated = await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: Math.min(100, Math.max(0, progress)),
        completedAt: progress === 100 ? new Date() : null,
      },
      include: {
        course: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating enrollment:", error)
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    )
  }
}
