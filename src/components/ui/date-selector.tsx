"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "./calendar";
interface DateSelectorProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
export default function DateSelector({
  date: initialDate,
  onSelect,
  placeholder = "Select date",
  className,
  disabled = false,
}: DateSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [inputValue, setInputValue] = useState<string>(
    initialDate ? format(initialDate, "MM/dd/yyyy") : ""
  );
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
      setInputValue(format(initialDate, "MM/dd/yyyy"));
    } else {
      setDate(undefined);
      setInputValue("");
    }
  }, [initialDate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9/]/g, "");
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    setInputValue(value);
  };
  const parseDate = (value: string) => {
    if (value.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const parsedDate = parse(value, "MM/dd/yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        onSelect(parsedDate);
      } else {
        setDate(undefined);
        onSelect(undefined);
      }
    } else {
      setDate(undefined);
      onSelect(undefined);
    }
  };
  const handleInputBlur = () => {
    parseDate(inputValue);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      parseDate(inputValue);
    }
  };
  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setInputValue(format(newDate, "MM/dd/yyyy"));
    } else {
      setInputValue("");
    }
    onSelect(newDate);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(className, "pr-10")}
            maxLength={10}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full rounded-r-md px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => {
              if (!disabled) {
                setOpen(!open);
              }
            }}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="sr-only">Toggle calendar</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleCalendarSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}