"use client";

import React, { useState } from "react";
import { Users, Calculator, Scale, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeirTreeBuilder } from "@/components/inheritance/HeirTreeBuilder";
import { InheritanceResult } from "@/components/inheritance/InheritanceResult";
import { FamilyHeir, InheritanceAuditResponse } from "@/lib/types";
import { calculateIslamicInheritance } from "@/lib/calculations";

export default function InheritancePage() {
  const [deceasedName, setDeceasedName] = useState("মো: রাহাত আলী");
  const [system, setSystem] = useState<"islamic" | "hindu">("islamic");
  const [deceasedShare, setDeceasedShare] = useState<number | string>(1.0);
  const [totalLandDecimal, setTotalLandDecimal] = useState<number | string>(10.0);

  const [heirs, setHeirs] = useState<FamilyHeir[]>([
    { relation: "স্ত্রী", count: 1 },
    { relation: "পুত্র", count: 2 },
    { relation: "কন্যা", count: 1 },
  ]);

  const [auditResult, setAuditResult] = useState<InheritanceAuditResponse | null>(() => {
    const initial = calculateIslamicInheritance(
      [
        { relation: "স্ত্রী", count: 1 },
        { relation: "পুত্র", count: 2 },
        { relation: "কন্যা", count: 1 },
      ],
      1.0,
      10.0
    );
    initial.deceased_owner = "মো: রাহাত আলী";
    return initial;
  });

  const handleAddHeir = () => {
    setHeirs((prev) => [...prev, { relation: "কন্যা", count: 1 }]);
  };

  const handleUpdateHeir = (index: number, updated: FamilyHeir) => {
    setHeirs((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleRemoveHeir = (index: number) => {
    if (heirs.length <= 1) return;
    setHeirs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadSample = () => {
    setDeceasedName("মো: রাহাত আলী");
    setSystem("islamic");
    setDeceasedShare(1.0);
    setTotalLandDecimal(10.0);
    const sampleHeirs: FamilyHeir[] = [
      { relation: "স্ত্রী", count: 1 },
      { relation: "পুত্র", count: 2 },
      { relation: "কন্যা", count: 1 },
    ];
    setHeirs(sampleHeirs);
    const res = calculateIslamicInheritance(sampleHeirs, 1.0, 10.0);
    res.deceased_owner = "মো: রাহাত আলী";
    setAuditResult(res);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const share = Number(deceasedShare) || 1.0;
    const land = Number(totalLandDecimal) || 0;

    const res = calculateIslamicInheritance(heirs, share, land);
    res.deceased_owner = deceasedName || "মৃত ব্যক্তি";
    setAuditResult(res);
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            উত্তরাধিকার ও সহ-শরিক অডিট
          </h1>
          <p className="text-gray-500 text-base max-w-3xl">
            মৃত পূর্বসূরীর সম্পত্তির ফারায়েজ অনুযায়ী আইনানুগ বণ্টন ও বঞ্চিত সহ-শরিক ঝুঁকি যাচাই করুন।
          </p>
        </div>

        {/* Two-column layout on desktop: Left takes 2 cols, Right takes 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Form Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  মৃত ব্যক্তির তথ্য ও উত্তরাধিকারী নির্ধারণ
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  মৃত পূর্বসূরীর জমির পরিমাণ ও আইন অনুযায়ী ওয়ারিশ তালিকা পূরণ করুন
                </p>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="deceasedName" className="text-sm font-semibold text-gray-900">
                      মৃত পুরুষ/মহিলার নাম
                    </Label>
                    <Input
                      id="deceasedName"
                      value={deceasedName}
                      onChange={(e) => setDeceasedName(e.target.value)}
                      placeholder="যেমন: মো: রাহাত আলী"
                      className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-10"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="system" className="text-sm font-semibold text-gray-900">
                      উত্তরাধিকার আইন পদ্ধতি
                    </Label>
                    <Select
                      value={system}
                      onValueChange={(val: "islamic" | "hindu") => setSystem(val)}
                    >
                      <SelectTrigger id="system" className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-10">
                        <SelectValue placeholder="পদ্ধতি নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 text-gray-900">
                        <SelectItem value="islamic">ইসলামিক ফারায়েজ</SelectItem>
                        <SelectItem value="hindu">হিন্দু দায়ভাগ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="deceasedShare" className="text-sm font-semibold text-gray-900">
                      মৃত ব্যক্তির মোট জমি অংশ (Share)
                    </Label>
                    <Input
                      id="deceasedShare"
                      type="number"
                      step="0.001"
                      min="0.01"
                      max="1.0"
                      value={deceasedShare}
                      onChange={(e) => setDeceasedShare(e.target.value)}
                      placeholder="১.০ (পূর্ণ অংশ)"
                      className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-10 font-medium"
                      required
                    />
                    <p className="text-xs text-gray-500">পূর্ণ মালিকানা হলে ১.০, অন্যথায় দশমিক শেয়ার</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="totalLandDecimal" className="text-sm font-semibold text-gray-900">
                      মোট জমির পরিমাণ (Decimal)
                    </Label>
                    <Input
                      id="totalLandDecimal"
                      type="number"
                      step="0.01"
                      min="0"
                      value={totalLandDecimal}
                      onChange={(e) => setTotalLandDecimal(e.target.value)}
                      placeholder="যেমন: ১০.০"
                      className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-10 font-medium"
                    />
                    <p className="text-xs text-gray-500">শতক বা ডেসিমেলে জমির পরিমাণ</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6" />

                {/* Heir Management */}
                <HeirTreeBuilder
                  heirs={heirs}
                  onAddHeir={handleAddHeir}
                  onUpdateHeir={handleUpdateHeir}
                  onRemoveHeir={handleRemoveHeir}
                  onLoadSample={handleLoadSample}
                />

                {/* Bottom: Large "হিসাব করুন" button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-12 text-base rounded-xl shadow-sm transition-colors"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    হিসাব করুন
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Quick Reference Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    ফারায়েজ কুইক রেফারেন্স
                  </h3>
                  <p className="text-xs text-gray-500">শরয়ী উত্তরাধিকার বিধানমালা</p>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                  <span className="font-bold text-gray-900 block">স্ত্রী (Wife)</span>
                  <p className="text-gray-600">
                    সন্তান থাকলে <strong>১/৮ অংশ</strong> (১২.৫%); সন্তান না থাকলে <strong>১/৪ অংশ</strong> (২৫%)।
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                  <span className="font-bold text-gray-900 block">স্বামী (Husband)</span>
                  <p className="text-gray-600">
                    সন্তান থাকলে <strong>১/৪ অংশ</strong> (২৫%); সন্তান না থাকলে <strong>১/২ অংশ</strong> (৫০%)।
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                  <span className="font-bold text-gray-900 block">পিতা ও মাতা</span>
                  <p className="text-gray-600">
                    সন্তান জীবিত থাকলে পিতা ও মাতা প্রত্যেকে নিশ্চিত <strong>১/৬ অংশ</strong> পান।
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1">
                  <span className="font-bold text-gray-900 block">পুত্র ও কন্যা (আসাবা)</span>
                  <p className="text-gray-600">
                    অন্যান্য নির্ধারিত অংশ বণ্টনের পর অবশিষ্ট জমি পুত্র ও কন্যার মাঝে <strong>২:১ অনুপাতে</strong> বণ্টিত হয়।
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5 text-emerald-800">
                    <BookOpen className="w-3.5 h-3.5" />
                    আইনি সতর্কতা
                  </span>
                  <p className="text-[11px] leading-relaxed text-emerald-700">
                    সহ-শরিকদের বাদ দিয়ে বা ভুয়া ওয়ারিশান সনদ দিয়ে জমি রেজিস্ট্রি করা আইনত দণ্ডনীয় অপরাধ।
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Results Section (if calculated) */}
        {auditResult && (
          <div className="pt-6">
            <InheritanceResult
              auditResult={auditResult}
              totalLandDecimal={Number(totalLandDecimal) || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
