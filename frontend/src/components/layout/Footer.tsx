export function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: App name + tagline in small text */}
          <div className="text-center md:text-left">
            <span className="font-semibold text-gray-900 text-sm block">
              জমির দালাল AI
            </span>
            <span className="text-gray-500 text-xs block">
              কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি রেকর্ড অডিট ও বিশ্লেষণ প্ল্যাটফর্ম
            </span>
          </div>

          <div className="text-gray-400 text-sm text-center md:text-right">
            <i>Developed By </i>
            <span className="text-gray-500 font-bold">TeamVoid</span>
          </div>
        </div>

        {/* Bottom: Copyright © 2026 */}
        <div className="border-t border-gray-200 mt-6 pt-4 text-center text-gray-500 text-xs">
          Copyright © 2026 জমির দালাল AI — সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
