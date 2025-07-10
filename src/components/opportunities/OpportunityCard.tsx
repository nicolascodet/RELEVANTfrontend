'use client'

import { format } from 'date-fns'
import { Calendar, DollarSign, Clock, AlertCircle, Building2, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContractOpportunity } from '@/types'

interface OpportunityCardProps {
  opportunity: ContractOpportunity
  onClick: () => void
  view?: 'kanban' | 'list'
}

export function OpportunityCard({ opportunity, onClick, view = 'kanban' }: OpportunityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'submitted':
        return 'bg-purple-100 text-purple-800'
      case 'won':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getDaysUntilDeadline = () => {
    if (!opportunity.deadline) return null
    const today = new Date()
    const deadline = new Date(opportunity.deadline)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilDeadline()

  if (view === 'list') {
    return (
      <Card 
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{opportunity.title}</h3>
              <Badge className={getStatusColor(opportunity.status)}>
                {opportunity.status.replace('_', ' ')}
              </Badge>
              {opportunity.priority && (
                <Badge variant={getPriorityColor(opportunity.priority)}>
                  {opportunity.priority}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
              {opportunity.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{opportunity.company}</span>
                </div>
              )}
              
              {opportunity.estimated_value && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${opportunity.estimated_value.toLocaleString()}</span>
                </div>
              )}
              
              {opportunity.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(opportunity.deadline), 'MMM dd, yyyy')}</span>
                </div>
              )}
              
              {daysLeft !== null && (
                <div className={`flex items-center gap-1 ${daysLeft <= 3 ? 'text-red-600' : ''}`}>
                  <Clock className="h-4 w-4" />
                  <span>{daysLeft} days left</span>
                </div>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold line-clamp-2">{opportunity.title}</h3>
          {opportunity.priority && (
            <Badge variant={getPriorityColor(opportunity.priority)} className="ml-2">
              {opportunity.priority}
            </Badge>
          )}
        </div>

        {opportunity.company && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{opportunity.company}</span>
          </div>
        )}

        {opportunity.estimated_value && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              ${opportunity.estimated_value.toLocaleString()}
            </span>
          </div>
        )}

        {opportunity.deadline && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{format(new Date(opportunity.deadline), 'MMM dd, yyyy')}</span>
            </div>
            
            {daysLeft !== null && daysLeft <= 7 && (
              <div className={`flex items-center gap-2 text-sm ${
                daysLeft <= 3 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">
                  {daysLeft === 0 ? 'Due today!' : `${daysLeft} days left`}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Badge className={getStatusColor(opportunity.status)}>
            {opportunity.status.replace('_', ' ')}
          </Badge>
          
          {opportunity.source_email_id && (
            <Mail className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    </Card>
  )
}