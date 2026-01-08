import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin | ArqLopes CMS",
  description: "Content Management System for ArqLopes",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
