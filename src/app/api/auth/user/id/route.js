import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value; // ✅ FIXED

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({ userId: decoded.userId });
  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
