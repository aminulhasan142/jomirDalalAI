"use client";

import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { AnaGondaForm } from "@/components/converter/AnaGondaForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ConverterPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ঐতিহ্যবাহী ভূমি ভগ্নাংশ গণক
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            আনা-গণ্ডা কনভার্টার
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            বাংলাদেশের প্রচলিত ১৬ আনা = ১০০% পদ্ধতির প্রাচীন হিসাবকে নিমেষেই নির্ভুল আধুনিক দশমিক শতাংশ এবং বর্গফুটে রূপান্তর করুন।
          </p>
        </div>

        {/* Main Converter Form (which uses AnaGondaForm and ConversionResult) */}
        <AnaGondaForm />

        {/* Educational Reference Formula Card */}
        <Card className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <CardHeader className="p-0 pb-4 border-b border-gray-200">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              বাংলাদেশ ভূমি পরিমাপের মৌলিক সূত্রাবলী
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 pt-4 space-y-4 text-xs text-gray-600">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <span className="font-bold text-base text-gray-900 block">১৬ আনা</span>
                <span className="text-[11px] text-gray-500">১ সম্পূর্ণ অংশ (১০০%)</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <span className="font-bold text-base text-gray-900 block">১ আনা</span>
                <span className="text-[11px] text-gray-500">২০ গণ্ডা (৩,৬০০ তিল)</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <span className="font-bold text-base text-gray-900 block">১ গণ্ডা</span>
                <span className="text-[11px] text-gray-500">৪ কড়া (১৮০ তিল)</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <span className="font-bold text-base text-gray-900 block">১ কড়া</span>
                <span className="text-[11px] text-gray-500">৩ ক্রান্তি (৪৫ তিল)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-gray-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-gray-700">
                <strong>তিল সমীকরণ:</strong> মোট ১৬ আনা = ৫৭,৬০০ তিল এবং প্রতিটি ক্রান্তি = ১৫ তিল। এই সূক্ষ্মতম গাণিতিক হিসেবে ভগ্নাংশ রূপান্তরে কোনো মান বাদ পড়ে না, ফলে সাব-রেজিস্ট্রি বা নামজারি পর্যায় শতভাগ নিখুঁত ফলাফল নিশ্চিত হয়।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
