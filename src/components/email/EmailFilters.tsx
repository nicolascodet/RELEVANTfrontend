'use client'

import { Search, Filter, Calendar, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface EmailFiltersProps {
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onPriorityChange: (priority: string) => void
  onDateRangeChange: (range: string) => void
}

export function EmailFilters({
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
  onDateRangeChange,
}: EmailFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search emails..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <Tag className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="opportunity">Opportunity</SelectItem>
          <SelectItem value="follow-up">Follow-up</SelectItem>
          <SelectItem value="inquiry">Inquiry</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Filter */}
      <Select onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[160px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last 30 Days</SelectItem>
          <SelectItem value="quarter">Last 3 Months</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>
            Has Attachments
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Is Starred
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Contract Opportunities Only
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Unprocessed Only
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>
            High Confidence (80%+)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Medium Confidence (60-80%)
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Low Confidence (&lt;60%)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}