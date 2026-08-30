import { authOptions } from "@/lib/options";
import prisma from "@/lib/db";
import { generateSlugByTitle } from "@/lib/generate-slug-by-title";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const series = await prisma.series.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json(series);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  const data = await req.json();
  if (!data.title?.trim()) return NextResponse.json({ message: "El título es obligatorio" }, { status: 400 });
  try {
    const series = await prisma.series.create({ data: {
      title: data.title.trim(), slug: generateSlugByTitle(data.title), description: data.description || null,
      imageUrl: data.imageUrl || null, published: !!data.published,
    }});
    return NextResponse.json(series, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Ya existe una serie con ese título" }, { status: 409 });
  }
}
