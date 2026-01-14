import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId: parseInt(session.user.id),
      },
      include: {
        course: {
          include: {
            skills: {
              select: {
                skillName: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const courseId = parseInt(data.courseId)

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
    }

    // Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: parseInt(session.user.id),
          courseId: courseId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: parseInt(session.user.id),
        courseId: courseId,
        progress: 0,
      },
      include: {
        course: true,
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    )
  }
}
