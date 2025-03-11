"use client";

import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface LocationComboboxProps {
  value?: string;
  onValueChange?: (value: string, item: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function LocationCombobox({
  value,
  onValueChange,
  placeholder = "Search a location",
  disabled = false,
  className,
}: LocationComboboxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the account details for the provided value
  useEffect(() => {
    if (value) {
      fetch(`/api/locations-lookup/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch material category");
          }
          return res.json();
        })
        .then((data) => {
          // Map the fetched data into the same format as your items
          console.log(data);
          const item = {
            value: data.id,
            item: data,
            label: (
              <div className="flex items-center">
                <span className="font-medium">{data.locationName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.locationNumber})
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

  const fetchLocations = useCallback(
    async (searchTerm: string, page: number) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: searchTerm,
        });
        const response = await fetch(`/api/locations-lookup?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        return data.materialCategories.map((location: any) => ({
          value: location.id,
          item: location,
          label: (
            <div className="flex items-center">
              <span className="font-medium">{location.locationName}</span>
              <span className="ml-1 text-muted-foreground text-sm font-normal">
                ({location.locationNumber})
              </span>
            </div>
          ),
        }));
      } catch (error) {
        console.error("Error fetching locations:", error);
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
      searchPlaceholder="Search locations..."
      emptyMessage="No locations found."
      disabled={disabled}
      className={className}
      fetchItems={fetchLocations}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}
