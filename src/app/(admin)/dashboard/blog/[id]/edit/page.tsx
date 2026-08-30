import ContentEditor from "@/components/admin/content-editor";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
export const dynamic="force-dynamic";
export default async function EditContentPage({params}:{params:{id:string}}){const post=await prisma.post.findUnique({where:{id:params.id}});if(!post)notFound();return <ContentEditor initial={{...post,type:post.type as any}}/>}
