import { NextResponse } from "next/server";
import Beneficiary from "@/app/model/Beneficiary";
import connectDB from "@/app/lib/db";
import cookie from "cookie";
import jwt from "jsonwebtoken";


export async function POST(req) {
  try {
    await connectDB();
    console.log("Database Connected!")

    // Parse token from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const parsedCookies = cookie.parse(cookieHeader);
    const token = parsedCookies.token;

    if (!token) {
      console.warn("⚠️ No token found in cookies");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded._id);

    const body = await req.json();
    const { beneficiaries, projectId } = body;

    console.log("Parsed body:", body);
    console.log("Project ID:", projectId);
    console.log("Beneficiaries count:", beneficiaries?.length);

    if (!projectId || !Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      return NextResponse.json({ message: "Missing projectId or beneficiaries" }, { status: 400 });
    }

    // Add uploader and projectId to each beneficiary, and ensure birthdate is valid
    const beneficiariesWithUploader = beneficiaries.map((b) => ({
      ...b,
      projectId,
      uploader: decoded.userId,
    }));

    // Filter out those missing required fields
    const missingFields = beneficiariesWithUploader.filter(b =>
      !b.firstName || !b.lastName || !b.birthdate || !b.projectId || !b.uploader
    );

    if (missingFields.length > 0) {
      console.warn("⛔ Found beneficiaries with missing fields:", missingFields.slice(0, 3));
      return NextResponse.json(
        {
          message: "Some beneficiaries are missing required fields",
          count: missingFields.length,
          sample: missingFields.slice(0, 3),
        },
        { status: 400 }
      );
    }

    // Save to DB
    await Beneficiary.insertMany(beneficiariesWithUploader);

    return NextResponse.json({ message: "Beneficiaries uploaded successfully" }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}