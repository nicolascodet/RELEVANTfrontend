import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  EmailAccount,
  EmailMessage,
  ContractOpportunity,
  DashboardOverview,
  EmailAnalytics,
  Alert,
  SearchFilters
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://relevant-backend-424828966180.us-central1.run.app'

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders }
    const token = this.getAuthToken()
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/api/v1/auth/me')
    return response.data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token')
  }

  // Gmail OAuth
  getGmailAuthUrl(): string {
    return `${this.baseURL}/api/oauth/gmail/authorize`
  }

  async handleGmailCallback(code: string, state?: string): Promise<EmailAccount> {
    const response = await this.request<ApiResponse<EmailAccount>>('/api/oauth/gmail/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    })
    return response.data
  }

  // Email Accounts
  async getEmailAccounts(): Promise<EmailAccount[]> {
    const response = await this.request<ApiResponse<EmailAccount[]>>('/api/v1/email/accounts')
    return response.data
  }

  async addEmailAccount(data: { email: string; provider: string }): Promise<EmailAccount> {
    const response = await this.request<ApiResponse<EmailAccount>>('/api/v1/email/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  }

  // Email Messages
  async getEmailMessages(
    page = 1, 
    perPage = 20, 
    filters?: SearchFilters
  ): Promise<PaginatedResponse<EmailMessage>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    return await this.request<PaginatedResponse<EmailMessage>>(
      `/api/v1/email/messages?${params.toString()}`
    )
  }

  async getEmailMessage(id: string): Promise<EmailMessage> {
    const response = await this.request<ApiResponse<EmailMessage>>(`/api/v1/email/messages/${id}`)
    return response.data
  }

  // Contract Opportunities
  async getOpportunities(
    page = 1, 
    perPage = 20, 
    filters?: SearchFilters
  ): Promise<PaginatedResponse<ContractOpportunity>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    return await this.request<PaginatedResponse<ContractOpportunity>>(
      `/api/v1/email/opportunities?${params.toString()}`
    )
  }

  async updateOpportunity(
    id: string, 
    data: Partial<ContractOpportunity>
  ): Promise<ContractOpportunity> {
    const response = await this.request<ApiResponse<ContractOpportunity>>(
      `/api/v1/email/opportunities/${id}`, 
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return response.data
  }

  // Dashboard
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await this.request<ApiResponse<DashboardOverview>>('/api/v1/dashboard/overview')
    return response.data
  }

  async getCriticalAlerts(): Promise<Alert[]> {
    const response = await this.request<ApiResponse<Alert[]>>('/api/v1/dashboard/alerts/critical')
    return response.data
  }

  // Analytics
  async getEmailAnalytics(
    dateFrom?: string, 
    dateTo?: string
  ): Promise<EmailAnalytics> {
    const params = new URLSearchParams()
    if (dateFrom) params.append('date_from', dateFrom)
    if (dateTo) params.append('date_to', dateTo)

    const response = await this.request<ApiResponse<EmailAnalytics>>(
      `/api/v1/email/analytics?${params.toString()}`
    )
    return response.data
  }

  async getRevenueAnalytics(
    dateFrom?: string, 
    dateTo?: string
  ): Promise<any> {
    const params = new URLSearchParams()
    if (dateFrom) params.append('date_from', dateFrom)
    if (dateTo) params.append('date_to', dateTo)

    const response = await this.request<ApiResponse<any>>(
      `/api/v1/dashboard/revenue-analytics?${params.toString()}`
    )
    return response.data
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient