import { NextResponse } from "next/server";
import Beneficiary from "@/app/model/Beneficiary";
import connectDB from "@/app/lib/db";


export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const projectId = searchParams.get('projectId');

  const query = {};
  if (projectId) {
    query.projectId = projectId;
  }

  try {
    await connectDB();
    const beneficiaries = await Beneficiary.find(query);
    return NextResponse.json({ success: true, data: beneficiaries });
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
