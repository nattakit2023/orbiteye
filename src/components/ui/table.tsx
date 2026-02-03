"use client";

import React from "react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
} from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Basic table components
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

// Types for the enhanced table
type SortDirection = "asc" | "desc" | null;

interface ColumnFilter {
  key: string;
  value: string;
}

interface ColumnSort {
  key: string;
  direction: SortDirection;
}

interface ColumnDef<T = Record<string, unknown>> {
  key: keyof T;
  title: string | React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (row: T) => React.ReactNode;
  filterType?: "text" | "select" | "date";
  filterOptions?: { value: string; label: string }[];
}

interface EnhancedTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  onFilterChange?: (filters: ColumnFilter[]) => void;
  onSortChange?: (sort: ColumnSort | undefined) => void;
  emptyMessage?: string;
  initialFilters?: ColumnFilter[];
  initialSort?: ColumnSort | undefined;
  pagination?: {
    enabled?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
  };
}

// Enhanced table component with filtering and sorting
function EnhancedTable<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  onFilterChange,
  onSortChange,
  emptyMessage = "No data available",
  initialFilters = [],
  initialSort = undefined,
  pagination,
}: EnhancedTableProps<T>) {
  const [filters, setFilters] = React.useState<ColumnFilter[]>(initialFilters);
  const [sort, setSort] = React.useState<ColumnSort | undefined>(initialSort);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Default pagination settings
  const paginationEnabled = pagination?.enabled ?? false;
  const pageSize = pagination?.pageSize ?? 10;
  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 20, 50, 100];

  // Apply filters to data
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return filters.every((filter) => {
        const cellValue = String(row[filter.key] || "").toLowerCase();
        const filterValue = filter.value.toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  }, [data, filters]);

  // Apply sorting to filtered data
  const sortedData = React.useMemo(() => {
    if (!sort || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sort]);

  // Apply pagination to sorted data
  const paginatedData = React.useMemo(() => {
    if (!paginationEnabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, paginationEnabled]);

  // Calculate total pages
  const totalPages = paginationEnabled
    ? Math.ceil(sortedData.length / pageSize)
    : 1;

  // Handle filter change
  const handleFilterChange = (columnKey: string, value: string) => {
    const newFilters = filters.filter((f) => f.key !== columnKey);

    if (value.trim() !== "") {
      newFilters.push({ key: columnKey, value });
    }

    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  // Handle sort change
  const handleSortChange = (columnKey: string) => {
    let newDirection: SortDirection = "asc";

    if (sort && sort.key === columnKey && sort.direction === "asc") {
      newDirection = "desc";
    } else if (sort && sort.key === columnKey && sort.direction === "desc") {
      newDirection = null;
    }

    const newSort = newDirection
      ? { key: columnKey, direction: newDirection }
      : undefined;
    setSort(newSort);
    if (onSortChange) onSortChange(newSort);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters([]);
    if (onFilterChange) onFilterChange([]);
  };

  // Get active filter count
  const activeFilterCount = filters.length;

  // Reset to page 1 when filters or sorting changes
  React.useEffect(() => {
    if (paginationEnabled) {
      setCurrentPage(1);
    }
  }, [filters, sort, paginationEnabled]);

  return (
    <div className={cn("w-full", className)}>
      {/* Filters indicator */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              active
            </span>
            {filters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="gap-1">
                {columns.find((c) => c.key === filter.key)?.title}:{" "}
                {filter.value}
                <XIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(filter.key, "")}
                />
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>
                <div className="flex items-center justify-between gap-2">
                  {typeof column.title === 'string' ? (
                    <span>{column.title}</span>
                  ) : (
                    <div>{column.title}</div>
                  )}
                  <div className="flex items-center gap-1">
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleSortChange(String(column.key))}
                      >
                        {sort?.key === String(column.key) &&
                          sort.direction === "asc" && (
                            <ChevronUpIcon className="h-4 w-4" />
                          )}
                        {sort?.key === String(column.key) &&
                          sort.direction === "desc" && (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        {(!sort || sort.key !== String(column.key)) && (
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    )}
                    {column.filterable && (
                      <FilterPopover
                        column={column}
                        filter={filters.find(
                          (f) => f.key === String(column.key),
                        )}
                        onFilterChange={(value) =>
                          handleFilterChange(String(column.key), value)
                        }
                      />
                    )}
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.cell
                      ? column.cell(row)
                      : String(row[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {paginationEnabled && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" style={{ width: "20rem" }}>
              <span className="text-sm text-muted-foreground">
                Items per page
              </span>
              <select
                value={pageSize}
                onChange={(_) => {
                  setCurrentPage(1);
                  // This would typically trigger a callback to update the page size
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50",
                      "cursor-pointer",
                    )}
                  />
                </PaginationItem>

                {/* Page numbers with ellipsis */}
                {(() => {
                  const pageNumbers = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages) {
                    for (let i = 1; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    if (currentPage <= 3) {
                      for (let i = 1; i <= 3; i++) {
                        pageNumbers.push(i);
                      }
                      pageNumbers.push("ellipsis");
                      pageNumbers.push(totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pageNumbers.push(1);
                      pageNumbers.push("ellipsis");
                      for (let i = totalPages - 2; i <= totalPages; i++) {
                        pageNumbers.push(i);
                      }
                    } else {
                      pageNumbers.push(1);
                      pageNumbers.push("ellipsis");
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pageNumbers.push(i);
                      }
                      pageNumbers.push("ellipsis");
                      pageNumbers.push(totalPages);
                    }
                  }

                  return pageNumbers.map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page as number}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page as number)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  );
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className={cn(
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50",
                      "cursor-pointer",
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter popover component
function FilterPopover<T>({
  column,
  filter,
  onFilterChange,
}: {
  column: ColumnDef<T>;
  filter?: ColumnFilter;
  onFilterChange: (value: string) => void;
}) {
  const [value, setValue] = React.useState(filter?.value || "");

  React.useEffect(() => {
    setValue(filter?.value || "");
  }, [filter]);

  const handleApply = () => {
    onFilterChange(value);
  };

  const handleClear = () => {
    setValue("");
    onFilterChange("");
  };

  const renderFilterInput = () => {
    switch (column.filterType) {
      case "select":
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">All</option>
            {column.filterOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "date":
        const selectedDate = value ? new Date(value) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMMM") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setValue(date.toISOString());
                  } else {
                    setValue("");
                  }
                }}
                initialFocus
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return (
          <Input
            placeholder={`Filter`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply();
              }
            }}
          />
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7",
            filter && filter.value !== "" && "text-primary bg-primary/10",
          )}
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Filter</h4>
          {renderFilterInput()}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  EnhancedTable,
};
export type {
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  SortDirection,
  EnhancedTableProps,
};
