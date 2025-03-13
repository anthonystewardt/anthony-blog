import prisma from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request, response: NextResponse) {
  try {
    const subs = await prisma.subscriber.findMany()
    return NextResponse.json(subs, {
      status: 200
    })
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, {
      status: 500
    })
  }
}

export async function POST(req: Request, response: NextResponse) {
  const data = await req.json();
  try {
    // check if the email already exists
    const subFind = await prisma.subscriber.findFirst({
      where: {
        email: data.email
      }
    })
    if (subFind) {
      return NextResponse.json({ message: 'Email already exists' }, {
        status: 400
      })
    }

    const sub = await prisma.subscriber.create({
      data: {
        email: data.email
      }
    })
    return NextResponse.json(sub, {
      status: 201
    })
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, {
      status: 500
    })
  }
}