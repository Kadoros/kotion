"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressNavigationProps {
  totalSteps: number;
  currentStep: number; // Controlled state from parent
  setCurrentStep: (step: number) => void; // Function from parent to update state
  onStepChange?: (currentStep: number) => void;
  children: (currentStep: number) => React.ReactNode;
  title?: string;
  subtitle?: string;
  buttonDisable?: boolean;
}

const ProgressNavigation = ({
  totalSteps,
  currentStep,
  setCurrentStep,
  onStepChange,
  children,
  title,
  subtitle,
  buttonDisable,
}: ProgressNavigationProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const handleForward = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  // Check if children is a valid function and is not null/undefined
  const renderChildren = children(currentStep);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#1F1F1F] text-gray-900 dark:text-gray-100 p-4 w-full">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Sticky Title and Subtitle */}
      <div className="sticky top-0 bg-gray-50 dark:bg-[#1F1F1F] pb-4">
        {title && (
          <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {subtitle}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center mx-auto max-w-4xl w-full">
        <div className="text-center mb-8">
          {renderChildren ? (
            // Check if renderChildren is an array or not
            Array.isArray(renderChildren) ? (
              renderChildren.map((child: React.ReactNode, index: number) => (
                <span key={index}>{child}</span>
              ))
            ) : (
              renderChildren
            )
          ) : (
            <div>No content available</div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      {!buttonDisable && (
        <div className="sticky bottom-0 justify-end bg-gray-50 dark:bg-[#1F1F1F] py-4 w-full">
          <div className="flex justify-end space-x-2 w-full mx-auto max-w-4xl">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              variant="default"
              onClick={handleForward}
              disabled={currentStep === totalSteps}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressNavigation;
