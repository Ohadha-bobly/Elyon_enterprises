import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PackageCardProps {
  name: string
  speed: number
  data?: number
  price: number
  onSelect: () => void
}

export function PackageCard({ name, speed, data, price, onSelect }: PackageCardProps) {
  return (
    <Card className="p-6 flex flex-col">
      <h3 className="text-2xl font-bold mb-4">{name}</h3>
      <div className="mb-4 flex-grow">
        <p className="text-3xl font-bold text-blue-600">{speed}Mbps</p>
        {data && <p className="text-gray-600">Data: {data}GB/month</p>}
      </div>
      <div className="mb-6">
        <p className="text-2xl font-bold">KES {price}</p>
      </div>
      <Button onClick={onSelect} className="w-full bg-blue-600">Select</Button>
    </Card>
  )
}
