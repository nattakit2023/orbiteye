"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "./utils";
import "@/styles/tabs.css";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="flex-shrink-0 p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex-1 overflow-x-auto scrollbar-hide"
        data-slot="tabs-list-container"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <TabsPrimitive.List
          data-slot="tabs-list"
          className={cn("inline-flex gap-0 w-full", className)}
          {...props}
        />
      </div>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="flex-shrink-0 p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

interface DataItem {
  id: string;
  label: string;
  value?: string;
}

interface TabsDataGridProps {
  data: DataItem[];
  columns?: number;
  className?: string;
}

function TabsDataGrid({ data, columns = 2, className }: TabsDataGridProps) {
  return (
    <div
      className={cn(
        `grid gap-4`,
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 1 && "grid-cols-1",
        className,
      )}
    >
      {data.map((item) => (
        <div
          key={item.id}
          className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors cursor-pointer"
        >
          <p className="text-sm font-medium text-foreground truncate">
            {item.label}
          </p>
          {item.value && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsDataGrid };
