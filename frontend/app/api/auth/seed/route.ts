import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = [
      {
        name: "Admin",
        email: "admin@stac.com",
        password: "admin321",
        role: "admin",
      },
      {
        name: "Core Member",
        email: "core@stac.com",
        password: "core321",
        role: "core",
      },
      {
        name: "Volunteer",
        email: "volunteer@stac.com",
        password: "volunteer321",
        role: "volunteer",
      },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({
        email: user.email,
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(
          user.password,
          10
        );

        await User.create({
          ...user,
          password: hashedPassword,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Dummy users created successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create users",
      },
      {
        status: 500,
      }
    );
  }
}