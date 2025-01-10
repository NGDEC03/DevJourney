import { prisma } from "@/prismaClient";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
interface User {
    id:string
    userName: string
    Name: string
    Email: string
    avatar?: string
  }

const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials: any) {
                const user = await prisma.user.findUnique({
                    where: {
                        userName: credentials.username
                    }
                })
                return {
                    ...user,
                    id: "21"
                } as User
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }:{token:any,user:any}) {
            console.log(user);
            
            if (user) {
                token.userName = user.userName
                token.Name = user.Name
                token.Email=user.Email
                token.avatar = user.avatar || "default-avatar"
            }
            return token
        },
        async session({ token, session }) {
            console.log(token);
            
            if (session.user) {
                // session.user.email="ngdec03"
                session.user.userName = token.userName
                session.user.Name = token.Name
                session.user.Email=token.Email
                session.user.avatar = token.avatar
            
            }

            return session
        },
    }
}

export const GET=NextAuth(options)
export const POST=NextAuth(options)