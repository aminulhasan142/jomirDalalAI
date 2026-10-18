"use client";

import React from "react";
import { User, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FamilyHeir } from "@/lib/types";

interface HeirCardProps {
  index: number;
  heir: FamilyHeir;
  onUpdate: (index: number, updated: FamilyHeir) => void;
  onRemove: (index: number) => void;
  canRemove?: boolean;
}

export function HeirCard({
  index,
  heir,
  onUpdate,
  onRemove,
  canRemove = true,
}: HeirCardProps) {
  const relationOptions = [
    { value: "স্ত্রী", label: "স্ত্রী (Wife)" },
    { value: "স্বামী", label: "স্বামী (Husband)" },
    { value: "পুত্র", label: "পুত্র (Son)" },
    { value: "কন্যা", label: "কন্যা (Daughter)" },
    { value: "পিতা", label: "পিতা (Father)" },
    { value: "মাতা", label: "মাতা (Mother)" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex items-center space-x-2 text-gray-500 font-semibold text-sm min-w-[32px]">
        <Users className="w-4 h-4 text-emerald-700" />
        <span>#{index + 1}</span>
      </div>

      {/* Relation Select */}
      <div className="flex-1 min-w-[180px]">
        <Label className="text-xs font-semibold text-gray-900 mb-1 block sm:hidden">
          ওয়ারিশের সম্পর্ক
        </Label>
        <Select
          value={heir.relation}
          onValueChange={(val) => onUpdate(index, { ...heir, relation: val })}
        >
          <SelectTrigger className="h-10 border-gray-200 bg-white text-gray-900 focus:ring-emerald-700">
            <SelectValue placeholder="সম্পর্ক নির্বাচন করুন" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 text-gray-900">
            {relationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Count Input */}
      <div className="w-full sm:w-32">
        <Label className="text-xs font-semibold text-gray-900 mb-1 block sm:hidden">
          ওয়ারিশ সংখ্যা (Count)
        </Label>
        <Input
          type="number"
          min="1"
          max="30"
          value={heir.count}
          onChange={(e) =>
            onUpdate(index, {
              ...heir,
              count: Math.max(1, parseInt(e.target.value) || 1),
            })
          }
          className="h-10 text-center font-bold text-gray-900 border-gray-200 bg-white focus:ring-emerald-700"
          placeholder="সংখ্যা"
        />
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!canRemove}
        onClick={() => onRemove(index)}
        className="h-10 w-10 text-gray-400 hover:text-rose-600 hover:bg-rose-50 self-end sm:self-center transition-colors disabled:opacity-30"
        aria-label="Remove Heir"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
