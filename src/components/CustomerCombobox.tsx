"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";

interface CustomerComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function CustomerCombobox({
  value,
  onValueChange,
  placeholder = "Select a customer",
  disabled = false,
  className,
}: CustomerComboboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the customer details for the provided value
  useEffect(() => {
    if (value) {
      setIsLoading(true);
      fetch(`/api/customers-lookup/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch customer");
          }
          return res.json();
        })
        .then((data) => {
          // Map the fetched data into the same format as your items
          const item = {
            value: data.id,
            label: (
              <div className="flex items-center">
                <span className="font-medium">{data.customerName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.customerNumber})
                </span>
              </div>
            ),
          };
          setDefaultItem(item);
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [value]);

  const fetchCustomers = useCallback(
    async (searchTerm: string, page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/customers-lookup?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        return data.customers.map((customer: any) => ({
          value: customer.id,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{customer.customerName}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({customer.customerNumber})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <SearchableCombobox
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      fetchItems={fetchCustomers}
      defaultItem={defaultItem}
      searchPlaceholder="Search customers..."
      emptyMessage="No customers found"
    />
  );
}