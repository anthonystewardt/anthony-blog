import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { request } from "http";



export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, name, role } = data;
    const userFound = await prisma.user.findUnique({
      where: {
        email,
      },
    });


    if (userFound) {
      return NextResponse.json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, {
      status: 201,
    });
  }
  catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
    }, {
      status: 500,
    });
  }
}


