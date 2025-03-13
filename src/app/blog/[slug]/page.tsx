// import remark from "remark";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import remarkHtml from "remark-html";
import { formatDate } from '../../../lib/utils';
import { remark } from "remark";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface IParams {
  params: {
    slug: string;
  }
}

const getPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: {
      slug
    }
  });

  return post;
}



const BlogById = async ({ params }: IParams) => {

  const { slug } = params;

  const post = await prisma.post.findUnique({
    where: {
      slug
    }
  });

  console.log({ post });

  if (!post) {
    return (
      notFound()
    )
  }

  const formatDate = new Date(post.createdAt).toLocaleDateString();


  // Convertir el contenido Markdown a HTML
  const processedContent = await remark()
    .use(remarkHtml)
    .process(post.content);

  const contentHtml = processedContent.toString();


  return (
    <main className=" sm:px-6 md:px-8 xl:px-48 py-24 ">
      <div className=" inline-flex">
        <Link href="/blog" className="px-3 py-2 flex  gap-2 bg-slate-300/50 text-slate-800 dark:text-slate-300 rounded-md hover:bg-slate-500/40 transition ease">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <span className="font-semibold text-xs">Back</span>
        </Link>
      </div>
      <section className="flex flex-col items-center gap-4">
        <div className="flex gap-3 items-center">
          <span
            className="px-2 text-center py-1 text-zinc-800/80 dark:text-slate-50/90 text-sm bg-green-500/50 rounded-md"
          >{post.published ? "published" : "unpublished"}</span>
          <span
            className="px-2 text-center py-1 text-zinc-800 dark:text-slate-50/90 text-sm bg-slate-500/50 rounded-md"
          >{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "----"}</span>
        </div>
        <h1 className="text-7xl font-bold dark:text-white text-center text-slate-800">{post.title}</h1>
        <p className="text-lg text-center text-slate-800 dark:text-slate-300">{post.resumen}</p>

        {/* image */}
        <div className="mt-10">
          <img src={post.imagePreview} alt={post.title} className="w-full h-[500px] object-cover" />
        </div>


        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* <div className="">
          <ReactMarkdown>{contentHtml}</ReactMarkdown>
        </div> */}



      </section>
    </main>
  )
}
export default BlogById