import { requireAdmin } from "@/lib/permissions";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar adminEmail={admin.email} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
