'use client'

import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications] = useState(3)

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search emails, opportunities..."
              className="pl-10 bg-gray-50 border-0 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side - Notifications and user */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">JD</span>
            </div>
            <div className="hidden sm:block text-sm">
              <div className="font-medium text-gray-900">John Doe</div>
              <div className="text-gray-500">john@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}