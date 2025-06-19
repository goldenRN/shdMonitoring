"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import logo from '../img/logo.png';
import Image from 'next/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher({
  // versions,
}: {
  // versions: string[]
  // defaultVersion: string
}) {
  // const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      {/* <SidebarMenuItem> */}
            <SidebarMenuButton
              size="lg"
              className="bg-blue-500 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            > 
              <div >
                {/* <GalleryVerticalEnd className="size-4" /> */}
                <Image src={logo} alt="Logo" width={50} height={0} />
              </div>
              <div className="flex flex-col gap-0.5 leading-none text-white">
                <span className="font-medium">СХДЗДТГ</span>
                {/* <span className="">v{selectedVersion}</span> */}
              </div>
              {/* <ChevronsUpDown className="ml-auto" /> */}
            </SidebarMenuButton>
          {/* <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent> */}
      {/* </SidebarMenuItem> */}
    </SidebarMenu>
  )
}
