import InventoryLog from "@/models/InventoryLog";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BorrowRequest from "@/models/BorrowRequest";

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

    let requests;

if (user.role === "admin") {
  requests = await BorrowRequest.find()
    .populate("userId", "name email role")
    .populate("inventoryId")
    .sort({ createdAt: -1 });
} else {
  requests = await BorrowRequest.find({
    userId: user.id,
  })
    .populate("userId", "name email role")
    .populate("inventoryId")
    .sort({ createdAt: -1 });
}
    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch requests",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();

    const request = await BorrowRequest.create({
      userId: user.id,
      inventoryId: body.inventoryId,
      quantity: body.quantity,
    });
    await InventoryLog.create({
  userId: user.id,
  inventoryId: body.inventoryId,
  action: "borrow_request",
  quantity: body.quantity,
});

    return NextResponse.json({
      success: true,
      request,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create request",
      },
      { status: 500 }
    );
  }
}