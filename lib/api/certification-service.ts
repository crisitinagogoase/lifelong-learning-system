export type Certification = {
  id: string
  title: string
  description?: string
  issuer: string
  recipient: {
    id: string
    name: string
  }
  issueDate: Date
  expiryDate?: Date
  skills: string[]
  credentialId: string
  verified: boolean
  blockchainInfo?: {
    transactionId: string
    blockNumber: number
    timestamp: Date
  }
}

export type CertificationProgress = {
  id: string
  title: string
  issuer: string
  progress: number
  estimatedCompletion: Date
  modules: {
    id: string
    name: string
    completed: boolean
  }[]
}

export class CertificationService {
  static async getUserCertifications(userId: string): Promise<Certification[]> {
    try {
      console.log("Récupération des certifications pour l'utilisateur:", userId)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const certifications: Certification[] = [
        {
          id: "cert-001",
          title: "Python pour la Data Science",
          issuer: "DataCamp",
          recipient: {
            id: userId,
            name: "Jean Dupont",
          },
          issueDate: new Date("2023-03-15"),
          expiryDate: new Date("2025-03-15"),
          skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
          credentialId: "DC-PY-2023-78945",
          verified: true,
          blockchainInfo: {
            transactionId: "0x7a9d852b39c7e4b302e8f9c7ef96d0a9e6b7b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
            blockNumber: 14567890,
            timestamp: new Date("2023-03-15T14:30:45Z"),
          },
        },
      ]

      return certifications
    } catch (error) {
      console.error("Erreur lors de la récupération des certifications:", error)
      throw error
    }
  }

  static async getInProgressCertifications(userId: string): Promise<CertificationProgress[]> {
    try {
      console.log("Récupération des certifications en cours pour l'utilisateur:", userId)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const inProgressCertifications: CertificationProgress[] = [
        {
          id: "cert-003",
          title: "Deep Learning Specialization",
          issuer: "Coursera",
          progress: 65,
          estimatedCompletion: new Date("2023-07-15"),
          modules: [
            { id: "mod-1", name: "Neural Networks and Deep Learning", completed: true },
            { id: "mod-2", name: "Improving Deep Neural Networks", completed: true },
            { id: "mod-3", name: "Structuring Machine Learning Projects", completed: false },
            { id: "mod-4", name: "Convolutional Neural Networks", completed: false },
            { id: "mod-5", name: "Sequence Models", completed: false },
          ],
        },
      ]

      return inProgressCertifications
    } catch (error) {
      console.error("Erreur lors de la récupération des certifications en cours:", error)
      throw error
    }
  }

  static async verifyCertification(credentialId: string): Promise<{ valid: boolean; certification?: Certification }> {
    try {
      console.log("Vérification de la certification:", credentialId)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (credentialId) {
        return {
          valid: true,
          certification: {
            id: "cert-001",
            title: "Python pour la Data Science",
            issuer: "DataCamp",
            recipient: {
              id: "user-123",
              name: "Jean Dupont",
            },
            issueDate: new Date("2023-03-15"),
            expiryDate: new Date("2025-03-15"),
            skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
            credentialId: credentialId,
            verified: true,
            blockchainInfo: {
              transactionId: "0x7a9d852b39c7e4b302e8f9c7ef96d0a9e6b7b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
              blockNumber: 14567890,
              timestamp: new Date("2023-03-15T14:30:45Z"),
            },
          },
        }
      } else {
        return { valid: false }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la certification:", error)
      throw error
    }
  }
}
