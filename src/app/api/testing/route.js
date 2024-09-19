import dbConnect from "@/lib/mongooseConnect";
import Lakmus from "@/models/LakmusModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  const lakmuses = await Lakmus.find({});
  
  return NextResponse.json({ lakmuses });
}

export async function DELETE(req) {
  await dbConnect();

  delete mongoose.connection.models["Lakmus"];

  return NextResponse.json({ message: "Book model deleted" });
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  console.log(`Received new lakmus with text: ${body.text}`);
  console.log(body.text);
  const newLakmus = new Lakmus({ text: body.text });
  console.log(`created new lakmus: ${newLakmus}`);
  await newLakmus.save();

  return NextResponse.json({ newLakmus });
}
