import { authOptions } from "@/lib/options";
import prisma from "@/lib/db";
import { generateSlugByTitle } from "@/lib/generate-slug-by-title";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.category.findMany({orderBy:{name:"asc"},include:{_count:{select:{posts:true}}}}))}
export async function POST(req:Request){const session=await getServerSession(authOptions);if(!session?.user?.id||session.user.role!=="ADMIN")return NextResponse.json({message:"No autorizado"},{status:403});const data=await req.json();if(!data.name?.trim())return NextResponse.json({message:"El nombre es obligatorio"},{status:400});const category=await prisma.category.create({data:{name:data.name.trim(),slug:generateSlugByTitle(data.name),description:data.description||null,color:data.color||"violet"}});return NextResponse.json(category,{status:201})}
