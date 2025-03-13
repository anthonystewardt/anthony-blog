import prisma from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server'

import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


export async function GET(request: Request) {

  try {
    const posts = await prisma.post.findMany()
    return NextResponse.json(posts, {
      status: 200
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error' }, {
      status: 500
    })
  }
}

// create a new post (image upload, title, resumen, content)
export async function POST(req: Request) {

  const data = await req.formData();

  try {
    const post = await prisma.post.create({
      data: {
        title: data.get('title') as string,
        resumen: data.get('resumen') as string,
        content: data.get('content') as string,
        authorId: data.get('authorId') as string,
        published: true,
        imagePreview: data.get('photo') as string,
        slug: data.get('slug') as string
      }
    })
    return NextResponse.json(post, {
      status: 201
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error', error }, {
      status: 500
    })
  }
}