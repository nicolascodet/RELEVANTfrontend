'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, LayoutGrid, List, Filter, TrendingUp, Clock, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { OpportunityKanban } from '@/components/opportunities/OpportunityKanban'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail'
import { api } from '@/lib/api'
import { ContractOpportunity } from '@/types'

export default function OpportunitiesPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [selectedOpportunity, setSelectedOpportunity] = useState<ContractOpportunity | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  const queryClient = useQueryClient()

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: api.opportunities.getAll,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.opportunities.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
  })

  const handleStatusChange = (opportunityId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: opportunityId, status: newStatus })
  }

  const handleOpportunityClick = (opportunity: ContractOpportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailOpen(true)
  }

  const calculateStats = () => {
    if (!opportunities) return { total: 0, value: 0, active: 0, won: 0 }
    
    return {
      total: opportunities.length,
      value: opportunities.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0),
      active: opportunities.filter(opp => ['new', 'in_progress', 'submitted'].includes(opp.status)).length,
      won: opportunities.filter(opp => opp.status === 'won').length,
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Opportunities</h1>
          <p className="text-gray-500 mt-1">
            Track and manage potential contracts from email intelligence
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Opportunity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Opportunities</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pipeline Value</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.value.toLocaleString()}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">USD</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Won</p>
              <p className="text-2xl font-bold text-green-600">{stats.won}</p>
            </div>
            <Trophy className="h-8 w-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <div className="flex items-center justify-between">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as 'kanban' | 'list')}>
          <ToggleGroupItem value="kanban" aria-label="Kanban view">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
        </ToggleGroup>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Opportunities Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading opportunities...</p>
          </div>
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        view === 'kanban' ? (
          <OpportunityKanban
            opportunities={opportunities}
            onOpportunityClick={handleOpportunityClick}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onClick={() => handleOpportunityClick(opportunity)}
                view="list"
              />
            ))}
          </div>
        )
      ) : (
        <Card className="p-12 text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Opportunities will appear here when AI detects contract-related emails
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Opportunity
          </Button>
        </Card>
      )}

      {/* Opportunity Detail Dialog */}
      <OpportunityDetail
        opportunity={selectedOpportunity}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}