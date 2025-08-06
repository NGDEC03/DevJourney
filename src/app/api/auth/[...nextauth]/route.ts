import { PrismaClient } from "@prisma/client";
import { User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import bcrypt from 'bcrypt';
import { userAgent } from "next/server";

const prisma = new PrismaClient();

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id:"user-login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Invalid credentials");
                }
                console.log(credentials.username + credentials.password);
                const user = await prisma.user.findUnique({
                    where: {
                        userName: credentials.username,
                    },
                });
                console.log(user);
                if (!user) {
                    throw new Error("No user found");
                }
                
                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) {
                    throw new Error("Invalid password");
                }
                
                if(!user.isVerified){
                    throw new Error("Your email is not verified. Please verify before logging in.")
                }
                return {
                    id: '21',
                    userName: user.userName,
                    Name: user.name,
                    Email: user.email,
                    isAdmin:user.isAdmin,
                    avatar: user.avatar || "default-avatar",
                };
            },
        }),
        
    ],
pages:{
    error:"/error"
},
    secret: process.env.SECRET || "default",
    callbacks: {
        async jwt({ token, user }: { token: any; user: User | undefined }) {
            if (user) {
                token.id = user.id;
                token.userName = user.userName;
                token.Name = user.Name;
                token.Email = user.Email;
                token.isAdmin=user.isAdmin;
                token.avatar = user.avatar || "default-avatar";
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.userName = token.userName;
                session.user.Name = token.Name;
                session.user.Email = token.Email;
                session.user.isAdmin=token.isAdmin;
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
};
export default authOptions;
// @ts-expect-error - nessasary for next-auth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
