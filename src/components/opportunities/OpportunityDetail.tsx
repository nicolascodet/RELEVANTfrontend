'use client'

import { format } from 'date-fns'
import { X, Calendar, DollarSign, Building2, Mail, User, FileText, Clock, Edit, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContractOpportunity } from '@/types'

interface OpportunityDetailProps {
  opportunity: ContractOpportunity | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (opportunity: ContractOpportunity) => void
  onDelete?: (opportunityId: string) => void
}

export function OpportunityDetail({
  opportunity,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: OpportunityDetailProps) {
  if (!opportunity) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-2xl font-bold mb-2">
                {opportunity.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(opportunity.status)}>
                  {opportunity.status.replace('_', ' ')}
                </Badge>
                {opportunity.priority && (
                  <Badge variant={getPriorityColor(opportunity.priority)}>
                    {opportunity.priority} Priority
                  </Badge>
                )}
                {opportunity.ai_confidence && (
                  <Badge variant="outline">
                    {Math.round(opportunity.ai_confidence * 100)}% AI Confidence
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="icon" onClick={() => onEdit(opportunity)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="icon" onClick={() => onDelete(opportunity.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Key Information */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Key Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {opportunity.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{opportunity.company}</p>
                    </div>
                  </div>
                )}
                
                {opportunity.estimated_value && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Estimated Value</p>
                      <p className="font-medium text-green-600">
                        ${opportunity.estimated_value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {opportunity.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-medium">
                        {format(new Date(opportunity.deadline), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                
                {daysLeft !== null && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Time Remaining</p>
                      <p className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : ''}`}>
                        {daysLeft === 0 ? 'Due today!' : `${daysLeft} days`}
                      </p>
                    </div>
                  </div>
                )}
                
                {opportunity.contact_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{opportunity.contact_name}</p>
                      {opportunity.contact_email && (
                        <p className="text-sm text-gray-600">{opportunity.contact_email}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            {opportunity.description && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
              </Card>
            )}

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Metadata */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Metadata</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{format(new Date(opportunity.created_at), 'MMM dd, yyyy h:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span>{format(new Date(opportunity.updated_at), 'MMM dd, yyyy h:mm a')}</span>
                </div>
                {opportunity.source_email_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source</span>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>Email</span>
                    </div>
                  </div>
                )}
                {opportunity.ai_generated && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">AI Generated</span>
                    <Badge variant="outline" className="text-xs">Yes</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Notes */}
            {opportunity.notes && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.notes}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Activity timeline coming soon</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button className="flex-1">
            Update Status
          </Button>
          <Button variant="outline" className="flex-1">
            Add Note
          </Button>
          {opportunity.source_email_id && (
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              View Email
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}