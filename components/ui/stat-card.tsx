interface StatCardProps {
  title: string
  value: string
  change: string
  icon: string
  trend?: 'up' | 'down' | 'stable'
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend = 'stable',
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          trend === 'up' ? 'bg-success/20 text-success' :
          trend === 'down' ? 'bg-error/20 text-error' :
          'bg-info/20 text-info'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
        </span>
      </div>
      <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
