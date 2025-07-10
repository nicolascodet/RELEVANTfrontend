'use client'

import { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, RefreshCw, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmailList } from '@/components/email/EmailList'
import { EmailDetail } from '@/components/email/EmailDetail'
import { EmailFilters } from '@/components/email/EmailFilters'
import { Pagination } from '@/components/ui/pagination'
import { api } from '@/lib/api'
import { EmailMessage } from '@/types'

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priority: 'all',
    dateRange: 'all',
  })

  const { data: emailAccounts } = useQuery({
    queryKey: ['emailAccounts'],
    queryFn: api.email.getAccounts,
  })

  const { data: emailsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['emails', currentPage, filters],
    queryFn: () => api.email.getMessages({
      page: currentPage,
      limit: 20,
      search: filters.search || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      priority: filters.priority !== 'all' ? filters.priority : undefined,
    }),
  })

  const handleEmailClick = useCallback((email: EmailMessage) => {
    setSelectedEmail(email)
    setIsDetailOpen(true)
  }, [])

  const handleSyncEmails = async () => {
    if (emailAccounts && emailAccounts.length > 0) {
      try {
        await api.email.syncAccount(emailAccounts[0].id)
        refetch()
      } catch (error) {
        console.error('Failed to sync emails:', error)
      }
    }
  }

  const totalPages = emailsData ? Math.ceil(emailsData.total / emailsData.limit) : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Intelligence</h1>
        <p className="text-gray-500 mt-1">
          AI-powered analysis of your business emails
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold">{emailsData?.total || 0}</p>
            </div>
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Opportunities</p>
              <p className="text-2xl font-bold text-green-600">
                {emailsData?.emails.filter(e => e.ai_analysis?.is_contract_opportunity).length || 0}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {emailsData?.emails.filter(e => e.ai_analysis?.priority === 'high').length || 0}
              </p>
            </div>
            <Badge variant="destructive">Urgent</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Connected Accounts</p>
              <p className="text-2xl font-bold">{emailAccounts?.length || 0}</p>
            </div>
            {emailAccounts && emailAccounts.length > 0 ? (
              <Badge className="bg-blue-100 text-blue-800">Gmail</Badge>
            ) : (
              <Button size="sm" variant="outline">
                Connect
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <EmailFilters
            onSearchChange={(search) => {
              setFilters(prev => ({ ...prev, search }))
              setCurrentPage(1)
            }}
            onCategoryChange={(category) => {
              setFilters(prev => ({ ...prev, category }))
              setCurrentPage(1)
            }}
            onPriorityChange={(priority) => {
              setFilters(prev => ({ ...prev, priority }))
              setCurrentPage(1)
            }}
            onDateRangeChange={(dateRange) => {
              setFilters(prev => ({ ...prev, dateRange }))
              setCurrentPage(1)
            }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {emailAccounts && emailAccounts.length > 0 && (
            <Button onClick={handleSyncEmails}>
              <Plus className="h-4 w-4 mr-2" />
              Sync Emails
            </Button>
          )}
        </div>
      </div>

      {/* Email List */}
      <EmailList
        emails={emailsData?.emails || []}
        isLoading={isLoading}
        onEmailClick={handleEmailClick}
      />

      {/* Pagination */}
      {emailsData && emailsData.total > emailsData.limit && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Email Detail Sheet */}
      <EmailDetail
        email={selectedEmail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}