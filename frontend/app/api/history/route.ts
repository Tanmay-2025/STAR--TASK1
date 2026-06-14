import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import InventoryLog from "@/models/InventoryLog";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    const logs = await InventoryLog.find()
      .populate(
        "userId",
        "name email role"
      )
      .populate(
        "inventoryId",
        "name category"
      )
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch history",
      },
      { status: 500 }
    );
  }
}