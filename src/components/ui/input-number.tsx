"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { NumericFormat } from "react-number-format";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function NumberInput({
  value,
  onChange,
  prefix,
  placeholder = "0.00",
  className,
  id,
  disabled = false,
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.select(); // Select all text on focus
    }, 0); // Delay ensures the input is fully rendered before selecting text
  };

  return (
    <NumericFormat
      value={value}
      thousandSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      prefix={prefix || ""}
      placeholder={placeholder}
      id={id}
      disabled={disabled}
      getInputRef={inputRef} // Correct reference for NumericFormat's internal <input>
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      customInput={Input}
      onFocus={handleFocus} // Added focus logic here
      onValueChange={(values) => onChange(Number(values.value))}
    />
  );
}
