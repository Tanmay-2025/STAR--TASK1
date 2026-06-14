import InventoryLog from "@/models/InventoryLog";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BorrowRequest from "@/models/BorrowRequest";
import Inventory from "@/models/Inventory";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    if (
  ["approve", "reject", "confirm_return"].includes(
    body.action
  )
) {
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Admin access required",
      },
      { status: 403 }
    );
  }
}

    const request = await BorrowRequest.findById(
      params.id
    );

    if (!request) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        { status: 404 }
      );
    }

    // Approve Request
    if (
  ["approve", "reject", "confirm_return"].includes(
    body.action
  ) &&
  user.role !== "admin"
) {
  return NextResponse.json(
    {
      success: false,
      message: "Admin access required",
    },
    { status: 403 }
  );
}
    if (body.action === "approve") {
        if (request.status !== "pending") {
  return NextResponse.json(
    {
      success: false,
      message: "Request already processed",
    },
    { status: 400 }
  );
}
      const item = await Inventory.findById(
        request.inventoryId
      );

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message: "Inventory item not found",
          },
          { status: 404 }
        );
      }

      if (
  item.availableQuantity <
  request.quantity
) {
        return NextResponse.json(
          {
            success: false,
            message: "Item unavailable",
          },
          { status: 400 }
        );
      }

      item.availableQuantity -=
  request.quantity;
      await item.save();

      request.status = "approved";
      request.approvedAt = new Date();

      await request.save();
       await InventoryLog.create({
    userId: user.id,
    inventoryId: request.inventoryId,
    action: "approve",
    quantity: request.quantity,
  });
    }

    // Reject Request
   if (body.action === "reject") {

  if (request.status !== "pending") {
    return NextResponse.json(
      {
        success: false,
        message: "Request already processed",
      },
      { status: 400 }
    );
  }

  request.status = "rejected";

  await request.save();
  await InventoryLog.create({
  userId: user.id,
  inventoryId: request.inventoryId,
  action: "reject",
  quantity: request.quantity,
});
}

    // User Marks Returned
   // User Marks Returned
if (body.action === "return") {
  if (
    request.userId.toString() !== user.id
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden",
      },
      { status: 403 }
    );
  }

  request.status = "return_pending";
  request.returnedAt = new Date();

  await request.save();

  await InventoryLog.create({
    userId: user.id,
    inventoryId: request.inventoryId,
    action: "return_request",
    quantity: request.quantity,
  });
}
    // Admin Confirms Return
    if (body.action === "confirm_return") {

  if (
    request.status !==
    "return_pending"
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Return not pending",
      },
      { status: 400 }
    );
  }

  const item = await Inventory.findById(
    request.inventoryId
  );

  if (item) {
    item.availableQuantity +=
      request.quantity;

    await item.save();
  }

  request.status = "completed";

  await request.save();
  await InventoryLog.create({
  userId: user.id,
  inventoryId: request.inventoryId,
  action: "return_confirmed",
  quantity: request.quantity,
});
}

    return NextResponse.json({
      success: true,
      request,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Operation failed",
      },
      { status: 500 }
    );
  }
}