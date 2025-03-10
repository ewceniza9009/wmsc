"use client";

import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface MaterialComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function MaterialCombobox({
  value,
  onValueChange,
  placeholder = "Select material",
  disabled = false,
  className,
}: MaterialComboboxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the material details for the provided value
  useEffect(() => {
    if (value) {
      fetch(`/api/materials-lookup/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch material");
          }
          return res.json();
        })
        .then((data) => {
          // Map the fetched data into the same format as your items
          const item = {
            value: data.id,
            label: (
              <div className="flex items-center">
                <span className="font-medium">{data.materialName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.materialNumber})
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

  const fetchMaterials = useCallback(
    async (searchTerm: string, page: number) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/materials-lookup?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        return data.materials.map((material: any) => ({
          value: material.id,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{material.materialName}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({material.materialNumber})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching materials:", error);
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
      searchPlaceholder="Search materials..."
      emptyMessage="No materials found."
      disabled={disabled}
      className={className}
      fetchItems={fetchMaterials}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}
