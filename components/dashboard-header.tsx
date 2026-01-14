import { Bell, User, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="font-bold text-xl text-primary">CareerGrowth</div>

          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/assessment" className="text-sm font-medium hover:text-primary">
              Evaluation
            </Link>
            <Link href="/learning" className="text-sm font-medium hover:text-primary">
              Learning
            </Link>
            <Link href="/certifications" className="text-sm font-medium hover:text-primary">
              Certifications
            </Link>
            <Link href="/market-trends" className="text-sm font-medium hover:text-primary">
              Tendencies
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search for skills, courses..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
