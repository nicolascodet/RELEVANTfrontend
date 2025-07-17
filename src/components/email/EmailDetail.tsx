'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { X, Mail, Calendar, Paperclip, Star, ExternalLink, Brain, Target, DollarSign, Loader2, AlertCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { EmailMessage } from '@/types'
import { api } from '@/lib/api'
import DOMPurify from 'isomorphic-dompurify'

interface EmailDetailProps {
  email: EmailMessage | null
  isOpen: boolean
  onClose: () => void
}

export function EmailDetail({ email, isOpen, onClose }: EmailDetailProps) {
  const [fullEmail, setFullEmail] = useState<EmailMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && email) {
      fetchFullEmail()
    }
  }, [isOpen, email])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [isOpen, onClose])

  const fetchFullEmail = async () => {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const messageId = email.message_id || email.id
      const provider = 'gmail' // You might want to get this from the email account data
      const emailData = await api.email.getContent(messageId, provider)
      setFullEmail(emailData)
    } catch (err) {
      console.error('Failed to fetch email content:', err)
      setError('Failed to load email content. Please try again.')
      setFullEmail(email)
    } finally {
      setIsLoading(false)
    }
  }

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

  const renderEmailContent = () => {
    const emailContent = fullEmail || email
    if (!emailContent) return null

    const htmlContent = emailContent.html_body || emailContent.body_html
    const textContent = emailContent.body || emailContent.body_text || emailContent.snippet

    if (htmlContent) {
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'src', 'alt', 'width', 'height'],
        ALLOW_DATA_ATTR: false
      })

      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      )
    }

    return (
      <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
        {textContent || 'No content available'}
      </div>
    )
  }

  const displayEmail = fullEmail || email

  if (!displayEmail) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-xl font-semibold pr-8">
              {displayEmail.subject}
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Metadata */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-56" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">From:</span>
                <span className="text-gray-600">{displayEmail.from || displayEmail.sender}</span>
              </div>
              {displayEmail.to && displayEmail.to.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="font-medium">To:</span>
                  <span className="text-gray-600">{displayEmail.to.join(', ')}</span>
                </div>
              )}
              {displayEmail.cc && displayEmail.cc.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="font-medium">CC:</span>
                  <span className="text-gray-600">{displayEmail.cc.join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Date:</span>
                <span className="text-gray-600">
                  {format(new Date(displayEmail.date || displayEmail.received_at), 'MMMM dd, yyyy \'at\' h:mm a')}
                </span>
              </div>
              {displayEmail.attachments && displayEmail.attachments.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Paperclip className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="font-medium">Attachments:</span>
                  <div className="flex flex-col gap-1">
                    {displayEmail.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-600">{attachment.filename}</span>
                        <span className="text-gray-400 text-xs">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {displayEmail.labels && displayEmail.labels.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium">Labels:</span>
                  <div className="flex flex-wrap gap-1">
                    {displayEmail.labels.map((label, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis */}
          {displayEmail.ai_analysis && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">AI Analysis</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(displayEmail.ai_analysis.category)}>
                    {displayEmail.ai_analysis.category}
                  </Badge>
                  <Badge variant={getPriorityColor(displayEmail.ai_analysis.priority)}>
                    {displayEmail.ai_analysis.priority} Priority
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(displayEmail.ai_analysis.confidence * 100)}% Confidence
                  </Badge>
                </div>

                {displayEmail.ai_analysis.summary && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Summary</h4>
                    <p className="text-sm text-gray-600">{displayEmail.ai_analysis.summary}</p>
                  </div>
                )}

                {displayEmail.ai_analysis.key_entities && displayEmail.ai_analysis.key_entities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Entities</h4>
                    <div className="flex flex-wrap gap-2">
                      {displayEmail.ai_analysis.key_entities.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {displayEmail.ai_analysis.action_items && displayEmail.ai_analysis.action_items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Action Items</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {displayEmail.ai_analysis.action_items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Contract Opportunity Detection */}
          {displayEmail.ai_analysis?.is_contract_opportunity && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Contract Opportunity Detected</h3>
              </div>
              
              <div className="space-y-2">
                {displayEmail.ai_analysis.estimated_value && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Estimated Value:</span>
                    <span className="text-sm text-green-700">
                      ${displayEmail.ai_analysis.estimated_value.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {displayEmail.ai_analysis.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Deadline:</span>
                    <span className="text-sm text-green-700">
                      {format(new Date(displayEmail.ai_analysis.deadline), 'MMMM dd, yyyy')}
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
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {renderEmailContent()}
              </div>
            )}
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
              <Star className={`h-4 w-4 ${displayEmail.is_starred ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}