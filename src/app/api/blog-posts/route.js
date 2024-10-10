import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongooseConnect";
import BlogPost from "@/models/BlogPost";
import UserPW from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const blogPosts = await BlogPost.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ blogPosts });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to view this page" },
      401
    );
  }
  await dbConnect();

  const userPw = await UserPW.findOne({ email: session.user.email });

  if (!userPw) {
    return NextResponse.json({ error: "User not found" });
  }

  if (!userPw.role == "ADMIN") {
    return NextResponse.json({
      error: "You must be an admin to post blog post!",
    });
  }
  const body = await req.json();
  const newBlogPost = new BlogPost(body);

  await newBlogPost.save();

  return NextResponse.json({ newBlogPost });
}
