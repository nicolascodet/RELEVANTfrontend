import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmailMessage } from '@/types'
import { formatRelativeTime, getStatusColor } from '@/lib/utils'
import { Mail, ExternalLink } from 'lucide-react'

interface RecentEmailsProps {
  emails: EmailMessage[]
}

export function RecentEmails({ emails }: RecentEmailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Recent Email Intelligence</span>
        </CardTitle>
        <CardDescription>
          Latest processed emails with AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent emails found</p>
              <p className="text-sm">Connect your email account to get started</p>
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {email.subject}
                    </p>
                    <div className="flex items-center space-x-2">
                      {email.ai_analysis && (
                        <Badge
                          variant="secondary"
                          className={getStatusColor(email.ai_analysis.classification)}
                        >
                          {email.ai_analysis.classification}
                        </Badge>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-1">
                    From: {email.sender}
                  </p>
                  
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {email.body_preview}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(email.date)}
                    </span>
                    {email.ai_analysis && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(email.ai_analysis.confidence * 100)}%
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(email.ai_analysis.priority)}
                        >
                          {email.ai_analysis.priority}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}