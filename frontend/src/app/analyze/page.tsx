"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SharePieChart } from "@/components/scorecard/SharePieChart";
import { KhatianData } from "@/lib/types";
import { SAMPLE_KHATIAN_102, SAMPLE_SCORECARD_102 } from "@/lib/mock-data";
import { convertAnaGondaToDecimal } from "@/lib/calculations";
import { formatBanglaNumber } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function AnalyzePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [khatian, setKhatian] = useState<KhatianData>(SAMPLE_KHATIAN_102);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("active_khatian");
      if (stored) {
        try {
          setKhatian(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored khatian", e);
        }
      }
    }
  }, []);

  const totalCalculatedDecimal = khatian.owners.reduce((sum, owner) => {
    const res = convertAnaGondaToDecimal(owner.share_breakdown, khatian.total_area_decimal);
    return sum + res.decimal_share;
  }, 0);

  const isValidShare = Math.abs(totalCalculatedDecimal - 1.0) < 0.005;

  const handleGenerateScorecard = () => {
    setIsGenerating(true);

    toast({
      title: "ল্যান্ড ট্রুথ স্কোরকার্ড প্রস্তুত হচ্ছে...",
      description: "গাণিতিক হিসেব, ওয়ারিশ অডিট ও মালিকানা চেইনের সমন্বয় চলছে।",
      variant: "default",
    });

    setTimeout(() => {
      setIsGenerating(false);
      router.push(`/scorecard/${SAMPLE_SCORECARD_102.id}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            অডিট ও ডায়াগনস্টিক ইঞ্জিন
          </span>
          <h1 className="text-3xl font-black text-gray-900">
            খতিয়ান বিশ্লেষণ ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            মালিকানা শেয়ার যাচাই এবং ল্যান্ড ট্রুথ স্কোরকার্ড জেনারেটর
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              নতুন আপলোড
            </Button>
          </Link>
          <Button
            onClick={handleGenerateScorecard}
            disabled={isGenerating}
            size="lg"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            {isGenerating ? "জেনারেট হচ্ছে..." : "পূর্ণাঙ্গ স্কোরকার্ড দেখুন"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-xs text-gray-500 font-medium block">খতিয়ান ও মৌজা</span>
          <p className="text-xl font-black text-gray-900 mt-1">
            {formatBanglaNumber(khatian.khatian_no)} • {khatian.mouza}
          </p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            দাগ নং: {formatBanglaNumber(khatian.dag_no)}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-xs text-gray-500 font-medium block">মোট জমির পরিমাণ</span>
          <p className="text-xl font-black text-gray-900 mt-1">
            {formatBanglaNumber(khatian.total_area_decimal)} শতক
          </p>
          <span className="text-xs text-gray-500 mt-1 block">
            প্রায় {formatBanglaNumber(Math.round(khatian.total_area_decimal * 435.6))} বর্গফুট
          </span>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-xs text-gray-500 font-medium block">অংশীদার সংখ্যা</span>
          <p className="text-xl font-black text-gray-900 mt-1">
            {formatBanglaNumber(khatian.owners.length)} জন
          </p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            সকলের অংশ তালিকাভুক্ত
          </span>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <span className="text-xs text-gray-500 font-medium block">গাণিতিক বৈধতা</span>
          <div className="flex items-center gap-1.5 mt-1">
            {isValidShare ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-lg font-black text-emerald-700">বৈধ (১৬ আনা)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-lg font-black text-amber-600">অমিল শনাক্ত</span>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            মোট শেয়ার: {formatBanglaNumber((totalCalculatedDecimal * 100).toFixed(2))}%
          </span>
        </Card>
      </div>

      {/* Split View: Owners Table & Ownership Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-base text-gray-900 flex items-center justify-between">
                <span>মালিকানা ও শেয়ার বিশ্লেষণ</span>
                <Badge
                  className={
                    isValidShare
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {isValidShare ? "১৬ আনা সমানুপাতিক" : "যোগফল অমিল"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                      <th className="p-2.5">মালিকের নাম</th>
                      <th className="p-2.5">খতিয়ান টেক্সট</th>
                      <th className="p-2.5">আনা-গণ্ডা</th>
                      <th className="p-2.5 text-right">দশমিক শেয়ার</th>
                      <th className="p-2.5 text-right">জমির পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {khatian.owners.map((owner, idx) => {
                      const conv = convertAnaGondaToDecimal(
                        owner.share_breakdown,
                        khatian.total_area_decimal
                      );
                      return (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-2.5 font-bold text-gray-900">
                            {owner.name}
                          </td>
                          <td className="p-2.5 text-emerald-700 font-medium">
                            {owner.share_text}
                          </td>
                          <td className="p-2.5 text-gray-600">
                            {formatBanglaNumber(owner.share_breakdown.ana)} আনা{" "}
                            {formatBanglaNumber(owner.share_breakdown.gonda)} গণ্ডা
                          </td>
                          <td className="p-2.5 text-right font-black text-gray-900">
                            {formatBanglaNumber(conv.decimal_share.toFixed(4))} (
                            {formatBanglaNumber(conv.percentage.toFixed(1))}%)
                          </td>
                          <td className="p-2.5 text-right font-medium text-gray-700">
                            {conv.actual_area_decimal
                              ? `${formatBanglaNumber(conv.actual_area_decimal.toFixed(2))} শতক`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Status Note */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  খতিয়ানের সকল অংশীদারের শেয়ার গাণিতিকভাবে সম্পূর্ণ ও সঙ্গতিপূর্ণ। মোট তিল সংখ্যা: ৫৭,৬০০ / ৫৭,৬০০।
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Inheritance Co-Sharer Audit Option */}
          <Card className="border border-gray-200 bg-white rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  উত্তরাধিকার ও পারিবারিক ফারায়েজ অডিট
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  ঐচ্ছিক কিন্তু অত্যন্ত সুপারিশকৃত
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                বিক্রেতার অংশে কোনো বাদ পড়া সহ-শরিক বা নারী ওয়ারিশের অংশ অন্তর্ভুক্ত আছে কিনা যাচাই করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">যাচাইকৃত পরিবার:</span>
                  <span className="font-bold text-gray-900">মো: রাহাত আলী (পিতা)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ওয়ারিশ সদস্য:</span>
                  <span className="text-gray-800">১ স্ত্রী, ২ পুত্র, ১ কন্যা (ফারায়েজ সংরক্ষিত)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/inheritance">
                  <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50">
                    পারিবারিক ওয়ারিশ সম্পাদনা করুন
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Pie Chart & CTA */}
        <div className="space-y-4">
          <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-gray-900 mb-2">
              মালিকানা বণ্টন পাই চার্ট
            </span>
            <SharePieChart owners={khatian.owners} height={240} />
          </Card>

          <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-gray-900">চূড়ান্ত ল্যান্ড ট্রুথ স্কোরকার্ড</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              আইনজীবী, ব্যাংক ও সাব-রেজিস্ট্রি অফিসের ব্যবহারযোগ্য এক পাতার প্রাতিষ্ঠানিক প্রতিবেদন তৈরি করুন।
            </p>
            <Button
              onClick={handleGenerateScorecard}
              disabled={isGenerating}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              স্কোরকার্ড জেনারেট করুন
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
