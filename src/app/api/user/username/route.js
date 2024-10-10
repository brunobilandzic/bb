import dbConnect from "@/lib/mongooseConnect";
import UserPW from "@/models/User";
import { NextResponse } from "next/server";

// GET USER USERNAME FROM EMAIL

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

  console.log(user);

  if (!user) {
    return NextResponse.json({
      error: "User not found",
    });
  }

  return NextResponse.json({
    username: user.username,
  });
}
