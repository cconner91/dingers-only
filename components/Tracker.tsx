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

  const handleResult = (parlay: any, result: string) => {
    updateParlay({ ...parlay, result });
    setParlays(getParlays());
  };

  const handleDelete = (id: string) => {
    const updated = deleteParlay(id);
    setParlays(updated);
  };

  return (
    <div className="space-y-4">
      {parlays
        .filter((p) => p.result === "PENDING")
        .map((p) => (
          <div
            key={p.id}
            className="bg-[#0f172a] rounded-xl p-4 border border-white/5 space-y-2"
          >
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {new Date(p.date).toLocaleDateString()}
              </span>

              <button
                onClick={() => handleDelete(p.id)}
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
                onClick={() => handleResult(p, "WIN")}
                className="flex-1 bg-green-500 text-black rounded-lg py-2 active:scale-95 transition"
              >
                WIN
              </button>

              <button
                onClick={() => handleResult(p, "LOSS")}
                className="flex-1 bg-red-500 text-black rounded-lg py-2 active:scale-95 transition"
              >
                LOSS
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}