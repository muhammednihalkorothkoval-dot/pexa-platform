import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      whatsapp,
      pincode,
      city,
      house,
      street,
      bike,
      licenseFront,
      licenseBack,
      aadhaarFront,
      aadhaarBack,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pexa");
    const collection = db.collection("applications");

    const result = await collection.insertOne({
      name,
      phone,
      whatsapp,
      pincode,
      city,
      house,
      street,
      bike,
      licenseFront,
      licenseBack,
      aadhaarFront,
      aadhaarBack,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error("/api/apply error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
