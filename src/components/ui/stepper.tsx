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
      <div className="flex flex-col md:flex-row md:justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-row md:flex-col items-center mb-4 md:mb-0">
                <button
                  type="button"
                  onClick={() => onStepChange && onStepChange(index)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all",
                    {
                      "border-primary bg-primary text-primary-foreground": isActive,
                      "border-primary bg-primary/20 text-primary-foreground": isCompleted,
                      "border-border bg-background text-muted-foreground": !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-6 md:w-6"
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
                    <span className="text-sm md:text-base">{index + 1}</span>
                  )}
                </button>
                <div className="ml-3 md:ml-0 md:mt-2 text-left md:text-center">
                  <div
                    className={cn("text-xs md:text-sm font-medium", {
                      "text-primary": isActive || isCompleted,
                      "text-muted-foreground": !isActive && !isCompleted,
                    })}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-0 md:mt-1 hidden md:block">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "hidden md:block md:flex-1 border-t-2 transition-colors md:mt-5",
                    {
                      "border-primary": isCompleted,
                      "border-border": !isCompleted,
                    }
                  )}
                />
              )}
              {!isLast && (
                <div 
                  className={cn(
                    "md:hidden h-6 border-l-2 transition-colors ml-4 mb-1",
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