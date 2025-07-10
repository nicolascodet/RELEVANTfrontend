'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Mail, AlertCircle, CheckCircle, Clock, Star, Paperclip } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmailMessage } from '@/types'

interface EmailListProps {
  emails: EmailMessage[]
  isLoading: boolean
  onEmailClick: (email: EmailMessage) => void
}

export function EmailList({ emails, isLoading, onEmailClick }: EmailListProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)

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

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (confidence >= 0.6) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
        <p className="text-sm text-gray-500">
          Connect your Gmail account to start analyzing emails
        </p>
      </Card>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Subject</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                selectedEmailId === email.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => {
                setSelectedEmailId(email.id)
                onEmailClick(email)
              }}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {email.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  {email.has_attachments && <Paperclip className="h-4 w-4 text-gray-400" />}
                  <span className="truncate max-w-md">{email.subject}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="truncate max-w-xs">{email.sender}</div>
              </TableCell>
              <TableCell>
                {email.ai_analysis?.category && (
                  <Badge className={getCategoryColor(email.ai_analysis.category)}>
                    {email.ai_analysis.category}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {email.ai_analysis?.priority && (
                  <Badge variant={getPriorityColor(email.ai_analysis.priority)}>
                    {email.ai_analysis.priority}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {email.ai_analysis?.confidence && getConfidenceIcon(email.ai_analysis.confidence)}
                  <span className="text-sm text-gray-500">
                    {email.ai_analysis?.confidence ? 
                      `${Math.round(email.ai_analysis.confidence * 100)}%` : 
                      'N/A'
                    }
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-sm text-gray-500">
                {format(new Date(email.received_at), 'MMM dd, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}