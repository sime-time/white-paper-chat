import { createAuthClient } from "better-auth/solid";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
})
