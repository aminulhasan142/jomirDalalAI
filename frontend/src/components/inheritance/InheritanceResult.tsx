"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  PieChart as PieChartIcon,
  CheckCircle2,
  Info,
  Scale,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InheritanceAuditResponse } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface InheritanceResultProps {
  auditResult: InheritanceAuditResponse;
  totalLandDecimal?: number;
}

export function InheritanceResult({
  auditResult,
  totalLandDecimal = 0,
}: InheritanceResultProps) {
  const COLORS = [
    "#047857", // emerald-700
    "#d97706", // amber-600
    "#2563eb", // blue-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#0891b2", // cyan-600
    "#4b5563", // gray-600
  ];

  const pieData = auditResult.heir_distributions.map((d, i) => ({
    name: `${d.relation_bn} (${formatBanglaNumber(d.count)} জন)`,
    value: Number(d.total_percentage.toFixed(2)),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full space-y-6">
      {/* Main Results Card */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                উত্তরাধিকার ফারায়েজ বণ্টন ফলাফল
              </CardTitle>
              <p className="text-sm text-gray-500">
                মৃত ব্যক্তি: <strong className="text-gray-900">{auditResult.deceased_owner}</strong> • ইসলামিক ফারায়েজ বিধান অনুযায়ী নির্ধারিত
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 font-semibold text-xs">
                মোট বণ্টন: {formatBanglaNumber(auditResult.total_percentage)}%
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Table of Distributions (takes 2 cols) */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50">
                    <th className="py-3 px-3.5 rounded-l-lg">ওয়ারিশ / সম্পর্ক</th>
                    <th className="py-3 px-3 text-center">সংখ্যা</th>
                    <th className="py-3 px-3">শরয়ী অংশ</th>
                    <th className="py-3 px-3 text-right">জনপ্রতি (%)</th>
                    <th className="py-3 px-3 text-right">মোট শেয়ার (%)</th>
                    {totalLandDecimal > 0 && (
                      <th className="py-3 px-3.5 text-right rounded-r-lg">জমির পরিমাণ</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditResult.heir_distributions.map((dist, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-semibold text-gray-900">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span>{dist.relation_bn}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-gray-700">
                        {formatBanglaNumber(dist.count)}
                      </td>

                      <td className="py-3 px-3 text-xs text-emerald-700 font-medium">
                        {dist.quranic_fraction_bn || "কুরআনিক অংশ"}
                      </td>

                      <td className="py-3 px-3 text-right font-medium text-gray-700">
                        {formatBanglaNumber(dist.per_heir_percentage.toFixed(2))}%
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-gray-900">
                        {formatBanglaNumber(dist.total_percentage.toFixed(2))}%
                      </td>

                      {totalLandDecimal > 0 && (
                        <td className="py-3 px-3.5 text-right text-xs font-semibold text-emerald-800">
                          {dist.total_area_decimal
                            ? `${formatBanglaNumber(dist.total_area_decimal.toFixed(2))} শতক`
                            : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Pie Chart */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-emerald-700" />
                ওয়ারিশদের শেয়ার পাই চার্ট
              </span>
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={42}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${formatBanglaNumber(val)}%`, "শেয়ার"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend in 2 cols */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3 text-xs">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warnings Section (if any) */}
          {auditResult.warnings && auditResult.warnings.length > 0 && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                সতর্কতা বার্তা
              </div>
              <ul className="list-disc list-inside text-xs space-y-1 text-amber-700">
                {auditResult.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Notes and Co-Sharer Protection Section */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              আইনি পর্যবেক্ষণ ও সুরক্ষা নির্দেশিকা:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              {auditResult.notes_bn.map((note, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-gray-200 bg-white flex items-start gap-2.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
