import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
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

    const items = await Inventory.find();

    const inventoryTypes = items.length;

    const totalUnits = items.reduce(
      (sum, item) =>
        sum + item.totalQuantity,
      0
    );

    const issuedUnits = items.reduce(
      (sum, item) =>
        sum +
        (
          item.totalQuantity -
          item.availableQuantity
        ),
      0
    );

    const pendingRequests =
      await BorrowRequest.countDocuments({
        status: "pending",
      });

    return NextResponse.json({
      success: true,
      inventoryTypes,
      totalUnits,
      issuedUnits,
      pendingRequests,
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