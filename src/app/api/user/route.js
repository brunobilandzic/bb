import dbConnect from "@/lib/mongooseConnect";
import UserPW from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({
      error: "Email not provided",
    });
  }

  const user = await UserPW.findOne({
    email,
  });

  if (!user) {
    return NextResponse.json({
      error: "User not found",
    });
  }

  return NextResponse.json({ user });
}
