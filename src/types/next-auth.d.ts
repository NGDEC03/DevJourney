import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userName: string;

      Name: string;
      Email: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    userName: string;
    Name: string;
    Email: string;
    avatar?: string;
  }

  interface JWT {
    userName?: string;
    Name?: string;
    Email?: string;
    avatar?: string;
  }
}
