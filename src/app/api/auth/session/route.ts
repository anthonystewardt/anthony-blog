import prisma from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcrypt';



export async function GET(request: Request) {

  return new Response(JSON.stringify({
    message: 'Hello World'
  }), { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const findUser = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    if (!findUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(body.password, findUser.password);

    console.log({ isPasswordValid })

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { password, ...user } = findUser;

    console.log({ findUser })
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}