// Import bcryptjs to securely compare hashed passwords
import bcrypt from "bcryptjs";

// Import jsonwebtoken to create and verify JWT tokens
import jwt from "jsonwebtoken";

// Import NextResponse to build responses in App Router
import { NextResponse } from "next/server";

// Import the cookies API from App Router to manage cookie headers
import { cookies } from "next/headers";

// Import MongoDB connection helper
import connectDB from "@/app/lib/db";

// Import the User model representing the users collection in MongoDB
import User from "@/app/model/User";

// Define the POST request handler for the /api/auth/login route
export async function POST(req) {
  try {
    // Parse incoming JSON body (sent from login form)
    const body = await req.json();
    const { email, password } = body;

    // Connect to MongoDB before querying
    await connectDB();

    // Find a user by email (case-sensitive)
    const user = await User.findOne({ email });

    // If no user is found, return 401 Unauthorized
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // Compare the entered password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return 401 Unauthorized
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Generate a JWT token with the user ID and role
    const token = jwt.sign(
      {
        userId: user._id,   // Unique MongoDB user ID
        name: user.username,
        role: user.role,    // Role from user schema (e.g., 'admin', 'user')
      },
      process.env.JWT_SECRET,  // Secret stored securely in .env.local
      { expiresIn: "7d" }       // Token expires in 7 days
    );

    // Store the token in an HTTP-only cookie (cannot be accessed by JS)
    cookies().set({
      name: "token",              // Cookie name
      value: token,               // The JWT token
      httpOnly: true,             // JS can't read this cookie (prevents XSS)
      path: "/",                  // Cookie accessible from entire domain
      maxAge: 7 * 24 * 60 * 60,   // Expire after 7 days (in seconds)
    });

    // Respond to the client with a success message and optional user role
    return NextResponse.json(
      { message: "Login successful", role: user.role },
      { status: 200 }
    );

  } catch (error) {
    // Handle and log any unexpected errors (e.g., DB issues, crash)
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
