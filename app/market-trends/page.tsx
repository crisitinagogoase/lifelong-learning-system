import { DashboardHeader } from "@/components/dashboard-header"
import { JobMarketTrends } from "@/components/market-analysis/job-market-trends"

export default function MarketTrendsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Market Trends</h1>

        <div className="grid grid-cols-1 gap-8">
          <JobMarketTrends />

          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">How to use this data</h2>
            <p className="mb-4">
              Job market trends help you identify the most in-demand skills and professional roles.
              Use this information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Guide your learning path towards high-demand skills</li>
              <li>Discover new emerging professional roles in your field</li>
              <li>Understand the potential impact of certain skills on your compensation</li>
              <li>Anticipate changes in your sector to stay competitive</li>
            </ul>
            <p>
              This data is updated monthly and is based on analysis of millions of job postings and
              professional profiles.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
