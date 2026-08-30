import { authOptions } from "@/lib/options";
import { estimateReadingTime } from "@/lib/content";
import prisma from "@/lib/db";
import { notifyNewPublication } from "@/lib/newsletter";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({ where: { published: true }, include: { category: true, author: { select: { id: true, name: true } } }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  const data = await req.json();
  if (!data.title?.trim() || !data.resumen?.trim() || !data.content?.trim()) return NextResponse.json({ message: "Título, resumen y contenido son obligatorios" }, { status: 400 });
  try {
    const post = await prisma.post.create({ data: {
      title: data.title.trim(), slug: data.slug, resumen: data.resumen.trim(), content: data.content,
      imagePreview: data.imagePreview || null, type: data.type, youtubeUrl: data.youtubeUrl || null,
      tags: data.tags ?? [], categoryId: data.categoryId || null, featured: !!data.featured,
      seriesId: data.seriesId || null, lessonNumber: data.seriesId && data.lessonNumber ? Number(data.lessonNumber) : null,
      published: !!data.published, publishedAt: data.published ? new Date() : null,
      readingTime: data.readingTime ?? estimateReadingTime(data.content), seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null, authorId: session.user.id,
    }});
    let notification = null;
    if (post.published) {
      try {
        notification = await notifyNewPublication(post);
        if (notification.completed) {
          await prisma.post.update({ where: { id: post.id }, data: { notificationSentAt: new Date() } });
        }
      } catch (error) {
        notification = { completed: false, sent: 0, reason: error instanceof Error ? error.message : "unknown_error" };
      }
    }
    return NextResponse.json({ ...post, notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "No se pudo crear el contenido", detail: error instanceof Error ? error.message : undefined }, { status: 500 });
  }
}
