import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";

export async function GET() {
  try {
    await connectDB();

    const items = [
      {
        name: "Arduino Uno",
        category: "Microcontroller",
        totalQuantity: 10,
        availableQuantity: 10,
      },
      {
        name: "Raspberry Pi 4",
        category: "Single Board Computer",
        totalQuantity: 5,
        availableQuantity: 5,
      },
      {
        name: "Ultrasonic Sensor",
        category: "Sensor",
        totalQuantity: 20,
        availableQuantity: 20,
      },
    ];

    await Inventory.insertMany(items);

    return NextResponse.json({
      success: true,
      message: "Inventory seeded",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}