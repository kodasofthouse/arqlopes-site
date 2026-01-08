"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import Link from "next/link";
import {
  Home,
  Info,
  Image,
  Users,
  Mail,
  Settings,
  FileImage,
  History,
  ArrowRight,
} from "lucide-react";

const sections = [
  {
    title: "Hero Section",
    description: "Edit main banner, title, subtitle, and services",
    href: "/admin/hero",
    icon: Home,
    color: "bg-blue-500",
  },
  {
    title: "About Section",
    description: "Update company info, description, and statistics",
    href: "/admin/about",
    icon: Info,
    color: "bg-green-500",
  },
  {
    title: "Gallery",
    description: "Manage portfolio projects and images",
    href: "/admin/gallery",
    icon: Image,
    color: "bg-purple-500",
  },
  {
    title: "Clients",
    description: "Add or remove client logos",
    href: "/admin/clients",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    title: "Footer",
    description: "Edit contact info and social links",
    href: "/admin/footer",
    icon: Mail,
    color: "bg-red-500",
  },
  {
    title: "Metadata",
    description: "SEO settings and site information",
    href: "/admin/metadata",
    icon: Settings,
    color: "bg-gray-600",
  },
];

const tools = [
  {
    title: "Media Library",
    description: "Browse and manage all uploaded images",
    href: "/admin/media",
    icon: FileImage,
  },
  {
    title: "Version History",
    description: "View and restore previous content versions",
    href: "/admin/versions",
    icon: History,
  },
];

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Content Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group block bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#045B64] transition-colors flex items-center gap-2">
                        {section.title}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-center gap-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-[#045B64] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#045B64] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500">{tool.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-[#045B64] rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Quick Tips</h2>
          <ul className="text-sm space-y-2 text-white/90">
            <li>
              • All changes are automatically versioned. Use Version History to
              restore previous content.
            </li>
            <li>
              • Uploaded images are cached globally for fast delivery.
            </li>
            <li>
              • Content changes appear on the live site within 60 seconds.
            </li>
            <li>
              • Maximum image size is 10MB. Supported formats: JPEG, PNG, WebP.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
