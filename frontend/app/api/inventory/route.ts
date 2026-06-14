import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
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


    const items = await Inventory.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inventory",
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
    if (
  !body.name ||
  !body.category ||
  body.totalQuantity < 0 ||
  body.availableQuantity < 0
) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid inventory data",
    },
    { status: 400 }
  );
}
const qrValue =
  `inventory_${Date.now()}`;

const qrImage =
  await QRCode.toDataURL(qrValue);

const item = await Inventory.create({
  name: body.name,
  category: body.category,
  totalQuantity: body.totalQuantity,
  availableQuantity: body.availableQuantity,

  qrValue,
  qrCode: qrImage,
});
    await InventoryLog.create({
  userId: user.id,
  inventoryId: item._id,
  action: "add",
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
        message: "Failed to create item",
      },
      { status: 500 }
    );
  }
}