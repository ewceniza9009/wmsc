'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import React, { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Helper type for elements that support className
type WithClassName = {
  className?: string;
};

// Extend with children using React.PropsWithChildren
type WithClassNameProps = React.PropsWithChildren<WithClassName>;

/**
 * Transforms a table row into a mobile-friendly card.
 * It updates the row and its children to use block layout on mobile.
 */
function transformRowToMobile(
  row: React.ReactElement<WithClassNameProps>,
  columns: { header: string }[]
): React.ReactElement<WithClassNameProps> {
  if (!React.isValidElement(row)) return row;

  const transformedChildren = React.Children.map(row.props.children, (child, index) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as WithClassName;
      const newClassName =
        (childProps.className ? childProps.className + ' ' : '') + 'block sm:table-cell';
      return React.cloneElement(child, {
        className: newClassName,
        'data-label': columns[index]?.header || '',
      } as Partial<WithClassName>);
    }
    return child;
  });

  const rowProps = row.props as WithClassName;
  const newRowClassName =
    (rowProps.className ? rowProps.className + ' ' : '') + 'block sm:table-row';
  return React.cloneElement(row, { className: newRowClassName } as Partial<WithClassName>, transformedChildren);
}

export interface ServerDataGridProps<T> {
  data: T[];
  columns: { header: string }[];
  searchFields: string[];
  renderRow: (item: T) => JSX.Element;
  /** Optional custom renderer for mobile view */
  mobileRenderRow?: (item: T) => JSX.Element;
  itemsPerPageOptions?: number[];
  viewportHeight?: string; // e.g., '400px'
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
}

export default function ServerDataGrid<T>(
  {
    data,
    columns,
    renderRow,
    mobileRenderRow,
    itemsPerPageOptions = [5, 10, 25, 50],
    viewportHeight,
    totalItems,
    currentPage,
    itemsPerPage,
    isLoading,
    onPageChange,
    onItemsPerPageChange,
    onSearchChange,
    searchTerm,
  }: ServerDataGridProps<T>
) {
  const [isMobile, setIsMobile] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [wasFocused, setWasFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update isMobile state on window resize (using Tailwind's sm breakpoint, 640px)
  useEffect(() => {
    // Only access window on the client side
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Set initial value only on client side
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync local search term with prop when it changes externally
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Track focus state before data refresh
  useEffect(() => {
    const handleFocusIn = () => {
      if (document.activeElement === searchInputRef.current) {
        setWasFocused(true);
      }
    };

    const handleFocusOut = () => {
      setWasFocused(false);
    };

    // Store the current ref value in a variable
    const currentSearchInputRef = searchInputRef.current;

    // Add event listeners to track focus
    currentSearchInputRef?.addEventListener('focusin', handleFocusIn);
    currentSearchInputRef?.addEventListener('focusout', handleFocusOut);

    return () => {
      currentSearchInputRef?.removeEventListener('focusin', handleFocusIn);
      currentSearchInputRef?.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Preserve input focus after data refresh using useLayoutEffect
  useLayoutEffect(() => {
    if (wasFocused && searchInputRef.current) {
      searchInputRef.current.focus();
      
      // Restore cursor position to end of input
      const length = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(length, length);
    }
  }, [data, isLoading, wasFocused]);

  // Handle search input change - only update local state
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // No longer triggering search on every keystroke
  };

  // Handle key press to trigger search only on Tab or Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault(); // Prevent default behavior
      onSearchChange(localSearchTerm); // Trigger search
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    // Store ref value in a variable inside the effect
    const timerRef = debounceTimerRef.current;
    return () => {
      if (timerRef) {
        clearTimeout(timerRef);
      }
    };
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      {/* Inline CSS for mobile card labels */}
      <style jsx>{`
        @media (max-width: 640px) {
          td[data-label]:before {
            content: attr(data-label);
            font-weight: bold;
            display: block;
          }
        }
      `}</style>

      {/* Search and Items Per Page Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="pl-8 w-full"
              onKeyDown={handleSearchKeyDown}
              type="search"
            />
          </form>
        </div>
        <div className="w-40">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
            }}
            className="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table Container with optional viewport height */}
      <div
        className="overflow-x-auto"
        style={{ height: viewportHeight, overflowY: viewportHeight ? 'auto' : 'visible' }}
      >
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="hidden sm:table-row">
              {columns.map((col) => (
                <TableHead key={col.header}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => {
                let rowElement;
                if (isMobile && mobileRenderRow) {
                  rowElement = mobileRenderRow(item);
                } else if (isMobile) {
                  const originalRow = renderRow(item);
                  rowElement = transformRowToMobile(originalRow, columns);
                } else {
                  rowElement = renderRow(item);
                }
                return <React.Fragment key={i}>{rowElement}</React.Fragment>;
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Show limited page buttons with ellipsis for large page counts */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If near the start
                pageNum = i + 1;
                if (i === 4) pageNum = totalPages; // Last button shows last page
              } else if (currentPage >= totalPages - 2) {
                // If near the end
                pageNum = totalPages - 4 + i;
                if (i === 0) pageNum = 1; // First button shows first page
              } else {
                // If in the middle
                pageNum = currentPage - 2 + i;
                if (i === 0) pageNum = 1; // First button shows first page
                if (i === 4) pageNum = totalPages; // Last button shows last page
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}