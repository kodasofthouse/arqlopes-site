"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Info,
  Image as ImageIcon,
  Users,
  Mail,
  FileImage,
  History,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Painel", href: "/admin", icon: LayoutDashboard },
  { name: "Hero", href: "/admin/hero", icon: Home },
  { name: "Sobre", href: "/admin/about", icon: Info },
  { name: "Galeria", href: "/admin/gallery", icon: ImageIcon },
  { name: "Clientes", href: "/admin/clients", icon: Users },
  { name: "Rodapé", href: "/admin/footer", icon: Mail },
  { name: "Metadados", href: "/admin/metadata", icon: Settings },
  { type: "divider" as const },
  { name: "Biblioteca de Mídia", href: "/admin/media", icon: FileImage },
  { name: "Histórico de Versões", href: "/admin/versions", icon: History },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] text-white flex flex-col">
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-4">
        <Link href="/admin">
          <Image
            src="/logos/arqlopes-logo.svg"
            alt="ArqLopes"
            width={160}
            height={34}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item, index) => {
            if ("type" in item && item.type === "divider") {
              return (
                <li key={`divider-${index}`} className="py-2">
                  <div className="h-px bg-white/10" />
                </li>
              );
            }

            if (!("href" in item)) return null;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#045B64] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair para o Site
        </Link>
      </div>
    </aside>
  );
}
