"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 pb-2 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex bg-[#0f172a]/80 rounded-2xl p-1 shadow-inner">
        <Link
          href="/"
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition ${
            pathname === "/"
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-black shadow-lg"
              : "text-gray-400"
          }`}
        >
          Parlay Builder
        </Link>

        <Link
          href="/stats"
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-xl transition ${
            pathname === "/stats"
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-black shadow-lg"
              : "text-gray-400"
          }`}
        >
          My Stats
        </Link>
      </div>
    </div>
  );
}