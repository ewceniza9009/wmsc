"use client";

import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface CustomerComboboxProps {
  value?: string;
  onValueChange?: (value: string, item: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function CustomerCombobox({
  value,
  onValueChange,
  placeholder = "Search a customer",
  disabled = false,
  className,
}: CustomerComboboxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the customer details for the provided value
  useEffect(() => {
    if (value) {
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
            item: data,
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
        .finally(() => {});
    }
  }, [value]);

  const fetchCustomers = useCallback(
    async (searchTerm: string, page: number) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(
          `/api/customers-lookup?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        return data.customers.map((customer: any) => ({
          value: customer.id,
          item: customer,
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
