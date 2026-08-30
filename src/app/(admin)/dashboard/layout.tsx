import TopNavbar from "@/components/ui/top-navbar/TopNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/25">
      <TopNavbar />
      <main className="px-4 pb-12 pt-24 lg:ml-72 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
