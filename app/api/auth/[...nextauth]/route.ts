import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User, { IUser } from "@models/user";
import { DefaultSession } from "next-auth";
import { HydratedDocument } from "mongoose";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Profile {
    picture?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      }

      return session;
    },

    async signIn({ profile }) {
      try {
        // serverless -> labmda -> dynamodb

        console.log("Profile: ", profile);

        await connectToDB();

        if (profile?.email && profile?.name) {
          let username = profile.name.replace(" ", "").toLowerCase();

          if (username.length < 8 || username.length > 20) {
            username = profile.email.split("@")[0];
          }

          const userExists: HydratedDocument<IUser> | null = await User.findOne(
            { email: profile.email }
          );

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: username,
              image: profile.picture,
            });
          }
        }

        return true;
      } catch (error) {
        console.error(`Sign in error: ${error}`);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
