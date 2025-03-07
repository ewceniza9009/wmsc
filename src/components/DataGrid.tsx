'use client';

import React, { JSX, useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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

export interface DataGridProps<T> {
  data: T[];
  columns: { header: string }[];
  searchFields: (keyof T)[];
  renderRow: (item: T) => JSX.Element;
  /** Optional custom renderer for mobile view */
  mobileRenderRow?: (item: T) => JSX.Element;
  itemsPerPageOptions?: number[];
  viewportHeight?: string; // e.g., '400px'
}

export default function DataGrid<T>({
  data,
  columns,
  searchFields,
  renderRow,
  mobileRenderRow,
  itemsPerPageOptions = [5, 10, 25, 50],
  viewportHeight,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]);
  const [isMobile, setIsMobile] = useState(false);

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

  // Filter data based on search term across specified fields
  const filteredData = data.filter((item) =>
    searchFields.some((field) =>
      ('' + item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 w-full"
          />
        </div>
        <div className="w-40">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
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
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, i) => {
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
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of{' '}
            {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
