"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeirCard } from "./HeirCard";
import { FamilyHeir } from "@/lib/types";

interface HeirTreeBuilderProps {
  heirs?: FamilyHeir[];
  onAddHeir?: () => void;
  onUpdateHeir?: (index: number, updated: FamilyHeir) => void;
  onRemoveHeir?: (index: number) => void;
  onLoadSample?: () => void;
}

export function HeirTreeBuilder({
  heirs: controlledHeirs,
  onAddHeir: controlledAddHeir,
  onUpdateHeir: controlledUpdateHeir,
  onRemoveHeir: controlledRemoveHeir,
  onLoadSample,
}: HeirTreeBuilderProps) {
  // Uncontrolled fallback state if not provided as props
  const [internalHeirs, setInternalHeirs] = useState<FamilyHeir[]>([
    { relation: "স্ত্রী", count: 1 },
    { relation: "পুত্র", count: 2 },
    { relation: "কন্যা", count: 1 },
  ]);

  const heirs = controlledHeirs ?? internalHeirs;

  const handleUpdate = (index: number, updated: FamilyHeir) => {
    if (controlledUpdateHeir) {
      controlledUpdateHeir(index, updated);
    } else {
      const copy = [...internalHeirs];
      copy[index] = updated;
      setInternalHeirs(copy);
    }
  };

  const handleRemove = (index: number) => {
    if (controlledRemoveHeir) {
      controlledRemoveHeir(index);
    } else {
      if (internalHeirs.length <= 1) return;
      setInternalHeirs(internalHeirs.filter((_, i) => i !== index));
    }
  };

  const handleAdd = () => {
    if (controlledAddHeir) {
      controlledAddHeir();
    } else {
      setInternalHeirs([...internalHeirs, { relation: "কন্যা", count: 1 }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Heir Section Header with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            ওয়ারিশ তালিকা
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            জীবিত ওয়ারিশদের সম্পর্ক ও সংখ্যা নির্ধারণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onLoadSample && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onLoadSample}
              className="text-xs text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 h-9"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              নমুনা পরিবার লোড করুন
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            className="text-xs font-semibold h-9 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 shadow-none"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            ওয়ারিশ যোগ করুন
          </Button>
        </div>
      </div>

      {/* Heir Rows */}
      <div className="space-y-2.5">
        {heirs.map((heir, idx) => (
          <HeirCard
            key={idx}
            index={idx}
            heir={heir}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            canRemove={heirs.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
