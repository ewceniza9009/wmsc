"use client"

import { useEffect, useState } from "react"
import { SearchableCombobox, SearchableComboboxItem } from "@/components/ui/searchable-combobox"

interface AccountComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function AccountCombobox({
  value,
  onValueChange,
  placeholder = "Select an account",
  disabled = false,
  className,
}: AccountComboboxProps) {
  const [isLoading, setIsLoading] = useState(false)

  const fetchAccounts = async (searchTerm: string, page: number) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm
      })
      
      const response = await fetch(`/api/accounts?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }
      
      const data = await response.json()
      
      return data.accounts.map((account: any) => ({
        value: account.id,
        label: (
          <div className="flex items-center">
            <span className="font-medium">{account.accountName}</span>
            <span className="ml-1 text-muted-foreground text-sm font-normal">({account.accountNumber})</span>
          </div>
        ),
      }))
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SearchableCombobox
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found."
      disabled={disabled}
      className={className}
      fetchItems={fetchAccounts}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  )
}

