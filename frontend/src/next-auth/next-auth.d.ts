import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      credentialToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    credentialToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    credentialToken?: string;
  }
}
