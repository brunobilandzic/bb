import dbConnect from "./mongooseConnect";
import UserPW from "../models/User";
import clientPromise from "./mongoDb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.JWT_KEY,
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      let userFromDB = await UserPW.findOne({ email: user.email });

      if (!userFromDB) {
        userFromDB = new UserPW({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider,
          role: user.email === process.env.ADMIN_EMAIL ? "admin" : "user",
        });
        await userFromDB.save();
      }

      return true;
    },
    secret: process.env.NEXTAUTH_SECRET,
    URL: process.env.NEXTAUTH_URL,
  },
};
