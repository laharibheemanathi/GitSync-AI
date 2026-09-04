"use client";

import { useEffect, useState } from "react";

interface LoadingStep {
  label: string;
  completed: boolean;
}

export default function LoadingState({ currentStep }: { currentStep: string }) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { label: "Fetching commits from GitHub...", completed: false },
    { label: "Scanning for code conflicts...", completed: false },
    { label: "Analyzing security implications...", completed: false },
    { label: "Reasoning with Featherless AI...", completed: false },
    { label: "Generating recommendations...", completed: false },
  ]);

  useEffect(() => {
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        completed:
          step.label === currentStep
            ? false
            : steps.findIndex((s) => s.label === step.label) <
              steps.findIndex((s) => s.label === currentStep),
      }))
    );
  }, [currentStep]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <h3 className="text-xl font-bold text-white">Analyzing Repository...</h3>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-2 rounded transition-all ${
              step.completed
                ? "text-green-400 bg-green-900/10"
                : step.label === currentStep
                ? "text-blue-400 bg-blue-900/20"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">
              {step.completed ? "✅" : step.label === currentStep ? "⏳" : "⚪"}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}