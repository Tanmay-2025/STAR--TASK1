import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import InventoryLog from "@/models/InventoryLog";
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

if (user.role !== "admin") {
  return NextResponse.json(
    {
      success: false,
      message: "Admin access required",
    },
    { status: 403 }
  );
}

    const body = await req.json();

    const item = await Inventory.findByIdAndUpdate(
  params.id,
  body,
  {
    new: true,
  }
);

if (!item) {
  return NextResponse.json(
    {
      success: false,
      message: "Item not found",
    },
    { status: 404 }
  );
}
await InventoryLog.create({
  userId: user.id,
  inventoryId: item._id,
  action: "update",
  quantity: item.totalQuantity,
});

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

if (user.role !== "admin") {
  return NextResponse.json(
    {
      success: false,
      message: "Admin access required",
    },
    { status: 403 }
  );
}

    const item = await Inventory.findById(
  params.id
);

if (!item) {
  return NextResponse.json(
    {
      success: false,
      message: "Item not found",
    },
    { status: 404 }
  );
}

await Inventory.findByIdAndDelete(
  params.id
);



await InventoryLog.create({
  userId: user.id,
  inventoryId: item._id,
  action: "delete",
  quantity: item.totalQuantity,
});
    return NextResponse.json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 }
    );
  }
}