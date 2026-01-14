"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Copy, ExternalLink, FileText, Lock, Search, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function BlockchainVerification() {
  const [verificationId, setVerificationId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | {
    valid: boolean
    credential: {
      id: string
      title: string
      recipient: string
      issuer: string
      issueDate: string
      expiryDate: string
      skills: string[]
      transactionId: string
      blockNumber: number
      timestamp: string
    }
  }>(null)

  const handleVerify = async () => {
    if (!verificationId) return

    setIsVerifying(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setVerificationResult({
      valid: true,
      credential: {
        id: verificationId,
        title: "Python for  Data Science",
        recipient: "Michael John",
        issuer: "DataCamp",
        issueDate: "15 march 2023",
        expiryDate: "15 march 2025",
        skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
        transactionId: "0x7a9d852b39c7e4b302e8f9c7ef96d0a9e6b7b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
        blockNumber: 14567890,
        timestamp: "2023-03-15T14:30:45Z",
      },
    })

    setIsVerifying(false)
  }

  const resetVerification = () => {
    setVerificationId("")
    setVerificationResult(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Certification Verification
        </CardTitle>
        <CardDescription>Verify the authenticity of a certification via blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        {!verificationResult ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credential-id">Certification ID</Label>
              <div className="flex gap-2">
                <Input
                  id="credential-id"
                  placeholder="Enter the certification ID or scan the QR code"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Exemple: DC-PY-2023-78945 or scan the QR code present on the certificate
              </p>
            </div>

            <div className="flex justify-center p-6 border rounded-lg">
              <div className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Secure Verification</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  All our certifications are recorded on the blockchain to ensure their authenticity and
                  immutability. Verification is instant and requires no registration.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-medium text-green-800">Authentic and Valid Certification</h3>
                <p className="text-sm text-green-700">
                  This certification has been verified on the blockchain and is authentic.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{verificationResult.credential.title}</h3>
                <p className="text-sm text-muted-foreground">Issued by{verificationResult.credential.issuer}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Holder</p>
                  <p className="text-sm font-medium">{verificationResult.credential.recipient}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certification ID</p>
                  <p className="text-sm font-medium">{verificationResult.credential.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="text-sm">{verificationResult.credential.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiry Date</p>
                  <p className="text-sm">{verificationResult.credential.expiryDate}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Validated Skills</p>
                <div className="flex flex-wrap gap-2">
                  {verificationResult.credential.skills.map((skill, idx) => (
                    <div key={idx} className="px-2 py-1 bg-slate-100 rounded-md text-xs">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Blockchain Information</h4>

                <div>
                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                  <div className="flex items-center">
                    <p className="text-xs font-mono truncate max-w-[250px]">
                      {verificationResult.credential.transactionId}
                    </p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Block number</p>
                    <p className="text-xs">{verificationResult.credential.blockNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="text-xs">{verificationResult.credential.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!verificationResult ? (
          <>
            <Button variant="outline" disabled>
              <FileText className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button onClick={handleVerify} disabled={!verificationId || isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Certification"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetVerification}>
              Verify Another Certification
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Blockchain
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                View Full Certificate
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
