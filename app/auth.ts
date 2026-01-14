import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const isDebug = process.env.NODE_ENV !== 'production'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: isDebug,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          // Find the user in the database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          // If user doesn't exist or password doesn't match
          if (!user || !user.password) {
            console.log("User not found or password is null:", credentials.email)
            throw new Error("Invalid credentials")
          }

          // Check if password matches
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Password invalid for user:", credentials.email)
            throw new Error("Invalid credentials")
          }

          console.log("Authentication successful for:", credentials.email)
          
          // Return the user without the password
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        console.log("JWT callback - User information added to token:", user.email)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id?.toString() || ""
        console.log("Session callback - Session created for user:", session.user.email)
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  }
}
