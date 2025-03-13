import TopNavbar from "@/components/ui/top-navbar/TopNavbar";

export default function DashbaordLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-max ">
      <TopNavbar />
      {children}
    </div>
  );
}