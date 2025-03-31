"use client";

import {
    SearchableCombobox,
    SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface WarehouseComboBoxProps {
  value?: string; // The ID of the selected warehouse
  onValueChange?: (value: string, item: any) => void; // Callback when value changes
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  // Note: defaultItem logic might need adjustment if /api/warehouses/[id] doesn't exist yet
}

// Define the expected structure of a warehouse item from the lookup API
interface WarehouseLookupItem {
  id: string;
  warehouseCode: string;
  warehouseName: string;
}

export function WarehouseComboBox({
  value,
  onValueChange,
  placeholder = "Search a warehouse",
  disabled = false,
  className,
}: WarehouseComboBoxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(null);

  // Pre-fetch the warehouse details for the provided initial value
  // IMPORTANT: This assumes an endpoint like /api/warehouses/[id] exists.
  // If it doesn't, this useEffect might need to be removed or adapted.
  useEffect(() => {
    if (value) {
      // Assuming an endpoint exists to fetch a single warehouse by ID
      fetch(`/api/warehouses/${value}`) // Adjust if your single warehouse endpoint is different
        .then((res) => {
          if (!res.ok) {
            // Don't throw error, just log, as the lookup might find it later
            console.error("Failed to pre-fetch warehouse details for ID:", value);
            return null; // Indicate failure
          }
          return res.json();
        })
        .then((data: WarehouseLookupItem | null) => {
          if (data) {
            // Map the fetched data into the SearchableComboboxItem format
            const item = {
              value: data.id,
              item: data, // Store the full warehouse object if needed by onValueChange
              label: (
                <div className="flex items-center">
                  <span className="font-medium">{data.warehouseName}</span>
                  <span className="ml-1 text-muted-foreground text-sm font-normal">
                    ({data.warehouseCode})
                  </span>
                </div>
              ),
            };
            setDefaultItem(item);
          } else {
             setDefaultItem(null); // Reset if fetch failed
          }
        })
        .catch((error) => {
            console.error("Error pre-fetching warehouse:", error);
            setDefaultItem(null);
        });
    } else {
        setDefaultItem(null); // Clear default item if value is cleared
    }
  }, [value]);

  // Function to fetch warehouses based on search term and page
  const fetchWarehouses = useCallback(async (searchTerm: string, page: number): Promise<SearchableComboboxItem[]> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10", // Adjust limit as needed
        search: searchTerm,
        sortBy: "warehouseName", // Default sort
        sortOrder: "asc",
      });
      const response = await fetch(`/api/warehouse-lookup?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch warehouses");
      }
      const data = await response.json();

      // Map the API response to the format expected by SearchableCombobox
      return data.items.map((warehouse: WarehouseLookupItem) => ({
        value: warehouse.id,
        item: warehouse, // Store the full warehouse object
        label: (
          <div className="flex items-center">
            <span className="font-medium">{warehouse.warehouseName}</span>
            <span className="ml-1 text-muted-foreground text-sm font-normal">
              ({warehouse.warehouseCode})
            </span>
          </div>
        ),
      }));
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return []; // Return empty array on error
    }
  }, []);

  return (
    <SearchableCombobox
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search warehouses..." // Updated placeholder
      emptyMessage="No warehouses found." // Updated message
      disabled={disabled}
      className={className}
      fetchItems={fetchWarehouses} // Use the warehouse fetch function
      defaultItem={defaultItem}
      itemsPerPage={10} // Match the limit in fetchWarehouses
      // Determine hasMoreItems based on pagination info if available from API
      // For simplicity, assuming there might always be more for now
      hasMoreItems={true}
    />
  );
}