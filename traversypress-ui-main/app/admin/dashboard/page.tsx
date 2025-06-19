// // import { AppSidebar } from "@/components/app-sidebar"
// // import {
// //   Breadcrumb,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbList,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb"
// // import { Separator } from "@/components/ui/separator"
// // import {
// //   SidebarInset,
// //   SidebarProvider,
// //   SidebarTrigger,
// // } from "@/components/ui/sidebar"

// // export default function Page() {
// //   return (
// //     <SidebarProvider>
// //       <AppSidebar />
// //       <SidebarInset>
// //         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
// //           <div className="flex items-center gap-2 px-4">
// //             <SidebarTrigger className="-ml-1" />
// //             <Separator orientation="vertical" className="mr-2 h-4" />
// //             <Breadcrumb>
// //               <BreadcrumbList>
// //                 <BreadcrumbItem className="hidden md:block">
// //                   <BreadcrumbLink href="#">
// //                     Building Your Application
// //                   </BreadcrumbLink>
// //                 </BreadcrumbItem>
// //                 <BreadcrumbSeparator className="hidden md:block" />
// //                 <BreadcrumbItem>
// //                   <BreadcrumbPage>Data Fetching</BreadcrumbPage>
// //                 </BreadcrumbItem>
// //               </BreadcrumbList>
// //             </Breadcrumb>
// //           </div>
// //         </header>
// //         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
// //           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
// //             <div className="aspect-video rounded-xl bg-muted/50" />
// //             <div className="aspect-video rounded-xl bg-muted/50" />
// //             <div className="aspect-video rounded-xl bg-muted/50" />
// //           </div>
// //           <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
// //         </div>
// //       </SidebarInset>
// //     </SidebarProvider>
// //   )
// // }

// import { AppSidebar } from "@/components/app-sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// export default function Page() {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "350px",
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar />
//       <SidebarInset>
//         <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
//           <SidebarTrigger className="-ml-1" />
//           <Separator
//             orientation="vertical"
//             className="mr-2 data-[orientation=vertical]:h-4"
//           />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem className="hidden md:block">
//                 <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>Inbox</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4">
//           {Array.from({ length: 24 }).map((_, index) => (
//             <div
//               key={index}
//               className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
//             />
//           ))}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }


import DashboardCard from '@/components/dashboard/DashboardCard';
import PostsTable from '@/components/posts/PostsTable';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { FolderArchive, MessageCircle, Newspaper, User } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <>
    
      <div className='flex flex-col md:flex-row gap-5 mb-5'>
        <DashboardCard
          title='Мэдээлэл'
          count={100}
          icon={<Newspaper className='text-slate-/800' size={60} />}
        />
        <DashboardCard
          title='Хороо'
          count={42}
          icon={<Newspaper className='text-slate-800' size={60} />}
        />
        <DashboardCard
          title='Дүүрэг'
          count={1}
          icon={<Newspaper className='text-slate-800' size={60} />}
        />
        <DashboardCard
          title='Хэрэгжсэн'
          count={20}
          icon={<MessageCircle className='text-slate-500' size={72} />}
        />
      </div>
      <AnalyticsChart />
      {/* <PostsTable title='Сүүлд нэмэгдсэн' limit={5} /> */}
    </>
  );
}


