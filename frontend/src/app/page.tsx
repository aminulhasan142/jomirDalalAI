"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Calculator,
  Users,
  ShieldCheck,
  ArrowRight,
  Upload,
  Sparkles,
  FileCheck,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBanglaNumber } from "@/lib/utils";

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      badge: "ফিচার ১",
      title: "খতিয়ান OCR এক্সট্রাকশন",
      desc: "স্ক্যান করা বা তোলা খতিয়ান (CS, SA, RS, BS) থেকে এআই প্রযুক্তির সাহায্যে খতিয়ান নম্বর, দাগ নম্বর, মালিকানা ও অংশ সরাসরি বের করুন।",
      href: "/upload",
      cta: "খতিয়ান আপলোড করুন",
    },
    {
      icon: Calculator,
      badge: "ফিচার ২",
      title: "আনা-গণ্ডা ভগ্নাংশ গণনা",
      desc: "বাংলাদেশের প্রচলিত ১৬ আনা = ১০০% পদ্ধতির জটিল হিসাবকে নিমেষেই নিখুঁত আধুনিক শতাংশ, ডেসিমেল এবং বর্গফুটে রূপান্তর করুন।",
      href: "/converter",
      cta: "কনভার্টারে হিসাব করুন",
    },
    {
      icon: Users,
      badge: "ফিচার ৩",
      title: "ফারায়েজ ও উত্তরাধিকার অডিট",
      desc: "মুসলিম পারিবারিক ফারায়েজ আইন অনুযায়ী ওয়ারিশদের প্রকৃত হিস্যা যাচাই করে লুকানো বা বঞ্চিত সহ-শরিকের ঝুঁকি শনাক্ত করুন।",
      href: "/inheritance",
      cta: "ওয়ারিশ হিসেব করুন",
    },
    {
      icon: ShieldCheck,
      badge: "ফিচার ৪",
      title: "ল্যান্ড ট্রুথ স্কোরকার্ড",
      desc: "জমি কেনার আগে এক পাতার স্বয়ংক্রিয় কালার-কোডেড ডায়াগনস্টিক রিপোর্ট। সবুজ, হলুদ ও লাল নির্দেশকে সঠিক সিদ্ধান্ত নিন।",
      href: "/scorecard/SC-DH-102",
      cta: "নমুনা স্কোরকার্ড দেখুন",
    },
  ];

  const steps = [
    {
      step: "১",
      title: "খতিয়ান বা পর্চা আপলোড",
      desc: "আপনার পুরোনো বা নতুন খতিয়ানের ছবি বা পিডিএফ আপলোড করুন।",
      icon: Upload,
    },
    {
      step: "২",
      title: "স্বয়ংক্রিয় এআই এক্সট্রাকশন",
      desc: "বাংলা হস্তাক্ষর ও জটিল রেকর্ড থেকে নির্ভুল তথ্য উদ্ধার করা হয়।",
      icon: Sparkles,
    },
    {
      step: "৩",
      title: "আনা-গণ্ডা ও উত্তরাধিকার মিলকরণ",
      desc: "১৬ আনা ভগ্নাংশ ও শরয়ী ওয়ারিশদের অংশ মিলিয়ে অসঙ্গতি চিহ্নিত হয়।",
      icon: Calculator,
    },
    {
      step: "৪",
      title: "স্কোরকার্ড ও আইনি সিদ্ধান্ত",
      desc: "ঝুঁকি রেটিং এবং নিরাপদ জমি ক্রয়ের পূর্ণাঙ্গ দিকনির্দেশনা পান।",
      icon: FileCheck,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>এআই-চালিত ভূমি রেকর্ড অডিট ইঞ্জিন • LandTech 2026</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                  জমির দালাল AI
                </h1>
                <p className="text-xl sm:text-2xl text-emerald-800 font-bold leading-snug">
                  জমির আসল সত্য জানতে, আপনার বিশ্বস্ত ডিজিটাল সহকারী
                </p>
              </div>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                বাংলাদেশের প্রচলিত খতিয়ান (CS, SA, RS, BS) ও পর্চার জটিল আনা-গণ্ডা ভগ্নাংশ হিসাব, উত্তরাধিকার ফারায়েজ যাচাই ও ল্যান্ড ট্রুথ স্কোরকার্ডের মাধ্যমে জমি প্রতারণা ও ভুয়া বিক্রেতা প্রতিরোধের নিরাপদ সমাধান।
              </p>

              {/* 3 Main CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/upload">
                  <Button
                    size="lg"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-5 rounded-xl shadow-md text-base gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    খতিয়ান আপলোড করুন
                  </Button>
                </Link>

                <Link href="/converter">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-5 py-5 rounded-xl shadow-xs text-sm sm:text-base gap-2"
                  >
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    আনা-গণ্ডা কনভার্টার
                  </Button>
                </Link>

                <Link href="/inheritance">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 font-semibold px-5 py-5 rounded-xl shadow-xs text-sm sm:text-base gap-2"
                  >
                    <Users className="w-4 h-4 text-emerald-700" />
                    ফারায়েজ অডিট
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CS, SA, RS ও BS পর্চা সমর্থিত</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>১৬ আনা শতভাগ নির্ভুল ফ্র্যাকশন ম্যাপিং</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ইনস্ট্যান্ট ল্যান্ড ট্রুথ স্কোরকার্ড</span>
                </div>
              </div>
            </div>

            {/* Right Column: 2D Relatable Illustration & Interactive Badges */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Subtle ambient emerald glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-amber-400/15 rounded-3xl blur-2xl -z-10 pointer-events-none" />

              <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl bg-white p-2.5 sm:p-3.5 border border-emerald-100 shadow-xl shadow-emerald-900/5 group">
                <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 aspect-[4/3]">
                  <Image
                    src="/hero-illustration.jpg"
                    alt="জমির দালাল AI এআই-চালিত ভূমি রেকর্ড অডিট ও বিশ্লেষণ"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  
                  {/* Floating Relatable Badge 1: Top-Left Truth Score */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md border border-emerald-200/90 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white font-extrabold text-[11px] shadow-xs">
                      ৯৪
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider leading-none">ট্রুথ স্কোর</p>
                      <p className="text-xs font-bold text-gray-900 leading-tight">ঝুঁকিমুক্ত খতিয়ান</p>
                    </div>
                  </div>

                  {/* Floating Relatable Badge 2: Bottom-Right Plot & Ana */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-xl px-3 py-2 shadow-md flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-medium text-gray-500 leading-none">দাগ ও অংশ যাচাই</p>
                      <p className="text-xs font-bold text-emerald-900 leading-tight">১৬ আনা নির্ভুল অডিট</p>
                    </div>
                  </div>
                </div>

                {/* Bottom caption micro-bar */}
                <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    ডিজিটাল মৌজা ম্যাপ ও দাগ নম্বর লিঙ্কড
                  </span>
                  <span className="hidden sm:inline text-gray-400">
                    সরকার-স্বীকৃত রেকর্ড ফর্ম্যাট
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Feature Cards Section */}
      <section className="w-full py-16 sm:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              মূল বৈশিষ্ট্যসমূহ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              ভূমি ব্যবস্থাপনার চারটি প্রধান স্তম্ভ
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              দালাল নির্ভরতা পরিহার করে সাধারণ নাগরিক, আইনজীবী ও সাব-রেজিস্ট্রারদের জন্য উন্মুক্ত ডিজিটাল সমাধান
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                        {feat.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      {feat.desc}
                    </p>
                  </div>
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
                  >
                    <span>{feat.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="w-full py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              ব্যবহারের সহজ প্রক্রিয়া
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              কীভাবে কাজ করে জমির দালাল AI?
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              মাত্র ৪টি সহজ ধাপে সম্পূর্ণ পর্চা অডিট এবং সত্যতা মূল্যায়ন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center flex flex-col items-center space-y-3 shadow-sm relative z-10"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-black text-base flex items-center justify-center shadow-sm">
                  {formatBanglaNumber(st.step)}
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  {st.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Banner Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-emerald-700 text-white py-12 px-6 sm:px-10 rounded-2xl mx-auto max-w-6xl shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">১৬ আনা</span>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">১০০% পূর্ণ শেয়ার সমীকরণ</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">৫৭,৬০০ তিল</span>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">সর্বোচ্চ গাণিতিক নির্ভুলতা</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">১০০%</span>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">ফারায়েজ অডিট ও ওয়ারিশ সুরক্ষা</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">&lt; ১০ সেকেন্ড</span>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">স্বয়ংক্রিয় বিশ্লেষণ গতি</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Benchmark Demo Scenario */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                বাস্তব নমুনা দৃশ্যপট (Live Benchmark)
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                ঢাকা ধানমন্ডি মৌজার ১০২ নং আরএস খতিয়ান
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                মো: রাহাত আলীর ৪ আনা ৮ গণ্ডা অংশের পেছনে রয়েছে ১ স্ত্রী, ২ পুত্র ও ১ কন্যা। আমাদের এআই ইঞ্জিন তাৎক্ষণিকভাবে পরীক্ষা করে নিশ্চিত করেছে যে কোনো ওয়ারিশ বাদ পড়েনি এবং ১৬ আনা হিসাব নির্ভুল রয়েছে।
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/scorecard/SC-DH-102">
                  <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm">
                    সম্পূর্ণ ডায়াগনস্টিক রিপোর্ট দেখুন
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium">
                    অ্যানালাইসিস ড্যাশবোর্ড
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-xs text-gray-700">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">খতিয়ান নং:</span>
                <span className="font-bold text-gray-900">১০২ (RS)</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">মৌজা:</span>
                <span className="font-bold text-gray-900">ধানমন্ডি (দাগ ৪০৫)</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">মোট জমি:</span>
                <span className="font-bold text-gray-900">১০.০ শতক</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">নিরাপত্তা স্কোর:</span>
                <span className="font-bold text-emerald-700">৯২/১০০ (নিরাপদ)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
