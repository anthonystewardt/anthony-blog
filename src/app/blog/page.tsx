import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";
import bgblog from "@/../public/bgblog.png";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Image from "next/image";
import SubscriberForm from "@/components/ui/form/subscriber";




const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function BlogPage() {
  const posts = await prisma.post.findMany()

  return (
    <section
      className=" w-full h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgblog.src})` }} // Usar bgblog.src
    >
      <div className="px-10 flex justify-between items-center py-5   ">
        <h1 className="text-2xl font-light text-slate-50">Anthony S.</h1>

        <div className="flex items-center gap-10">
          <Link href={"/"} className="font-semibold text-white" >
            <Button>Home</Button>
          </Link>

        </div>
      </div>
      <nav
        className={cn(
          "flex h-full items-center justify-center w-full ",
          fontSans.variable
        )}
      >
        <div className="flex flex-col gap-10 sm:px-8">
          <h1 className="text-2xl text-center font-semibold text-white/75">Subscribe to my newsletter about my life as a software developer and indie creator</h1>
          {/* create the text to the user give me their email like newsletter site */}
          <div className="flex flex-col gap-4  sm:justify-center sm:items-center p-4">
            <p className="text-white/50">Subscribe to my newsletter</p>
            <SubscriberForm />
          </div>
        </div>
      </nav>

      <div className="mt-10 sm:px-12 md:px-12 lg:px-32 xl:px-40">
        <h2 className="text-2xl  font-semibold pl-4 ">Latest posts</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 flex flex-col items-start"
            >
              <div className="relative w-full h-[250px]">
                <Image
                  src={post.imagePreview}
                  alt={post.title}
                  layout="fill" // Hace que la imagen ocupe todo el contenedor
                  objectFit="cover" // Asegura que la imagen se ajuste sin distorsión
                  className="rounded-lg" // Opcional: redondea las esquinas
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.resumen}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-500 mt-4">
                Read more
              </Link>
            </div>

          ))}
        </div>
      </div>


    </section>
  );
}
