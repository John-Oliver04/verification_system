// Import bcryptjs to securely compare hashed passwords
import bcrypt from "bcryptjs";

// Import jsonwebtoken to create and verify JWT tokens
import jwt from "jsonwebtoken";

// Import NextResponse to handle responses and set cookies in App Router
import { NextResponse } from "next/server";

// Import MongoDB connection helper
import connectDB from "@/app/lib/db";

// Import the User model that represents the user collection in MongoDB
import User from "@/app/model/User";

// Handle POST requests to /api/auth/login
export async function POST(req) {
  try {
    // Parse the request body to get email and password sent from the client
    const body = await req.json();
    const { email, password } = body;

    // Establish connection to the MongoDB database
    await connectDB();

    // Search for a user with the matching email in the database
    const user = await User.findOne({ email });

    // If user doesn't exist, return a 401 Unauthorized response
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // Compare the entered password with the stored hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return a 401 Unauthorized response
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Create a JWT token using user ID and role, valid for 7 days
    const token = jwt.sign(
      {
        userId: user._id,   // Unique identifier for the user
        role: user.role,    // User's role (e.g., admin, user)
      },
      process.env.JWT_SECRET,  // Secret key stored in .env.local
      { expiresIn: "7d" }       // Token expiration (7 days)
    );

    // Create a NextResponse object with a success message and user role
    const response = NextResponse.json(
      { message: "Login successful", role: user.role },
      { status: 200 }
    );

    // Store the token in a cookie:
    // - httpOnly: prevents JavaScript access (more secure)
    // - path: makes the cookie available site-wide
    // - maxAge: 7 days in seconds (7 * 24 * 60 * 60)
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Return the response with the cookie attached
    return response;

  } catch (error) {
    // Catch any unexpected errors and return a 500 Internal Server Error
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
