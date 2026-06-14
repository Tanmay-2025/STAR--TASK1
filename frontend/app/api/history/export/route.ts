import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import InventoryLog from "@/models/InventoryLog";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser(req);

    if (!user || user.role !== "admin") {
      return new NextResponse(
        "Unauthorized",
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
      .sort({ createdAt: -1 });

    const rows = [
      [
        "Date",
        "User",
        "Role",
        "Item",
        "Action",
        "Quantity",
      ].join(","),
    ];

    logs.forEach((log) => {
      rows.push(
        [
          new Date(
            log.createdAt
          ).toISOString(),
          log.userId?.name || "",
          log.userId?.role || "",
          log.inventoryId?.name || "",
          log.action,
          log.quantity,
        ].join(",")
      );
    });

    return new NextResponse(
      rows.join("\n"),
      {
        headers: {
          "Content-Type":
            "text/csv",
          "Content-Disposition":
            'attachment; filename="inventory-history.csv"',
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      "Export failed",
      { status: 500 }
    );
  }
}