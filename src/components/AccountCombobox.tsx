"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";

interface AccountComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function AccountCombobox({
  value,
  onValueChange,
  placeholder = "Select an account",
  disabled = false,
  className,
}: AccountComboboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the account details for the provided value
  useEffect(() => {
    if (value) {
      setIsLoading(true);
      fetch(`/api/accounts/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch account");
          }
          return res.json();
        })
        .then((data) => {
          // Map the fetched data into the same format as your items
          const item = {
            value: data.id,
            label: (
              <div className="flex items-center">
                <span className="font-medium">{data.accountName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.accountNumber})
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

  const fetchAccounts = useCallback(
    async (searchTerm: string, page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/accounts?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        return data.accounts.map((account: any) => ({
          value: account.id,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{account.accountName}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({account.accountNumber})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching accounts:", error);
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
      searchPlaceholder="Search accounts..."
      emptyMessage="No accounts found."
      disabled={disabled}
      className={className}
      fetchItems={fetchAccounts}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}
