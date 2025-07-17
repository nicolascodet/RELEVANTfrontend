'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { 
  X, Mail, Calendar, Paperclip, Star, ExternalLink, Brain, Target, 
  DollarSign, Loader2, AlertCircle, Reply, Forward, Download, 
  Search, Printer, Eye, EyeOff 
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { EmailMessage } from '@/types'
import { api } from '@/lib/api'
import DOMPurify from 'isomorphic-dompurify'

interface EmailDetailProps {
  email: EmailMessage | null
  isOpen: boolean
  onClose: () => void
  onReply?: (email: EmailMessage) => void
  onForward?: (email: EmailMessage) => void
  onMarkAsRead?: (messageId: string, isRead: boolean) => void
}

export function EmailDetail({ 
  email, 
  isOpen, 
  onClose, 
  onReply, 
  onForward,
  onMarkAsRead 
}: EmailDetailProps) {
  const [fullEmail, setFullEmail] = useState<EmailMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isRead, setIsRead] = useState(true)

  useEffect(() => {
    if (isOpen && email) {
      fetchFullEmail()
      setIsRead(email.is_read || true)
    }
  }, [isOpen, email])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (showSearch) {
          setShowSearch(false)
          setSearchTerm('')
        } else {
          onClose()
        }
      }
    }

    const handleCtrlF = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f' && isOpen) {
        event.preventDefault()
        setShowSearch(true)
      }
    }

    const handleCtrlP = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p' && isOpen) {
        event.preventDefault()
        handlePrint()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    document.addEventListener('keydown', handleCtrlF)
    document.addEventListener('keydown', handleCtrlP)
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.removeEventListener('keydown', handleCtrlF)
      document.removeEventListener('keydown', handleCtrlP)
    }
  }, [isOpen, onClose, showSearch])

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

  const handleMarkAsRead = () => {
    const displayEmail = fullEmail || email
    if (!displayEmail) return

    const newReadStatus = !isRead
    setIsRead(newReadStatus)
    
    if (onMarkAsRead) {
      const messageId = displayEmail.message_id || displayEmail.id
      onMarkAsRead(messageId, newReadStatus)
    }
  }

  const handleReply = () => {
    const displayEmail = fullEmail || email
    if (displayEmail && onReply) {
      onReply(displayEmail)
    }
  }

  const handleForward = () => {
    const displayEmail = fullEmail || email
    if (displayEmail && onForward) {
      onForward(displayEmail)
    }
  }

  const handleDownloadAttachment = (attachment: any) => {
    // In a real implementation, this would download the attachment
    console.log('Downloading attachment:', attachment.filename)
    // You would typically call an API endpoint to get the attachment data
    // then create a download link
  }

  const handlePrint = () => {
    window.print()
  }

  const handleOpenInGmail = () => {
    // This would open the email in Gmail
    // You'd need the Gmail URL structure for this
    const displayEmail = fullEmail || email
    if (displayEmail) {
      window.open(`https://mail.google.com/mail/u/0/#inbox/${displayEmail.message_id || displayEmail.id}`, '_blank')
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

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  const renderEmailContent = () => {
    const emailContent = fullEmail || email
    if (!emailContent) return null

    const htmlContent = emailContent.html_body || emailContent.body_html
    const textContent = emailContent.body || emailContent.body_text || emailContent.snippet

    if (htmlContent) {
      let processedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'mark'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'src', 'alt', 'width', 'height'],
        ALLOW_DATA_ATTR: false
      })

      // Apply search highlighting
      if (searchTerm) {
        processedHtml = highlightSearchTerm(processedHtml)
      }

      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      )
    }

    const highlightedText = searchTerm ? highlightSearchTerm(textContent || 'No content available') : (textContent || 'No content available')

    return (
      <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
        {searchTerm ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
        ) : (
          highlightedText
        )}
      </div>
    )
  }

  const displayEmail = fullEmail || email

  if (!displayEmail) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto print:max-w-full">
        <SheetHeader className="print:hidden">
          <div className="flex items-start justify-between">
            <SheetTitle className="text-xl font-semibold pr-8">
              {displayEmail.subject}
            </SheetTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMarkAsRead}
                title={isRead ? "Mark as unread" : "Mark as read"}
              >
                {isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-4 flex items-center gap-2 print:hidden">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search in email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false)
                setSearchTerm('')
              }}
            >
              Close
            </Button>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="print:hidden">
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
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-gray-600 hover:text-gray-900"
                          onClick={() => handleDownloadAttachment(attachment)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {attachment.filename}
                        </Button>
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
            <Card className="p-4 bg-gray-50 print:border-gray-300">
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
            <Card className="p-4 bg-green-50 border-green-200 print:border-green-300">
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

                <Button className="mt-3 w-full print:hidden" variant="default">
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
          <div className="flex flex-wrap gap-2 pt-4 border-t print:hidden">
            <Button variant="outline" onClick={handleReply}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" onClick={handleForward}>
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
            <Button variant="outline" onClick={handleOpenInGmail}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Gmail
            </Button>
            <Button variant="outline" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
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