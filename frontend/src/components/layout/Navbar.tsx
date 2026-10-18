"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandPlot, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/upload", label: "খতিয়ান আপলোড" },
    { href: "/converter", label: "আনা-গণ্ডা কনভার্টার" },
    { href: "/inheritance", label: "উত্তরাধিকার অডিট" },
    { href: "/analyze", label: "অ্যানালাইসিস" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo + App Name */}
        <Link href="/" className="flex items-center space-x-2.5">
          <LandPlot className="w-7 h-7 text-emerald-700" size={28} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            জমির দালাল AI
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-700",
                  isActive
                    ? "text-emerald-700 font-semibold"
                    : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA Button */}
        <div className="hidden sm:flex items-center space-x-3">
          <Button asChild size="sm">
            <Link href="/upload">খতিয়ান যাচাই</Link>
          </Button>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Button asChild size="sm" className="w-full">
              <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
                খতিয়ান যাচাই
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
