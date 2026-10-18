"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 my-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-rose-900 dark:text-rose-100 mb-2">
            কিছু একটা ত্রুটি ঘটেছে
          </h2>
          <p className="text-sm text-rose-700 dark:text-rose-300 max-w-md mb-5">
            পৃষ্ঠাটি লোড করার সময় অপ্রত্যাশিত ত্রুটি দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন।
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            className="border-rose-300 hover:bg-rose-100 text-rose-800"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            পুনরায় লোড করুন
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
