"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ScorecardDisplay } from "@/components/scorecard/ScorecardDisplay";
import { ScorecardReport } from "@/lib/types";
import { SAMPLE_SCORECARD_102 } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function ScorecardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scorecardId = (params?.id as string) || "SC-DH-102";

  const [scorecard, setScorecard] = useState<ScorecardReport>(SAMPLE_SCORECARD_102);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadScorecard() {
      if (!scorecardId) return;

      try {
        const res = await api.getScorecard(scorecardId);
        if (res.data) {
          setScorecard(res.data);
          return;
        }
      } catch (err) {
        // Fallback to sample benchmark record
        console.warn("Backend scorecard not reached, rendering benchmark record:", err);
      }
      setScorecard({
        ...SAMPLE_SCORECARD_102,
        id: scorecardId,
      });
    }

    loadScorecard();
  }, [scorecardId]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" label="ল্যান্ড ট্রুথ স্কোরকার্ড লোড হচ্ছে..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/analyze" className="hover:text-emerald-700 transition-colors">
            অ্যানালাইসিস
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-900">{scorecard.id}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/analyze")}
          className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          ড্যাশবোর্ডে ফিরে যান
        </Button>
      </div>

      {/* Main Scorecard View */}
      <ScorecardDisplay scorecard={scorecard} />
    </div>
  );
}
