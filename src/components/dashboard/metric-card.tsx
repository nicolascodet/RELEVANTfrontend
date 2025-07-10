import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    positive?: boolean
  }
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  className 
}: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <p className="text-xs text-gray-600 mt-1">
            <span 
              className={cn(
                'font-medium',
                change.positive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change.positive ? '+' : ''}{change.value}%
            </span>{' '}
            {change.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}