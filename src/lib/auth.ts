import { User } from '@/types'
import { apiClient } from './api'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthManager {
  private listeners: ((state: AuthState) => void)[] = []
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  }

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      const token = this.getToken()
      if (token) {
        const user = await apiClient.getCurrentUser()
        this.setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      this.logout()
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getState(): AuthState {
    return this.state
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  async login(email: string, password: string): Promise<void> {
    this.setState({ isLoading: true })
    
    try {
      const authResponse = await apiClient.login({ email, password })
      this.setState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      throw error
    }
  }

  async register(email: string, password: string, name?: string): Promise<void> {
    this.setState({ isLoading: true })
    
    try {
      const authResponse = await apiClient.register({ email, password, name })
      this.setState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      throw error
    }
  }

  async googleLogin(accessToken: string): Promise<void> {
    this.setState({ isLoading: true })
    
    try {
      const authResponse = await apiClient.googleLogin(accessToken)
      this.setState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      throw error
    }
  }

  async logout(): Promise<void> {
    await apiClient.logout()
    this.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  requireAuth(): boolean {
    return this.state.isAuthenticated
  }
}

export const authManager = new AuthManager()

export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
    }
  }
  
  return authManager.getState()
}