import connectDB from "@/app/lib/db";
import Project from "@/app/model/Project";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(req) {
  console.log("Incoming POST /api/auth/project");

  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const cookieHeader = req.headers.get("cookie") || "";
    const parsedCookies = cookie.parse(cookieHeader);
    const token = parsedCookies.token;

    if (!token) {
      console.warn("⚠️ No token found in cookies");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    const body = await req.json();
    console.log("Request Body:", body);

    const { projectName, adl, beneficiaries, municipality } = body;

    const newProject = new Project({
      projectName,
      adl,
      beneficiaries,
      municipality,
      uploadedBy: decoded.userId,
      dateUploaded: new Date(),
      progress: "0%",
      status: "Pending",
    });

    await newProject.save();
    console.log("✅ Project saved");

    return NextResponse.json({ message: "Success", project: newProject }, { status: 201 });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
