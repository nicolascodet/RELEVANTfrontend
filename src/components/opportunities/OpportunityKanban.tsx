'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OpportunityCard } from './OpportunityCard'
import { ContractOpportunity } from '@/types'

interface OpportunityKanbanProps {
  opportunities: ContractOpportunity[]
  onOpportunityClick: (opportunity: ContractOpportunity) => void
  onStatusChange?: (opportunityId: string, newStatus: string) => void
}

const columns = [
  { id: 'new', title: 'New', color: 'border-blue-200 bg-blue-50' },
  { id: 'in_progress', title: 'In Progress', color: 'border-yellow-200 bg-yellow-50' },
  { id: 'submitted', title: 'Submitted', color: 'border-purple-200 bg-purple-50' },
  { id: 'won', title: 'Won', color: 'border-green-200 bg-green-50' },
  { id: 'lost', title: 'Lost', color: 'border-red-200 bg-red-50' },
]

export function OpportunityKanban({ 
  opportunities, 
  onOpportunityClick,
  onStatusChange 
}: OpportunityKanbanProps) {
  const [draggedOpportunity, setDraggedOpportunity] = useState<ContractOpportunity | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const getOpportunitiesByStatus = (status: string) => {
    return opportunities.filter(opp => opp.status === status)
  }

  const handleDragStart = (e: React.DragEvent, opportunity: ContractOpportunity) => {
    setDraggedOpportunity(opportunity)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    
    if (draggedOpportunity && draggedOpportunity.status !== newStatus) {
      onStatusChange?.(draggedOpportunity.id, newStatus)
    }
    
    setDraggedOpportunity(null)
  }

  const getColumnStats = (status: string) => {
    const opps = getOpportunitiesByStatus(status)
    const total = opps.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0)
    return { count: opps.length, value: total }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const stats = getColumnStats(column.id)
        const isDropTarget = dragOverColumn === column.id
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card className={`h-full ${column.color} ${
              isDropTarget ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="text-sm text-gray-500">{stats.count}</span>
                </div>
                {stats.value > 0 && (
                  <p className="text-sm text-gray-600">
                    ${stats.value.toLocaleString()}
                  </p>
                )}
              </div>
              
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="p-4 space-y-3">
                  {getOpportunitiesByStatus(column.id).map((opportunity) => (
                    <div
                      key={opportunity.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity)}
                      className="cursor-move"
                    >
                      <OpportunityCard
                        opportunity={opportunity}
                        onClick={() => onOpportunityClick(opportunity)}
                        view="kanban"
                      />
                    </div>
                  ))}
                  
                  {getOpportunitiesByStatus(column.id).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No opportunities</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        )
      })}
    </div>
  )
}