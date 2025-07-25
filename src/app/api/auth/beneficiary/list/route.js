import { NextResponse } from "next/server";
import Beneficiary from "@/app/model/Beneficiary";
import connectDB from "@/app/lib/db";

export async function GET() {
  try {
    await connectDB();
    const beneficiaries = await Beneficiary.find({}).lean();
    return NextResponse.json({ success: true, data: beneficiaries });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}
