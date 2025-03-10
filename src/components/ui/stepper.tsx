"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface StepperProps {
  steps: {
    id: string;
    title: string;
    description?: string;
  }[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepChange,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepChange && onStepChange(index)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    {
                      "border-primary bg-primary text-primary-foreground": isActive,
                      "border-primary bg-primary/20 text-primary": isCompleted,
                      "border-border bg-background text-muted-foreground": !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <div
                    className={cn("text-sm font-medium", {
                      "text-primary": isActive || isCompleted,
                      "text-muted-foreground": !isActive && !isCompleted,
                    })}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 border-t-2 transition-colors mt-5",
                    {
                      "border-primary": isCompleted,
                      "border-border": !isCompleted,
                    }
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}