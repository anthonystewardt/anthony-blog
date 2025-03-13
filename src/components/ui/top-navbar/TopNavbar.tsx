"use client"
import { LogOut } from "lucide-react"
import { Button } from "../button"
import { signOut } from "next-auth/react"




const TopNavbar = () => {
  return (
    <nav className="py-4 px-8 flex mb-10 justify-between items-center shadow-xl border-b-2 border-slate-900">
      <h1 className="text-3xl font-semibold">Anthony S.</h1>
      <ul className="flex gap-4">
        <li>Dashboard</li>
        <li>Blog</li>
        <li>Projects</li>
      </ul>
      <Button size={"sm"}
        onClick={() => {
          console.log("Log out")
          signOut()
        }}
      >Log out</Button>
    </nav>
  )
}
export default TopNavbar