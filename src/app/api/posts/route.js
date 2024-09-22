import dbConnect from "../../../lib/mongooseConnect";
import Post from "../../../models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/authOptions";
import UserPW from "../../../models/User";

export async function GET(req) {
  await dbConnect();
  const posts = await Post.find({});

  return NextResponse.json({ posts });
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const session = await getServerSession(authOptions);

  console.log("session: ", session);

  if (session) {
    const userPw = await UserPW.findOne({ email: session.user.email });

    if (!userPw) {
      return NextResponse.json({ error: "User not found" });
    }
    console.log("userPw: ", userPw);

    const newPost = await Post.create({
      ...body,
      creator: userPw._id,
      logedIn: true,
    });

    userPw.posts.push(newPost._id);

    await userPw.save();
    await newPost.save();

    return NextResponse.json({ newPost });
  }

  if (!body.creator) {
    return NextResponse.json({ error: "Creator not provided" });
  }

  const newPost = await Post.create({ ...body, logedIn: false });

  await newPost.save();

  return NextResponse.json({ newPost });
}
