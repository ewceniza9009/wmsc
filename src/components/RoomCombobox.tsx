"use client";

import {
  SearchableCombobox,
  SearchableComboboxItem,
} from "@/components/ui/searchable-combobox";
import { useCallback, useEffect, useState } from "react";

interface RoomComboboxProps {
  value?: string;
  onValueChange?: (value: string, item: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultItem?: SearchableComboboxItem | null;
}

export function RoomCombobox({
  value,
  onValueChange,
  placeholder = "Search a room",
  disabled = false,
  className,
}: RoomComboboxProps) {
  const [defaultItem, setDefaultItem] = useState<SearchableComboboxItem | null>(
    null
  );

  // Pre-fetch the room details for the provided value
  useEffect(() => {
    if (value) {
      fetch(`/api/rooms/${value}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch room");
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
                <span className="font-medium">{data.roomName}</span>
                <span className="ml-1 text-muted-foreground text-sm font-normal">
                  ({data.roomNumber})
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

  const fetchRooms = useCallback(async (searchTerm: string, page: number) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchTerm,
      });
      const response = await fetch(`/api/rooms-lookup?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      return data.rooms.map((room: any) => ({
        value: room.id,
        item: room,
        label: (
          <div className="flex items-center">
            <span className="font-medium">{room.roomName}</span>
            <span className="ml-1 text-muted-foreground text-sm font-normal">
              ({room.roomNumber})
            </span>
          </div>
        ),
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    } finally {
    }
  }, []);

  return (
    <SearchableCombobox
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search rooms..."
      emptyMessage="No rooms found."
      disabled={disabled}
      className={className}
      fetchItems={fetchRooms}
      defaultItem={defaultItem}
      itemsPerPage={10}
      hasMoreItems={true}
    />
  );
}
