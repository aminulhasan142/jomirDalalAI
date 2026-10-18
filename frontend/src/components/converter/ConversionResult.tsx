"use client";

import React from "react";
import {
  PieChart as PieChartIcon,
  Hash,
  Scale,
  LandPlot,
  Maximize2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnaGondaConversionResponse, DecimalToAnaResponse } from "@/lib/types";
import { formatBanglaNumber } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface ConversionResultProps {
  result: AnaGondaConversionResponse | DecimalToAnaResponse;
  totalLandDecimal?: number;
}

export function ConversionResult({
  result,
  totalLandDecimal = 0,
}: ConversionResultProps) {
  const decimalShare = result.decimal_share;
  const percentage = result.percentage;
  const remainingShare = Math.max(0, 1.0 - decimalShare);

  const pieData = [
    { name: "হিসাবকৃত অংশ", value: Number((decimalShare * 100).toFixed(2)), color: "#047857" },
    { name: "অবশিষ্ট অংশ", value: Number((remainingShare * 100).toFixed(2)), color: "#e5e7eb" },
  ];

  const breakdown =
    "share_breakdown" in result
      ? result.share_breakdown
      : {
          ana: result.ana,
          gonda: result.gonda,
          kara: result.kara,
          kranti: result.kranti,
          til: result.til,
        };

  return (
    <div className="w-full space-y-5">
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              রূপান্তর ও হিসাবের ফলাফল
            </CardTitle>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              ১৬ আনা = ১০০%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left 2 Cols: Stat Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Decimal Share */}
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1.5">
                  <Hash className="w-4 h-4 text-emerald-700" />
                  দশমিক শেয়ার (Decimal Share)
                </span>
                <p className="text-2xl font-black text-gray-900">
                  {formatBanglaNumber(decimalShare.toFixed(6))}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ১.০ এর সাপেক্ষে ভগ্নাংশ অনুপাত
                </p>
              </div>

              {/* Percentage */}
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1.5">
                  <PieChartIcon className="w-4 h-4 text-emerald-700" />
                  মালিকানা শতকরা হার (Percentage)
                </span>
                <p className="text-2xl font-black text-emerald-700">
                  {formatBanglaNumber(percentage.toFixed(4))}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ১০০% এর সাপেক্ষে মালিকানা
                </p>
              </div>

              {/* Total Til */}
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1.5">
                  <LandPlot className="w-4 h-4 text-emerald-700" />
                  মোট তিল সংখ্যা (Total Til)
                </span>
                <p className="text-2xl font-black text-gray-900">
                  {formatBanglaNumber(result.total_til)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  সর্বমোট ৫৭,৬০০ তিলের সাপেক্ষে
                </p>
              </div>

              {/* Actual Land Area if provided */}
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-medium text-emerald-800 flex items-center gap-1.5 mb-1.5">
                  <Maximize2 className="w-4 h-4 text-emerald-700" />
                  বাস্তব জমির পরিমাণ (Actual Area)
                </span>
                <p className="text-2xl font-black text-emerald-900">
                  {result.actual_area_decimal
                    ? `${formatBanglaNumber(result.actual_area_decimal.toFixed(3))} শতক`
                    : "—"}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {result.actual_area_sqft
                    ? `প্রায় ${formatBanglaNumber(result.actual_area_sqft.toLocaleString())} বর্গফুট`
                    : "মোট জমি প্রদান করলে হিসাব হবে"}
                </p>
              </div>
            </div>

            {/* Right Col: Pie Representation */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-900 mb-2">
                মালিকানা অংশের ভিজ্যুয়াল পাই চার্ট
              </span>
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${formatBanglaNumber(val)}%`, "অংশ"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 text-xs mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-700" />
                  <span className="text-gray-700 font-medium">আপনার অংশ ({formatBanglaNumber(percentage.toFixed(1))}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-gray-500">অন্যান্য</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-gray-700">
              পরিমাপের প্রতিটি একক:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700">
                আনা: <strong className="ml-1 text-emerald-700">{formatBanglaNumber(breakdown.ana)}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700">
                গণ্ডা: <strong className="ml-1 text-emerald-700">{formatBanglaNumber(breakdown.gonda)}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700">
                কড়া: <strong className="ml-1 text-emerald-700">{formatBanglaNumber(breakdown.kara)}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700">
                ক্রান্তি: <strong className="ml-1 text-emerald-700">{formatBanglaNumber(breakdown.kranti)}</strong>
              </span>
              {breakdown.til !== undefined && (
                <span className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-700">
                  তিল: <strong className="ml-1 text-emerald-700">{formatBanglaNumber(breakdown.til)}</strong>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
