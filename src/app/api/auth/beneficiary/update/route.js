// /app/api/auth/beneficiary/update/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Beneficiary from "@/app/model/Beneficiary";

export async function PATCH(req) {
  try {

    await connectDB();
    console.log("database connected in -> PATCH Update Beneficiary");

    const { _id, updates } = await req.json();

    console.log(_id);

    const updated = await Beneficiary.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true }
    );

    console.log(updated);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Beneficiary not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
