// File: /src/app/api/auth/me/route.js

import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth"; // Adjust if path differs
import connectDB from "@/app/lib/db"; // Connect to MongoDB
import User from "@/app/model/User"; // Mongoose User model

// GET request handler for /api/auth/me
export async function GET(req) {
  try {
    // Connect to database
    await connectDB();

    // Extract user from token
    const user = await verifyToken();

    // If token is invalid or user is not authenticated
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Optionally fetch full user info from DB
    const dbUser = await User.findById(user._id).select("email role");

    // Return role and email (or anything you want)
    return NextResponse.json({ role: dbUser.role, email: dbUser.email });
    
  } catch(error) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}