export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface EmailAccount {
  id: string
  email: string
  provider: 'gmail' | 'outlook' | 'other'
  status: 'active' | 'inactive' | 'error'
  connected_at: string
  last_sync: string
  message_count: number
}

export interface EmailMessage {
  id: string
  subject: string
  sender: string
  recipient: string
  date: string
  body_preview: string
  full_body?: string
  thread_id?: string
  labels: string[]
  ai_analysis?: {
    classification: 'opportunity' | 'contract' | 'proposal' | 'inquiry' | 'other'
    confidence: number
    entities: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    priority: 'high' | 'medium' | 'low'
    summary: string
  }
}

export interface ContractOpportunity {
  id: string
  title: string
  description: string
  source_email_id: string
  status: 'new' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost'
  estimated_value: number
  probability: number
  deadline?: string
  created_at: string
  updated_at: string
  tags: string[]
  contact_info: {
    name?: string
    email: string
    company?: string
    phone?: string
  }
}

export interface DashboardOverview {
  total_emails: number
  new_opportunities: number
  active_contracts: number
  revenue_pipeline: number
  recent_emails: EmailMessage[]
  critical_alerts: Alert[]
  processing_queue: {
    pending: number
    processing: number
    completed_today: number
  }
}

export interface Alert {
  id: string
  type: 'deadline' | 'high_value' | 'urgent' | 'error'
  title: string
  message: string
  created_at: string
  read: boolean
  action_url?: string
}

export interface EmailAnalytics {
  date_range: {
    start: string
    end: string
  }
  metrics: {
    total_processed: number
    opportunities_found: number
    average_confidence: number
    response_time: number
    classification_breakdown: Record<string, number>
  }
  trends: {
    date: string
    emails: number
    opportunities: number
    value: number
  }[]
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  success: boolean
}

export interface SearchFilters {
  query?: string
  date_from?: string
  date_to?: string
  classification?: string[]
  sender?: string
  priority?: string[]
  status?: string[]
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'