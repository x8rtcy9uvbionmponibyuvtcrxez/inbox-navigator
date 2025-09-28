import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

// Extend NextAuth types
declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Create new user with appropriate role
          const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
          const isAdmin = adminEmails.includes(user.email!)

          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              fullName: user.name,
              avatarUrl: user.image,
              role: isAdmin ? UserRole.ADMIN : UserRole.USER,
            },
          })
        } else {
          // Update last login
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLogin: new Date() },
          })
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, role: true, fullName: true, avatarUrl: true },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.name = dbUser.fullName || session.user.name
          session.user.image = dbUser.avatarUrl || session.user.image
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}