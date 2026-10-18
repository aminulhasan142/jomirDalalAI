"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KhatianUploader } from "@/components/khatian/KhatianUploader";
import { ExtractedDataView } from "@/components/khatian/ExtractedDataView";
import { KhatianData } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [extractedData, setExtractedData] = useState<KhatianData | null>(null);

  const handleExtractionComplete = (data: KhatianData) => {
    setExtractedData(data);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_khatian", JSON.stringify(data));
    }
  };

  const handleProceedToAnalysis = (data: KhatianData) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_khatian", JSON.stringify(data));
    }
    router.push("/analyze");
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        {/* Page Header */}
        <div className="space-y-2 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            এআই ভিশন ও অপটিকাল রিকগনিশন (OCR)
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            খতিয়ান আপলোড
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            স্ক্যান করা খতিয়ান বা পর্চার ছবি আপলোড করে এআই দিয়ে খতিয়ান নম্বর, দাগ, মালিকানা ও আনা-গণ্ডা ভগ্নাংশ এক্সট্রাক্ট করুন।
          </p>
        </div>

        {/* Main Flow: Uploader or Extracted Data View */}
        {!extractedData ? (
          <div className="space-y-6">
            <KhatianUploader onExtractionComplete={handleExtractionComplete} />

            {/* Supported Surveys Pill Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-900 block">সিএস (CS)</span>
                <span className="text-[11px] text-gray-500">ক্যাডাস্ট্রাল সার্ভে</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-900 block">এসএ (SA)</span>
                <span className="text-[11px] text-gray-500">স্টেট অ্যাকুইজিশন</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-900 block">আরএস (RS)</span>
                <span className="text-[11px] text-gray-500">রিভিশনাল সার্ভে</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <span className="font-bold text-gray-900 block">বিএস / সিটি</span>
                <span className="text-[11px] text-gray-500">বাংলাদেশ সার্ভে</span>
              </div>
            </div>
          </div>
        ) : (
          <ExtractedDataView
            initialData={extractedData}
            onProceedToAnalysis={handleProceedToAnalysis}
          />
        )}
      </div>
    </div>
  );
}
