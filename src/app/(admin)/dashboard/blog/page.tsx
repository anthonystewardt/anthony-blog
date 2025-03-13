import prisma from "@/lib/db"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import DialogDemo from "@/components/ui/modal/Dialog"
import Link from "next/link"

const BlogPageAdmin = async () => {

  const posts = await prisma.post.findMany()

  return (
    <section>
      <div className="flex items-center text-sm text-gray-500 gap-2 mb-5 hover:text-gray-900 cursor-pointer transition-all ">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        Regresar a home
      </div>

      <h1 className="text-3xl font-semibold">BLOG</h1>
      {/* <Button>Nuevo Blog</Button> */}
      <div className="flex justify-end mt-5  ">
        {/* <DialogDemo /> */}
        <Link href='/dashboard/blog/create'>
          <Button
            size={'sm'}
          >Nuevo Blog</Button>
        </Link>
      </div>
    </section>
  )
}
export default BlogPageAdmin