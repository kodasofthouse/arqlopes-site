"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/hero": "Edit Hero Section",
  "/admin/about": "Edit About Section",
  "/admin/gallery": "Manage Gallery",
  "/admin/clients": "Manage Clients",
  "/admin/footer": "Edit Footer",
  "/admin/metadata": "Site Metadata",
  "/admin/media": "Media Library",
  "/admin/versions": "Version History",
};

interface AdminHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  actions?: React.ReactNode;
}

export function AdminHeader({ onRefresh, isLoading, actions }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";
  const isSubPage = pathname !== "/admin";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        {isSubPage && (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
        )}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
        {actions}
      </div>
    </header>
  );
}
