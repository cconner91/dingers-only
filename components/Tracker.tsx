"use client";

import { useEffect, useState } from "react";
import {
  getParlays,
  deleteParlay,
  updateParlay,
} from "@/lib/store";

export default function Tracker() {
  const [parlays, setParlays] = useState<any[]>([]);

  useEffect(() => {
    setParlays(getParlays());
  }, []);

  const setResult = (p: any, result: string) => {
    const updated = { ...p, result };
    setParlays(updateParlay(updated));
  };

  return (
    <div className="space-y-4">
      {parlays.map((p) => (
        <div
          key={p.id}
          className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 shadow-lg rounded-xl p-4 space-y-2"
        >
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {new Date(p.date).toLocaleDateString()}
            </span>
            <button
              onClick={() =>
                setParlays(deleteParlay(p.id))
              }
              className="text-red-400"
            >
              Delete
            </button>
          </div>

          <div className="flex justify-between">
            <span>{p.legs.length} legs</span>
            <span>${p.wagerAmount}</span>
          </div>

          <div className="text-orange-400 font-semibold">
            {p.totalOdds > 0 ? "+" : ""}
            {p.totalOdds}
          </div>

          <div className="text-sm text-gray-300">
            {p.legs.map((l: any, i: number) => (
              <div key={i}>
                {l.playerName} ({l.odds > 0 ? "+" : ""}
                {l.odds})
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setResult(p, "WIN")}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-black rounded-lg py-2"
            >
              WIN
            </button>

            <button
              onClick={() => setResult(p, "LOSS")}
              className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-black rounded-lg py-2"
            >
              LOSS
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}