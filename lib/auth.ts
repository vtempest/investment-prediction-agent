import { betterAuth } from "better-auth"
import { db } from "./db"
import * as schema from "./db/schema"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: {
    provider: "postgres",
    db: db as any,
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  anonymous: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
