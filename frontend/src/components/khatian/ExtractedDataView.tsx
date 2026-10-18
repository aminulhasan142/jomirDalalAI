"use client";

import React, { useState } from "react";
import {
  FileText,
  User,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { KhatianData, KhatianOwner } from "@/lib/types";
import { convertAnaGondaToDecimal } from "@/lib/calculations";
import { formatBanglaNumber } from "@/lib/utils";

interface ExtractedDataViewProps {
  initialData: KhatianData;
  onProceedToAnalysis: (data: KhatianData) => void;
}

export function ExtractedDataView({
  initialData,
  onProceedToAnalysis,
}: ExtractedDataViewProps) {
  const [data, setData] = useState<KhatianData>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  // Recalculate totals
  const totalCalculatedDecimal = data.owners.reduce((sum, owner) => {
    const res = convertAnaGondaToDecimal(owner.share_breakdown, data.total_area_decimal);
    return sum + res.decimal_share;
  }, 0);

  const isExactShare = Math.abs(totalCalculatedDecimal - 1.0) < 0.005;

  const handleOwnerChange = (
    index: number,
    field: keyof KhatianOwner | "ana" | "gonda" | "kara" | "kranti",
    value: any
  ) => {
    const updatedOwners = [...data.owners];
    const target = { ...updatedOwners[index] };

    if (field === "name" || field === "share_text") {
      target[field] = value;
    } else {
      target.share_breakdown = {
        ...target.share_breakdown,
        [field]: Number(value) || 0,
      };
      // auto compute decimal
      const conv = convertAnaGondaToDecimal(
        target.share_breakdown,
        data.total_area_decimal
      );
      target.calculated_decimal = conv.decimal_share;
      target.ownership_percentage = conv.percentage;
      target.calculated_area_decimal = conv.actual_area_decimal;
    }

    updatedOwners[index] = target;
    setData({ ...data, owners: updatedOwners });
  };

  const handleAddOwner = () => {
    const newOwner: KhatianOwner = {
      owner_id: `OWN-00${data.owners.length + 1}`,
      name: "নতুন অংশীদার",
      share_text: "০ আনা",
      share_breakdown: { ana: 0, gonda: 0, kara: 0, kranti: 0 },
      calculated_decimal: 0,
      ownership_percentage: 0,
    };
    setData({ ...data, owners: [...data.owners, newOwner] });
  };

  const handleRemoveOwner = (index: number) => {
    const updatedOwners = data.owners.filter((_, i) => i !== index);
    setData({ ...data, owners: updatedOwners });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              এক্সট্রাক্টকৃত খতিয়ান সারসংক্ষেপ
            </h3>
            <p className="text-xs text-gray-500">
              প্রয়োজনে তথ্য সম্পাদনা করুন অথবা সরাসরি বিশ্লেষণে এগিয়ে যান
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-9"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-1.5 text-emerald-700" />
                সম্পাদনা শেষ
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-1.5 text-gray-500" />
                তথ্য সম্পাদনা
              </>
            )}
          </Button>

          <Button
            onClick={() => onProceedToAnalysis(data)}
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-9 px-4 rounded-lg shadow-sm"
          >
            অডিট ও বিশ্লেষণে যান
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Metadata Card */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <CardHeader className="p-0 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900">
            খতিয়ানের সাধারণ পরিচিতি
          </CardTitle>
          {data.confidence_score && (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              কনফিডেন্স: {formatBanglaNumber(data.confidence_score)}%
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500 font-medium">খতিয়ান নম্বর</Label>
              {isEditing ? (
                <Input
                  value={data.khatian_no}
                  onChange={(e) => setData({ ...data, khatian_no: e.target.value })}
                  className="mt-1 h-9 border-gray-200 text-gray-900 focus:ring-emerald-700 font-bold"
                />
              ) : (
                <p className="font-bold text-lg text-gray-900">
                  {formatBanglaNumber(data.khatian_no)}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500 font-medium">মৌজা</Label>
              {isEditing ? (
                <Input
                  value={data.mouza}
                  onChange={(e) => setData({ ...data, mouza: e.target.value })}
                  className="mt-1 h-9 border-gray-200 text-gray-900 focus:ring-emerald-700 font-bold"
                />
              ) : (
                <p className="font-bold text-lg text-gray-900">{data.mouza}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500 font-medium">দাগ (প্লট) নম্বর</Label>
              {isEditing ? (
                <Input
                  value={data.dag_no}
                  onChange={(e) => setData({ ...data, dag_no: e.target.value })}
                  className="mt-1 h-9 border-gray-200 text-gray-900 focus:ring-emerald-700 font-bold"
                />
              ) : (
                <p className="font-bold text-lg text-gray-900">
                  {formatBanglaNumber(data.dag_no)}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500 font-medium">মোট জমির পরিমাণ</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={data.total_area_decimal}
                  onChange={(e) =>
                    setData({
                      ...data,
                      total_area_decimal: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1 h-9 border-gray-200 text-gray-900 focus:ring-emerald-700 font-bold"
                />
              ) : (
                <p className="font-bold text-lg text-emerald-800">
                  {formatBanglaNumber(data.total_area_decimal)} শতক
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owners Table Card */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <CardHeader className="p-0 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              মালিক ও অংশীদারদের তালিকা ({formatBanglaNumber(data.owners.length)} জন)
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              খতিয়ানে উল্লিখিত আনা-গণ্ডা ভগ্নাংশ ও সংশ্লিষ্ট শতকরা অংশ
            </p>
          </div>

          {isEditing && (
            <Button
              onClick={handleAddOwner}
              size="sm"
              variant="outline"
              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 h-8 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> অংশীদার যোগ করুন
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0 pt-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50">
                  <th className="py-3 px-3.5 rounded-l-lg">ক্রমিক</th>
                  <th className="py-3 px-3">অংশীদারের নাম</th>
                  <th className="py-3 px-3">খতিয়ান অংশ</th>
                  <th className="py-3 px-3">আনা-গণ্ডা ব্রেকডাউন</th>
                  <th className="py-3 px-3 text-right">মালিকানা (%)</th>
                  <th className="py-3 px-3.5 text-right rounded-r-lg">জমির পরিমাণ</th>
                  {isEditing && <th className="py-3 px-3 text-center">মুছুন</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.owners.map((owner, idx) => {
                  const conv = convertAnaGondaToDecimal(
                    owner.share_breakdown,
                    data.total_area_decimal
                  );

                  return (
                    <tr key={owner.owner_id || idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3.5 text-xs font-medium text-gray-400">
                        {formatBanglaNumber(idx + 1)}
                      </td>

                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {isEditing ? (
                          <Input
                            value={owner.name}
                            onChange={(e) =>
                              handleOwnerChange(idx, "name", e.target.value)
                            }
                            className="h-8 text-sm border-gray-200"
                          />
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{owner.name}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-emerald-700 font-medium">
                        {isEditing ? (
                          <Input
                            value={owner.share_text}
                            onChange={(e) =>
                              handleOwnerChange(idx, "share_text", e.target.value)
                            }
                            className="h-8 text-sm border-gray-200"
                          />
                        ) : (
                          <span>{owner.share_text}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <div className="flex items-center space-x-1 max-w-[260px]">
                            <Input
                              type="number"
                              placeholder="আনা"
                              value={owner.share_breakdown.ana}
                              onChange={(e) =>
                                handleOwnerChange(idx, "ana", e.target.value)
                              }
                              className="h-8 text-xs p-1 text-center border-gray-200"
                            />
                            <span className="text-xs text-gray-500">আ</span>
                            <Input
                              type="number"
                              placeholder="গণ্ডা"
                              value={owner.share_breakdown.gonda}
                              onChange={(e) =>
                                handleOwnerChange(idx, "gonda", e.target.value)
                              }
                              className="h-8 text-xs p-1 text-center border-gray-200"
                            />
                            <span className="text-xs text-gray-500">গ</span>
                            <Input
                              type="number"
                              placeholder="কড়া"
                              value={owner.share_breakdown.kara}
                              onChange={(e) =>
                                handleOwnerChange(idx, "kara", e.target.value)
                              }
                              className="h-8 text-xs p-1 text-center border-gray-200"
                            />
                            <span className="text-xs text-gray-500">ক</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {formatBanglaNumber(owner.share_breakdown.ana)} আনা{" "}
                            {formatBanglaNumber(owner.share_breakdown.gonda)} গণ্ডা{" "}
                            {formatBanglaNumber(owner.share_breakdown.kara)} কড়া
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-gray-900">
                        {formatBanglaNumber(conv.percentage.toFixed(2))}%
                      </td>

                      <td className="py-3 px-3.5 text-right font-medium text-emerald-800">
                        {conv.actual_area_decimal
                          ? `${formatBanglaNumber(conv.actual_area_decimal.toFixed(2))} শতক`
                          : "—"}
                      </td>

                      {isEditing && (
                        <td className="py-3 px-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOwner(idx)}
                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Validation Status Footer */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              {isExactShare ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-bold text-gray-900">
                  মোট শেয়ার অনুপাত: {formatBanglaNumber((totalCalculatedDecimal * 100).toFixed(2))}%
                </span>
                <p className="text-gray-500 mt-0.5">
                  {isExactShare
                    ? "১৬ আনা বা ১০০% পূর্ণ হয়েছে। গাণিতিক হিসেব সঠিক রয়েছে।"
                    : "সতর্কতা: সকল শরিকের যোগফল ১৬ আনা (১০০%) এর সমান নয়।"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => onProceedToAnalysis(data)}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-10 px-6 rounded-xl shadow-sm"
            >
              বিশ্লেষণ ড্যাশবোর্ডে যান
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
