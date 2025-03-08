"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";

interface TermIdComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function TermIdCombobox({
  value,
  onValueChange,
  placeholder = "Select a term",
  disabled = false,
  className,
}: TermIdComboboxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the term details for the provided value
  useEffect(() => {
    if (value) {
      setIsLoading(true);
      fetch(`/api/terms/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch term");
          }
          return res.json();
        })
        .then((data) => {
          // Map the fetched data into the same format as your items
          const item = {
            value: data.id,
            label: (
              <div className="flex items-center">
                <span className="font-medium">{data.termName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.termCode})
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

  const fetchTerms = useCallback(
    async (searchTerm: string, page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/terms?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch terms");
        }
        const data = await response.json();
        return data.terms.map((term: any) => ({
          value: term.id,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{term.termName}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({term.termCode})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching terms:", error);
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
      searchPlaceholder="Search terms..."
      emptyMessage="No terms found."
      disabled={disabled}
      className={className}
      fetchItems={fetchTerms}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}