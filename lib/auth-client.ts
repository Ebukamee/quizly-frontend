// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // This points the client directly to your Express backend
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const { signIn, signOut, useSession } = authClient;