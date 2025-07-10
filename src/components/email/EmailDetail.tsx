'use client'

import { format } from 'date-fns'
import { X, Mail, Calendar, Paperclip, Star, ExternalLink, Brain, Target, DollarSign } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmailMessage } from '@/types'

interface EmailDetailProps {
  email: EmailMessage | null
  isOpen: boolean
  onClose: () => void
}

export function EmailDetail({ email, isOpen, onClose }: EmailDetailProps) {
  if (!email) return null

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'contract':
        return 'bg-blue-100 text-blue-800'
      case 'opportunity':
        return 'bg-green-100 text-green-800'
      case 'follow-up':
        return 'bg-yellow-100 text-yellow-800'
      case 'inquiry':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-xl font-semibold pr-8">
              {email.subject}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Email Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="font-medium">From:</span>
              <span className="text-gray-600">{email.sender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Date:</span>
              <span className="text-gray-600">
                {format(new Date(email.received_at), 'MMMM dd, yyyy \'at\' h:mm a')}
              </span>
            </div>
            {email.has_attachments && (
              <div className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Attachments:</span>
                <span className="text-gray-600">Yes</span>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          {email.ai_analysis && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">AI Analysis</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(email.ai_analysis.category)}>
                    {email.ai_analysis.category}
                  </Badge>
                  <Badge variant={getPriorityColor(email.ai_analysis.priority)}>
                    {email.ai_analysis.priority} Priority
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(email.ai_analysis.confidence * 100)}% Confidence
                  </Badge>
                </div>

                {email.ai_analysis.summary && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Summary</h4>
                    <p className="text-sm text-gray-600">{email.ai_analysis.summary}</p>
                  </div>
                )}

                {email.ai_analysis.key_entities && email.ai_analysis.key_entities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {email.ai_analysis.key_entities.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {email.ai_analysis.action_items && email.ai_analysis.action_items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Action Items</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {email.ai_analysis.action_items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Contract Opportunity Detection */}
          {email.ai_analysis?.is_contract_opportunity && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Contract Opportunity Detected</h3>
              </div>
              
              <div className="space-y-2">
                {email.ai_analysis.estimated_value && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Estimated Value:</span>
                    <span className="text-sm text-green-700">
                      ${email.ai_analysis.estimated_value.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {email.ai_analysis.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Deadline:</span>
                    <span className="text-sm text-green-700">
                      {format(new Date(email.ai_analysis.deadline), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                )}

                <Button className="mt-3 w-full" variant="default">
                  Create Opportunity
                </Button>
              </div>
            </Card>
          )}

          {/* Email Body */}
          <div>
            <h3 className="font-semibold mb-2">Email Content</h3>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                {email.body_text || email.body_html || 'No content available'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Gmail
            </Button>
            <Button variant="outline" size="icon">
              <Star className={`h-4 w-4 ${email.is_starred ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}