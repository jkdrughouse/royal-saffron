import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { DB } from "@/app/lib/db";

// Share MongoDB client for the adapter
const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push(
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise, { databaseName: "jkc_store" }) as any,
    providers,
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user }) {
            // Merge OAuth user into the existing JKC users collection
            if (!user.email) return false;
            try {
                const users: any[] = await DB.users();
                const existing = users.find((u) => u.email === user.email);
                if (!existing) {
                    const newUser = {
                        id: `USR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                        name: user.name ?? "Customer",
                        email: user.email,
                        phone: "",
                        passwordHash: null, // OAuth user — no password
                        addresses: [],
                        createdAt: new Date().toISOString(),
                        provider: "oauth",
                    };
                    users.push(newUser);
                    await DB.saveUsers(users);
                }
            } catch (e) {
                console.error("[NextAuth] signIn callback error:", e);
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
