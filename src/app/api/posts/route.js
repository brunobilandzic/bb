import dbConnect from "../../../lib/mongooseConnect";
import Post from "../../../models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/authOptions";
import UserPW from "../../../models/User";

export async function GET(req) {
  await dbConnect();

  const type = req.nextUrl.searchParams.get("type");

  const posts = await Post.find({ type }).sort({ createdAt: -1 });

  return NextResponse.json({ posts });
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const session = await getServerSession(authOptions);

  if (session) {
    const userPw = await UserPW.findOne({ email: session.user.email });

    if (!userPw) {
      return NextResponse.json({ error: "User not found" });
    }

    const newPost = await Post.create({
      ...body,
      username: userPw.email.split("@")[0],
    });

    userPw.posts.push(newPost._id);

    await userPw.save();
    await newPost.save();

    return NextResponse.json({ newPost });
  }

  if (!body.username) {
    body.username = "Anonymous";
  }

  const newPost = await Post.create({ ...body });

  await newPost.save();

  return NextResponse.json({ newPost });
}

export async function PATCH(req) {
  await dbConnect();

  const body = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  const post = await Post.findOne({ _id: body.postId });

  if (!post) {
    return NextResponse.json({ error: "Post not found" });
  }

  post.response = body.response;

  await post.save();

  return NextResponse.json({ post });
}
