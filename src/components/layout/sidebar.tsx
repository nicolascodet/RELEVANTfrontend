'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Mail,
  Target,
  BarChart3,
  Settings,
  User,
  LogOut,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Email Intelligence',
    href: '/dashboard/emails',
    icon: Mail,
  },
  {
    name: 'Opportunities',
    href: '/dashboard/opportunities',
    icon: Target,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          {collapsed ? (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Email Intel
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0 w-5 h-5',
                    collapsed ? 'mx-auto' : 'mr-3'
                  )}
                />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-2">
          <div
            className={cn(
              'flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer transition-colors',
              collapsed ? 'justify-center' : 'space-x-3'
            )}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">Profile</span>
                <LogOut className="w-4 h-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}