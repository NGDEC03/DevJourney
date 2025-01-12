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
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Invalid credentials");
                }
                console.log(await prisma.user.findMany())
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

                return {
                    id: '21',
                    userName: user.userName,
                    Name: user.name,
                    Email: user.email,
                    avatar: user.avatar || "default-avatar",
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.SECRET || "default",
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User | undefined }) {
            if (user) {
                token.id = user.id;
                token.userName = user.userName;
                token.Name = user.Name;
                token.Email = user.Email;
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
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
};
// @ts-expect-error - nessasary for next-auth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
