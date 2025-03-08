"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Allow the label to be a React node (JSX element or string)
export interface SearchableComboboxItem {
  value: string
  label: React.ReactNode
}

interface SearchableComboboxProps {
  items?: SearchableComboboxItem[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  fetchItems?: (searchTerm: string, page: number) => Promise<SearchableComboboxItem[]>
  triggerClassName?: string
  hasMoreItems?: boolean
  defaultOpen?: boolean
  itemsPerPage?: number
  defaultItem?: SearchableComboboxItem | null
}

export function SearchableCombobox({
  items: initialItems,
  value,
  onValueChange,
  placeholder = "Select an item",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  disabled = false,
  className,
  fetchItems,
  triggerClassName,
  hasMoreItems: initialHasMoreItems = false,
  defaultOpen = false,
  itemsPerPage = 10,
  defaultItem = null,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [items, setItems] = useState<SearchableComboboxItem[]>(initialItems || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode>(defaultItem ? defaultItem.label : placeholder)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreItems, setHasMoreItems] = useState(initialHasMoreItems)

  // Update the selected label when the value changes
  useEffect(() => {
    if (value) {
      const selected = items.find(item => item.value === value)
      if (selected) {
        setSelectedLabel(selected.label)
      }
    } else {
      setSelectedLabel(placeholder)
    }
  }, [value, items, placeholder])

  // Update the selected label if defaultItem changes
  useEffect(() => {
    if (defaultItem) {
      setSelectedLabel(defaultItem.label)
    }
  }, [defaultItem])

  // Load items on initial render, when the search term changes, or when the page changes (if fetchItems is provided)
  useEffect(() => {
    const loadItems = async () => {
      if (fetchItems) {
        setIsLoading(true)
        try {
          const newItems = await fetchItems(searchTerm, page)
          setItems(prev => (page === 1 ? newItems : [...prev, ...newItems]))
          setHasMoreItems(newItems.length === itemsPerPage)
        } catch (error) {
          console.error("Failed to fetch items:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    if (open && fetchItems) {
      loadItems()
    }
  }, [open, searchTerm, page, fetchItems, itemsPerPage])

  // Reset pagination when search term changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMoreItems) {
      setPage(prevPage => prevPage + 1)
    }
  }, [isLoading, hasMoreItems])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="app"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            disabled && "cursor-not-allowed opacity-50",
            triggerClassName
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedLabel}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>{isLoading ? "Loading..." : emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue)
                    setSelectedLabel(item.label)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            
            {hasMoreItems && (
              <>
                <CommandSeparator />
                <div className="py-2 px-2 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}