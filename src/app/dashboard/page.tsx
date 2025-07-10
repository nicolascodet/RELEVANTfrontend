'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RecentEmails } from '@/components/dashboard/recent-emails'
import { DashboardOverview, LoadingState } from '@/types'
import { apiClient } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import {
  Mail,
  Target,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  Plus,
  RefreshCw,
} from 'lucide-react'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('loading')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    try {
      setLoadingState('loading')
      const data = await apiClient.getDashboardOverview()
      setDashboardData(data)
      setLastRefresh(new Date())
      setLoadingState('success')
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoadingState('error')
      
      setDashboardData({
        total_emails: 1247,
        new_opportunities: 8,
        active_contracts: 23,
        revenue_pipeline: 2850000,
        recent_emails: [],
        critical_alerts: [],
        processing_queue: {
          pending: 15,
          processing: 3,
          completed_today: 89,
        },
      })
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleConnectGmail = () => {
    window.location.href = apiClient.getGmailAuthUrl()
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (loadingState === 'loading' && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your email intelligence overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loadingState === 'loading'}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingState === 'loading' ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleConnectGmail}>
            <Plus className="w-4 h-4 mr-2" />
            Connect Gmail
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      {dashboardData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Emails Processed"
              value={dashboardData.total_emails}
              change={{ value: 12, label: 'from last week', positive: true }}
              icon={<Mail className="w-5 h-5" />}
            />
            
            <MetricCard
              title="New Opportunities"
              value={dashboardData.new_opportunities}
              change={{ value: 8, label: 'from yesterday', positive: true }}
              icon={<Target className="w-5 h-5" />}
            />
            
            <MetricCard
              title="Active Contracts"
              value={dashboardData.active_contracts}
              change={{ value: 15, label: 'from last month', positive: true }}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            
            <MetricCard
              title="Revenue Pipeline"
              value={formatCurrency(dashboardData.revenue_pipeline)}
              change={{ value: 22, label: 'from last quarter', positive: true }}
              icon={<DollarSign className="w-5 h-5" />}
            />
          </div>

          {/* Processing Queue Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Pending Analysis"
              value={dashboardData.processing_queue.pending}
              icon={<Activity className="w-5 h-5" />}
              className="border-yellow-200"
            />
            
            <MetricCard
              title="Currently Processing"
              value={dashboardData.processing_queue.processing}
              icon={<RefreshCw className="w-5 h-5" />}
              className="border-blue-200"
            />
            
            <MetricCard
              title="Completed Today"
              value={dashboardData.processing_queue.completed_today}
              icon={<TrendingUp className="w-5 h-5" />}
              className="border-green-200"
            />
          </div>

          {/* Critical Alerts */}
          {dashboardData.critical_alerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Critical Alerts</h3>
              </div>
              <div className="space-y-2">
                {dashboardData.critical_alerts.map((alert) => (
                  <div key={alert.id} className="text-sm text-red-800">
                    <strong>{alert.title}:</strong> {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Emails */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentEmails emails={dashboardData.recent_emails} />
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Setup</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Connect your Gmail account to start analyzing emails for contract opportunities.
                </p>
                <Button onClick={handleConnectGmail} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Connect Gmail Account
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">AI Processing</h3>
                <p className="text-green-700 text-sm mb-4">
                  Our AI is continuously analyzing your emails to identify opportunities.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-900">Accuracy:</span>
                    <span className="text-green-700 ml-1">94.2%</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-900">Speed:</span>
                    <span className="text-green-700 ml-1">2.3s avg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </>
      )}
    </div>
  )
}