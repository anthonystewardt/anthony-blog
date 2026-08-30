import { authOptions } from "@/lib/options";
import prisma from "@/lib/db";
import { notifyNewPublication } from "@/lib/newsletter";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request,{params}:{params:{id:string}}){
  const session=await getServerSession(authOptions);if(!session?.user?.id||session.user.role!=="ADMIN")return NextResponse.json({message:"No autorizado"},{status:403});
  const data=await req.json();
  try{
    const previous=await prisma.post.findUnique({where:{id:params.id},select:{published:true,notificationSentAt:true}});
    const post=await prisma.post.update({where:{id:params.id},data:{title:data.title,slug:data.slug,resumen:data.resumen,content:data.content,imagePreview:data.imagePreview||null,type:data.type,youtubeUrl:data.youtubeUrl||null,tags:data.tags??[],categoryId:data.categoryId||null,seriesId:data.seriesId||null,lessonNumber:data.seriesId&&data.lessonNumber?Number(data.lessonNumber):null,featured:!!data.featured,published:!!data.published,publishedAt:data.published?(previous?.published?undefined:new Date()):null,readingTime:data.readingTime,seoTitle:data.seoTitle||null,seoDescription:data.seoDescription||null}});
    let notification=null;
    if(post.published&&!previous?.published&&!post.notificationSentAt){
      try{
        notification=await notifyNewPublication(post);
        if(notification.completed)await prisma.post.update({where:{id:post.id},data:{notificationSentAt:new Date()}});
      }catch(error){notification={completed:false,sent:0,reason:error instanceof Error?error.message:"unknown_error"}}
    }
    return NextResponse.json({...post,notification});
  }catch(error){return NextResponse.json({message:"No se pudo actualizar",detail:error instanceof Error?error.message:undefined},{status:500})}
}
export async function DELETE(_:Request,{params}:{params:{id:string}}){const session=await getServerSession(authOptions);if(!session?.user?.id||session.user.role!=="ADMIN")return NextResponse.json({message:"No autorizado"},{status:403});await prisma.post.delete({where:{id:params.id}});return NextResponse.json({ok:true})}
