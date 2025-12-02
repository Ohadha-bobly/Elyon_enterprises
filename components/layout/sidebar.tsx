'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: string
  submenu?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Clients', href: '/dashboard/clients', icon: '👥' },
  { label: 'Packages', href: '/dashboard/packages', icon: '📦' },
  { label: 'Routers', href: '/dashboard/routers', icon: '🔌' },
  { label: 'Billing', href: '/dashboard/billing', icon: '💰' },
  { label: 'SMS', href: '/dashboard/sms', icon: '📱' },
  { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

export function Sidebar({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-primary">Elyon ISP</h2>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-muted hover:text-foreground transition"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-card-hover'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <button className="w-full py-2 px-4 text-sm font-medium text-foreground hover:bg-card-hover rounded-lg transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
