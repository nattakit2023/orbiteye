"use client";

import * as React from "react";
import { cn } from "./utils"; // Make sure this path is correct
import { Check, X, ChevronDownIcon } from "lucide-react"; // Import ChevronDownIcon

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export type OptionType = {
	label: string;
	value: string;
};

interface MultiSelectProps {
	options: OptionType[];
	selected: string[];
	onChange: (selected: string[]) => void;
	className?: string;
	placeholder?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
	(
		{
			options,
			selected,
			onChange,
			className,
			placeholder = "Select...",
			...props
		},
		ref,
	) => {
		const [open, setOpen] = React.useState(false);

		const handleSelect = (value: string) => {
			onChange([...selected, value]);
		};

		const handleDeselect = (value: string) => {
			onChange(selected.filter((s) => s !== value));
		};

		const selectedLabels = options
			.filter((option) => selected.includes(option.value))
			.map((option) => option.label);

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						// --- MODIFIED: Changed variant to default for a more input-like look ---
						variant="default" // Using 'default' or adjust styling directly
						role="combobox"
						aria-expanded={open}
						className={cn(
							// --- MODIFIED: Added specific styling to match your SelectTrigger ---
							"border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", // Added your SelectTrigger styles
							"justify-between text-left", // Keep text left-aligned and justify content
							!selected.length && "text-muted-foreground", // Placeholder color
							className,
						)}
						onClick={() => setOpen(!open)}
						{...props} // Pass through other props like size
					>
						<div className="flex flex-wrap items-center gap-1">
							{selected.length === 0 ? (
								placeholder
							) : (
								<>
									{selectedLabels.slice(0, 3).map((label) => (
										<Badge
											key={label}
											variant="secondary"
											className="mr-1 cursor-pointer" // Keep it clickable to remove
											onClick={(e) => {
												e.stopPropagation(); // Prevent opening popover
												const optionToDeselect = options.find(
													(o) => o.label === label,
												);
												if (optionToDeselect) {
													handleDeselect(optionToDeselect.value);
												}
											}}
										>
											{label}
											{/* --- MODIFIED: Removed X icon for aesthetic match --- */}
											{/* <X className="ml-1 h-3 w-3" /> */}
										</Badge>
									))}
									{selectedLabels.length > 3 && (
										<span className="text-xs text-muted-foreground">
											+{selectedLabels.length - 3} more
										</span>
									)}
								</>
							)}
						</div>
						{/* --- MODIFIED: Changed icon to ChevronDownIcon --- */}
						<ChevronDownIcon className="size-4 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput placeholder="Search..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => {
									const isSelected = selected.includes(option.value);
									return (
										<CommandItem
											key={option.value}
											onSelect={() => {
												if (isSelected) {
													handleDeselect(option.value);
												} else {
													handleSelect(option.value);
												}
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													isSelected ? "opacity-100" : "opacity-0",
												)}
											/>
											{option.label}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	},
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
