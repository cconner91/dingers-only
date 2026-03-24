"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-[#020617] px-4 pt-3 pb-2">
      <div className="flex bg-[#0f172a] rounded-lg p-1">
        <Link
          href="/"
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition ${
            pathname === "/"
              ? "bg-orange-500 text-black"
              : "text-gray-400"
          }`}
        >
          Parlay Builder
        </Link>

        <Link
          href="/stats"
          className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition ${
            pathname === "/stats"
              ? "bg-orange-500 text-black"
              : "text-gray-400"
          }`}
        >
          My Stats
        </Link>
      </div>
    </div>
  );
}