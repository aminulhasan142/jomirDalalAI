"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  LandPlot,
  Award,
  HelpCircle,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "./RiskBadge";
import { SharePieChart } from "./SharePieChart";
import { ScorecardPDFExport } from "./ScorecardPDFExport";
import { ScorecardReport } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/utils";

interface ScorecardDisplayProps {
  scorecard: ScorecardReport;
}

export function ScorecardDisplay({ scorecard }: ScorecardDisplayProps) {
  const getStatusIcon = (status: "PASS" | "WARN" | "FAIL") => {
    switch (status) {
      case "PASS":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "WARN":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case "FAIL":
        return <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
    }
  };

  const getStatusBadge = (status: "PASS" | "WARN" | "FAIL") => {
    switch (status) {
      case "PASS":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            উত্তীর্ণ
          </span>
        );
      case "WARN":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            সতর্কীকরণ
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            ঝুঁকিপূর্ণ
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs font-semibold">
            আইডি: {scorecard.id}
          </Badge>
          <span className="text-xs text-gray-500">
            তারিখ: {scorecard.generated_at}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ScorecardPDFExport
            targetElementId="printable-scorecard"
            reportId={scorecard.id}
          />
        </div>
      </div>

      {/* Main Printable Scorecard Document */}
      <div
        id="printable-scorecard"
        className="bg-white text-gray-900 p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-8"
      >
        {/* 1. Scorecard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  ল্যান্ড ট্রুথ স্কোরকার্ড
                </h1>
                <p className="text-xs font-semibold text-emerald-700">
                  জমির দালাল AI • ডিজিটাল ভূমি রেকর্ড অডিট ও ঝুঁকি মূল্যায়ন রিপোর্ট
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <RiskBadge level={scorecard.overall_risk} size="lg" />
            <span className="text-xs text-gray-500 mt-1.5">
              সামগ্রিক নিরাপত্তা স্কোর: <strong className="text-gray-900">{formatBanglaNumber(scorecard.risk_score)}/১০০</strong>
            </span>
          </div>
        </div>

        {/* 2. Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200">
          <div>
            <span className="text-xs text-gray-500 font-medium block">
              খতিয়ান নম্বর
            </span>
            <span className="text-xl font-bold text-gray-900">
              {formatBanglaNumber(scorecard.khatian_no)}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium block">
              মৌজা
            </span>
            <span className="text-xl font-bold text-gray-900">
              {scorecard.mouza}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium block">
              দাগ নম্বর
            </span>
            <span className="text-xl font-bold text-gray-900">
              {formatBanglaNumber(scorecard.dag_no)}
            </span>
          </div>

          <div>
            <span className="text-xs text-gray-500 font-medium block">
              মোট জমির পরিমাণ
            </span>
            <span className="text-xl font-bold text-emerald-800">
              {formatBanglaNumber(scorecard.total_area_decimal)} শতক
            </span>
          </div>
        </div>

        {/* 3. Check Results Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              স্বয়ংক্রিয় অডিট ও সত্যতা যাচাই প্যারামিটার
            </h3>
            <span className="text-xs text-gray-500">
              {formatBanglaNumber(scorecard.checks.length)} টি মৌলিক পয়েন্ট পরীক্ষিত
            </span>
          </div>

          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden bg-white">
            {scorecard.checks.map((check) => (
              <div
                key={check.id}
                className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5">{getStatusIcon(check.status)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {check.title_bn}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                        {check.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {check.message_bn}
                    </p>
                    {check.details_bn && (
                      <p className="text-[11px] text-gray-400">
                        বিশদ: {check.details_bn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">{getStatusBadge(check.status)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Owners Breakdown & Ownership Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Owners Table */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              অংশীদারদের শেয়ার ও খতিয়ান হিসেব
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">মালিকের নাম</th>
                    <th className="p-3">খতিয়ান অংশ</th>
                    <th className="p-3 text-right">মালিকানা (%)</th>
                    <th className="p-3 text-right">জমির শতক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scorecard.owners.map((owner, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3 font-medium text-gray-900">
                        {owner.name}
                      </td>
                      <td className="p-3 text-emerald-700 font-medium">
                        {owner.share_text}
                      </td>
                      <td className="p-3 text-right font-bold text-gray-900">
                        {formatBanglaNumber(owner.ownership_percentage?.toFixed(2))}%
                      </td>
                      <td className="p-3 text-right font-medium text-gray-600">
                        {owner.calculated_area_decimal
                          ? `${formatBanglaNumber(owner.calculated_area_decimal.toFixed(2))} শতক`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ownership Chart */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 bg-gray-50/50">
            <span className="text-xs font-semibold text-gray-900 mb-1">
              মালিকানা বণ্টন ডায়াগ্রাম
            </span>
            <SharePieChart owners={scorecard.owners} height={200} />
          </div>
        </div>

        {/* 5. Inheritance Audit Snapshot */}
        {scorecard.inheritance_audit && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-700" />
              উত্তরাধিকার ফারায়েজ অডিট সারসংক্ষেপ:
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              মৃত পূর্বসূরী {scorecard.inheritance_audit.deceased_owner} এর আইনগত ওয়ারিশদের অংশ নিরূপণ সম্পন্ন হয়েছে। মোট বণ্টনকৃত অংশ: {formatBanglaNumber(scorecard.inheritance_audit.total_percentage)}%। কোনো অবৈধ সহ-শরিক বর্জন পরিলক্ষিত হয়নি।
            </p>
          </div>
        )}

        {/* 6. Strategic Legal Recommendations */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            আইনি ও বাস্তবিক সুপারিশসমূহ
          </h3>

          <div className="space-y-2">
            {scorecard.recommendations_bn.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {formatBanglaNumber(i + 1)}
                </div>
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Verification Seal & Note */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">
              সত্যায়ন কর্তৃপক্ষ: {scorecard.verifier}
            </p>
            <p className="text-[11px] text-gray-400">
              ডিজিটাল ভূমিসেবা ও হ্যাকাথন নীতিমালা (LandTech 2026, Daffodil International University) সাপেক্ষে প্রস্তুতকৃত।
            </p>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>ডিজিটাল অডিট সিলমোহরযুক্ত</span>
          </div>
        </div>
      </div>
    </div>
  );
}
