import { Home, Calendar, Store, Users, FileText } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen border-r border-[var(--border)] bg-[var(--bg-soft)] p-4">

      <div className="mb-8 text-lg font-semibold text-[var(--primary)]">
        Admin
      </div>

      <nav className="flex flex-col gap-2 text-sm">

        <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-[#0b1220]" href="/admin">
          <Home size={16}/> Dashboard
        </a>

        <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-[#0b1220]" href="/admin/events">
          <Calendar size={16}/> Events
        </a>

        <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-[#0b1220]" href="/admin/shops">
          <Store size={16}/> Shops
        </a>

        <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-[#0b1220]" href="/admin/users">
          <Users size={16}/> Users
        </a>

        <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-[#0b1220]" href="/admin/content">
          <FileText size={16}/> Content
        </a>

      </nav>

    </div>
  )
}