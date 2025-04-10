declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userName: string;
      Name: string;
      Email: string;
      avatar: string;
      isAdmin:boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    userName: string;
    Name: string;
    Email: string;
    avatar?: string;
    isAdmin:boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userName: string;
    Name: string;
    Email: string;
    avatar: string;
    isAdmin:boolean;
  }
}
