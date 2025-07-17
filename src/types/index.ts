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
  message_id?: string
  subject: string
  sender: string
  from?: string
  recipient: string
  to?: string[]
  cc?: string[]
  received_at: string
  date?: string
  body_text?: string
  body?: string
  body_html?: string
  html_body?: string
  thread_id?: string
  is_starred: boolean
  is_read?: boolean
  has_attachments: boolean
  attachments?: {
    filename: string
    mime_type: string
    size: number
  }[]
  labels?: string[]
  snippet?: string
  ai_analysis?: {
    category: string
    priority: 'high' | 'medium' | 'low'
    confidence: number
    summary?: string
    key_entities?: string[]
    action_items?: string[]
    is_contract_opportunity?: boolean
    estimated_value?: number
    deadline?: string
  }
}

export interface ContractOpportunity {
  id: string
  title: string
  description?: string
  notes?: string
  company?: string
  contact_name?: string
  contact_email?: string
  source_email_id?: string
  status: 'new' | 'in_progress' | 'submitted' | 'won' | 'lost'
  priority?: 'critical' | 'high' | 'medium' | 'low'
  estimated_value?: number
  deadline?: string
  requirements?: string[]
  ai_confidence?: number
  ai_generated?: boolean
  created_at: string
  updated_at: string
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
  emails: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface SearchFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  priority?: string
  date_from?: string
  date_to?: string
  query?: string
  classification?: string[]
  sender?: string
  status?: string[]
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'