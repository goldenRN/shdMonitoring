




//   return (
//     <>
//       {!shouldHideHeader && <Navbar />}

//     </>
//   )
// }
'use client'
import { usePathname } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
// import PostsTable from '@/components/posts/PostsTable';
// import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { FolderArchive, MessageCircle, Newspaper, User } from 'lucide-react';
import DashboardPage from "./dashboard/page";

export default function AdminPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // const hideHeaderRoutes = ['/auth','/admin','/admin/dashboard','/admin/khoroo','/admin/posts']
    // const shouldHideHeader = hideHeaderRoutes.includes(pathname)
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {/* <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem> */}
                            {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                            {/* <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem> */}
                        </BreadcrumbList>
                    </Breadcrumb>

                </header>

                {/* <DashboardPage/> */}
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                    {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
                </div>
            </SidebarInset>

        </SidebarProvider>
    )
}



