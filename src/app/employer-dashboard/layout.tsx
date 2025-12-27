import EmployerSidebar from "@/features/employers/components/EmployerSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider defaultOpen={true}>
        <EmployerSidebar />
            <main className="container m-4">
                <SidebarTrigger className="mb-4" />
                {children}
            </main>
    </SidebarProvider>
  );
}
