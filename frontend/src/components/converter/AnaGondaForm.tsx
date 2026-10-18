"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRightLeft } from "lucide-react";
import { ConversionResult } from "./ConversionResult";
import {
  convertAnaGondaToDecimal,
  convertDecimalToAnaGonda,
} from "@/lib/calculations";
import { AnaGondaConversionResponse, DecimalToAnaResponse } from "@/lib/types";

export function AnaGondaForm() {
  // Tab 1: Ana-Gonda to Decimal
  const [ana, setAna] = useState<number | string>(4);
  const [gonda, setGonda] = useState<number | string>(8);
  const [kara, setKara] = useState<number | string>(0);
  const [kranti, setKranti] = useState<number | string>(0);
  const [til, setTil] = useState<number | string>(0);
  const [totalLandDecimal1, setTotalLandDecimal1] = useState<number | string>(10);

  // Tab 2: Decimal to Ana-Gonda
  const [decimalShare, setDecimalShare] = useState<number | string>(0.275);
  const [totalLandDecimal2, setTotalLandDecimal2] = useState<number | string>(10);

  // Initial result
  const [result1, setResult1] = useState<AnaGondaConversionResponse | null>(() =>
    convertAnaGondaToDecimal(
      { ana: 4, gonda: 8, kara: 0, kranti: 0, til: 0 },
      10
    )
  );

  const [result2, setResult2] = useState<DecimalToAnaResponse | null>(() =>
    convertDecimalToAnaGonda(0.275, 10)
  );

  const handleConvertAnaGonda = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = convertAnaGondaToDecimal(
      {
        ana: Number(ana) || 0,
        gonda: Number(gonda) || 0,
        kara: Number(kara) || 0,
        kranti: Number(kranti) || 0,
        til: Number(til) || 0,
      },
      Number(totalLandDecimal1) || 0
    );
    setResult1(res);
  };

  const handleConvertDecimal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = convertDecimalToAnaGonda(
      Number(decimalShare) || 0,
      Number(totalLandDecimal2) || 0
    );
    setResult2(res);
  };

  const applyPreset = (presetAna: number, presetGonda: number, presetKara: number, presetKranti: number) => {
    setAna(presetAna);
    setGonda(presetGonda);
    setKara(presetKara);
    setKranti(presetKranti);
    setTil(0);
    const res = convertAnaGondaToDecimal(
      { ana: presetAna, gonda: presetGonda, kara: presetKara, kranti: presetKranti, til: 0 },
      Number(totalLandDecimal1) || 0
    );
    setResult1(res);
  };

  return (
    <div className="w-full space-y-8">
      <Tabs defaultValue="ana-to-dec" className="w-full">
        {/* Modern Tabs Bar */}
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-100 p-1 rounded-xl border border-gray-200">
            <TabsTrigger
              value="ana-to-dec"
              className="text-sm font-semibold rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"
            >
              আনা-গণ্ডা ➔ দশমিক
            </TabsTrigger>
            <TabsTrigger
              value="dec-to-ana"
              className="text-sm font-semibold rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all"
            >
              দশমিক ➔ আনা-গণ্ডা
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Ana-Gonda to Decimal */}
        <TabsContent value="ana-to-dec" className="space-y-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
            <CardHeader className="p-0 pb-6 border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                আনা-গণ্ডা-কড়া-ক্রান্তি পরিমাপ দিন
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                খতিয়ানে বা পর্চায় উল্লেখিত ঐতিহ্যবাহী অংশের পরিমাপ লিখুন
              </p>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <form onSubmit={handleConvertAnaGonda} className="space-y-6">
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <span className="text-xs font-semibold text-gray-500 mr-1">জনপ্রিয় অংশ:</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 text-gray-700"
                    onClick={() => applyPreset(4, 8, 0, 0)}
                  >
                    ৪ আনা ৮ গণ্ডা (২৭.৫%)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 text-gray-700"
                    onClick={() => applyPreset(8, 0, 0, 0)}
                  >
                    ৮ আনা (৫০%)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 text-gray-700"
                    onClick={() => applyPreset(2, 0, 0, 0)}
                  >
                    ২ আনা (১২.৫%)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-200 text-gray-700"
                    onClick={() => applyPreset(1, 4, 0, 0)}
                  >
                    ১ আনা ৪ গণ্ডা (৭.৫%)
                  </Button>
                </div>

                {/* 4 number inputs in a row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ana" className="text-xs font-semibold text-gray-900 block">
                      আনা (Ana) <span className="text-gray-400 font-normal">[০-১৬]</span>
                    </Label>
                    <Input
                      id="ana"
                      type="number"
                      min="0"
                      max="16"
                      value={ana}
                      onChange={(e) => setAna(e.target.value)}
                      className="text-center font-bold text-lg h-12 border-gray-200 bg-white text-gray-900 focus:ring-emerald-700"
                      placeholder="০"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gonda" className="text-xs font-semibold text-gray-900 block">
                      গণ্ডা (Gonda) <span className="text-gray-400 font-normal">[০-১৯]</span>
                    </Label>
                    <Input
                      id="gonda"
                      type="number"
                      min="0"
                      max="19"
                      value={gonda}
                      onChange={(e) => setGonda(e.target.value)}
                      className="text-center font-bold text-lg h-12 border-gray-200 bg-white text-gray-900 focus:ring-emerald-700"
                      placeholder="০"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="kara" className="text-xs font-semibold text-gray-900 block">
                      কড়া (Kara) <span className="text-gray-400 font-normal">[০-৩]</span>
                    </Label>
                    <Input
                      id="kara"
                      type="number"
                      min="0"
                      max="3"
                      value={kara}
                      onChange={(e) => setKara(e.target.value)}
                      className="text-center font-bold text-lg h-12 border-gray-200 bg-white text-gray-900 focus:ring-emerald-700"
                      placeholder="০"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="kranti" className="text-xs font-semibold text-gray-900 block">
                      ক্রান্তি (Kranti) <span className="text-gray-400 font-normal">[০-২]</span>
                    </Label>
                    <Input
                      id="kranti"
                      type="number"
                      min="0"
                      max="2"
                      value={kranti}
                      onChange={(e) => setKranti(e.target.value)}
                      className="text-center font-bold text-lg h-12 border-gray-200 bg-white text-gray-900 focus:ring-emerald-700"
                      placeholder="০"
                    />
                  </div>
                </div>

                {/* Optional total land */}
                <div className="pt-2 space-y-1.5 max-w-sm">
                  <Label htmlFor="totalLand1" className="text-xs font-semibold text-gray-900 block">
                    মোট জমির পরিমাণ (শতক / Decimal) — ঐচ্ছিক
                  </Label>
                  <Input
                    id="totalLand1"
                    type="number"
                    step="0.01"
                    value={totalLandDecimal1}
                    onChange={(e) => setTotalLandDecimal1(e.target.value)}
                    className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-10"
                    placeholder="যেমন: ১০.০ শতক"
                  />
                  <p className="text-xs text-gray-400">
                    নির্দিষ্ট শতক ও বর্গফুট হিসাবের জন্য মোট জমি লিখুন
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-11 px-8 rounded-xl shadow-sm transition-colors"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    হিসাব করুন
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Result Section */}
          {result1 && (
            <ConversionResult
              result={result1}
              totalLandDecimal={Number(totalLandDecimal1) || 0}
            />
          )}
        </TabsContent>

        {/* TAB 2: Decimal to Ana-Gonda */}
        <TabsContent value="dec-to-ana" className="space-y-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
            <CardHeader className="p-0 pb-6 border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
                দশমিক শেয়ার থেকে আনা-গণ্ডায় রূপান্তর
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                আধুনিক মিউটেশন পর্চা বা দলিলের দশমিক শেয়ার (০ থেকে ১.০) লিখুন
              </p>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <form onSubmit={handleConvertDecimal} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="decimalShare" className="text-xs font-semibold text-gray-900 block">
                      দশমিক অংশ (Decimal Share, ০.০০০০০১ থেকে ১.০)
                    </Label>
                    <Input
                      id="decimalShare"
                      type="number"
                      step="0.000001"
                      min="0"
                      max="1"
                      value={decimalShare}
                      onChange={(e) => setDecimalShare(e.target.value)}
                      className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 font-bold text-lg h-12"
                      placeholder="০.২৭৫"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      উদাহরণ: ০.২৭৫ লিখলে ৪ আনা ৮ গণ্ডা রূপান্তর হবে
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="totalLand2" className="text-xs font-semibold text-gray-900 block">
                      মোট জমির পরিমাণ (শতক / ডেসিমেল) — ঐচ্ছিক
                    </Label>
                    <Input
                      id="totalLand2"
                      type="number"
                      step="0.01"
                      value={totalLandDecimal2}
                      onChange={(e) => setTotalLandDecimal2(e.target.value)}
                      className="border-gray-200 bg-white text-gray-900 focus:ring-emerald-700 h-12"
                      placeholder="যেমন: ১০.০ শতক"
                    />
                    <p className="text-xs text-gray-400">
                      মোট জমি দিলে নির্দিষ্ট অংশের শতক ও বর্গফুট বের হবে
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-11 px-8 rounded-xl shadow-sm transition-colors"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    আনা-গণ্ডায় রূপান্তর করুন
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Result Section */}
          {result2 && (
            <ConversionResult
              result={result2}
              totalLandDecimal={Number(totalLandDecimal2) || 0}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
