import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get("level")
    const search = searchParams.get("search")

    let where: any = {}
    
    if (level) {
      where.level = level
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { provider: { contains: search, mode: "insensitive" } },
      ]
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        skills: {
          select: {
            skillName: true,
          },
        },
        prerequisites: {
          select: {
            prerequisiteSkill: true,
          },
        },
      },
      orderBy: [
        { marketRelevance: "desc" },
        { title: "asc" },
      ],
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
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
    
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        provider: data.provider,
        level: data.level,
        duration: data.duration,
        url: data.url,
        marketRelevance: data.marketRelevance ? parseFloat(data.marketRelevance) : null,
        skills: data.skills ? {
          create: data.skills.map((skill: string) => ({
            skillName: skill,
          })),
        } : undefined,
        prerequisites: data.prerequisites ? {
          create: data.prerequisites.map((prereq: string) => ({
            prerequisiteSkill: prereq,
          })),
        } : undefined,
      },
      include: {
        skills: true,
        prerequisites: true,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
