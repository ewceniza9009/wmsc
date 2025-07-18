"use client";

import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface MaterialCategoryComboboxProps {
  value?: string;
  onValueChange?: (value: string, item: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function MaterialCategoryCombobox({
  value,
  onValueChange,
  placeholder = "Search a material catergory",
  disabled = false,
  className,
}: MaterialCategoryComboboxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the account details for the provided value
  useEffect(() => {
    if (value) {
      fetch(`/api/material-categories-lookup/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch material category");
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
                <span className="font-medium">{data.description}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.code})
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

  const fetchMaterialCategories = useCallback(
    async (searchTerm: string, page: number) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/material-categories-lookup?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch material categories");
        }
        const data = await response.json();
        return data.materialCategories.map((materialCategory: any) => ({
          value: materialCategory.id,
          item: materialCategory,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{materialCategory.description}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({materialCategory.code})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching material categories:", error);
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
      searchPlaceholder="Search material categories..."
      emptyMessage="No material categories found."
      disabled={disabled}
      className={className}
      fetchItems={fetchMaterialCategories}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}
