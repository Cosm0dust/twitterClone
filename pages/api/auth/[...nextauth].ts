import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: "595492875956-v5jj65onffmhhqgpubf418to0j9812ae.apps.googleusercontent.com",
            clientSecret: "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",
        }),
        // ...add more providers here
    ],
    secret: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4uZG9lIn0.EFzxw9w1nZys3WQgOwqQfSwdCzcjxkTKwZNL5Z5lWyP_aU2a3wboZFX3spT5R2R8yVGKKDJ0-wC7YGhYSwcrKQ",
    pages:{
        signIn: "/login"
    }

}
export default NextAuth(authOptions)