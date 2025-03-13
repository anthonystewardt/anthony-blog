import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased ",
          fontSans.variable
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}