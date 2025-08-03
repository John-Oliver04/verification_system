import connectDB from "@/app/lib/db";
import Project from "@/app/model/Project";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(req) {
  await connectDB();

  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const parsedCookies = cookie.parse(cookieHeader);
    const token = parsedCookies.token;

    if (!token) {
      console.warn("⚠️ No token found in cookies");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const projects = await Project.find({ uploadedBy: decoded.userId }).sort({ dateUploaded: -1 });

    return NextResponse.json(projects);
    
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    return NextResponse.json(
      { message: "Failed to load projects", error: err.message },
      { status: 500 }
    );
  }
}
