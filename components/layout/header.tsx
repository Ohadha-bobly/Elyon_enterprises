'use client'

import { useState } from 'react'

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 hover:bg-card-hover rounded-lg transition"
      >
        ☰
      </button>

      <div className="flex-1 max-w-md hidden md:block">
        <input
          type="text"
          placeholder="Search clients, routers, transactions..."
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-card-hover rounded-lg transition">🔔</button>
        <button className="p-2 hover:bg-card-hover rounded-lg transition">👤</button>
        <button className="p-2 hover:bg-card-hover rounded-lg transition">⋯</button>
      </div>
    </header>
  )
}
