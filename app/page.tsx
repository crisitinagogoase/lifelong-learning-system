'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut } from "lucide-react"

export default function Home() {
  return <HomePage />
}

function HomePage() {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === 'authenticated'

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">CareerGrowth</div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>{session?.user?.email || 'User'}</span>
              </div>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Develop your career with artificial intelligence
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            CareerGrowth helps you identify the most in-demand skills, follow personalized
            learning paths and obtain recognized certifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Access my dashboard</Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button>Start for free</Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button>View demo</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Skills Assessment</h2>
            <p className="text-slate-600 mb-4">
              Discover your strengths and identify skills to develop to achieve your career goals.
            </p>
            <Link href="/assessment">
              <span className="text-primary hover:underline cursor-pointer">Learn more →</span>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Personalized Learning Paths</h2>
            <p className="text-slate-600 mb-4">
              Follow learning paths tailored to your profile and job market trends.
            </p>
            <Link href="/learning">
              <span className="text-primary hover:underline cursor-pointer">Learn more →</span>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Blockchain Certifications</h2>
            <p className="text-slate-600 mb-4">
              Get verifiable and secure certifications powered by blockchain technology.
            </p>
            <Link href="/certifications">
              <span className="text-primary hover:underline cursor-pointer">Learn more →</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
