import { DashboardHeader } from "@/components/dashboard-header"
import { CertificationDashboard } from "@/components/certification/certification-dashboard"

export default function CertificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Certifications and Badges</h1>

        <div className="grid grid-cols-1 gap-8">
          <CertificationDashboard />

          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Blockchain Verification</h2>
            <p className="mb-4">
              All our certifications are secured by blockchain technology, ensuring their authenticity and
              immutability.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">How to verify a certification</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Request the unique certification identifier</li>
                <li>Enter this identifier in our verification tool</li>
                <li>View the certification details and its blockchain validation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
