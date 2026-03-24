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

  const calculateProfit = (parlay: any) => {
    const wager = parlay.wagerAmount;
    const odds = parlay.totalOdds;

    if (parlay.result === "LOSS") return -wager;

    if (parlay.result === "WIN") {
      const decimal =
        odds > 0
          ? 1 + odds / 100
          : 1 + 100 / Math.abs(odds);

      return wager * decimal - wager;
    }

    return 0;
  };

  const setResult = (parlay: any, result: string) => {
    const profit = calculateProfit({ ...parlay, result });

    const updated = {
      ...parlay,
      result,
      profit,
      units: profit / 10,
    };

    setParlays(updateParlay(updated));
  };

  const togglePlayerResult = (
    parlay: any,
    index: number,
    hit: boolean
  ) => {
    const updatedLegs = [...parlay.legs];
    updatedLegs[index].hitHomeRun = hit;

    const updated = {
      ...parlay,
      legs: updatedLegs,
    };

    setParlays(updateParlay(updated));
  };

  return (
    <div className="space-y-4">
      {parlays.map((p) => (
        <div
          key={p.id}
          className="bg-[#0f172a] p-4 rounded-xl space-y-3"
        >
          {/* Header */}
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

          {/* Core */}
          <div className="flex justify-between">
            <span>{p.legs.length} Legs</span>
            <span>${p.wagerAmount}</span>
          </div>

          <div className="text-orange-400 font-semibold">
            {p.totalOdds > 0 ? "+" : ""}
            {p.totalOdds}
          </div>

          {/* Player Tracking */}
          <div className="space-y-2">
            {p.legs.map((leg: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {leg.playerName} (
                  {leg.odds > 0 ? "+" : ""}
                  {leg.odds})
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      togglePlayerResult(p, i, true)
                    }
                    className={`px-2 py-1 rounded ${
                      leg.hitHomeRun === true
                        ? "bg-green-500 text-black"
                        : "bg-gray-700"
                    }`}
                  >
                    HR
                  </button>

                  <button
                    onClick={() =>
                      togglePlayerResult(p, i, false)
                    }
                    className={`px-2 py-1 rounded ${
                      leg.hitHomeRun === false
                        ? "bg-red-500 text-black"
                        : "bg-gray-700"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Result Toggle */}
          <div className="flex gap-2">
            {["WIN", "LOSS", "CASH"].map((r) => (
              <button
                key={r}
                onClick={() => setResult(p, r)}
                className={`flex-1 py-2 rounded font-semibold ${
                  p.result === r
                    ? r === "WIN"
                      ? "bg-green-500 text-black"
                      : r === "LOSS"
                      ? "bg-red-500 text-black"
                      : "bg-yellow-400 text-black"
                    : "bg-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Profit */}
          {p.result !== "PENDING" && (
            <div className="text-sm">
              Profit:{" "}
              <span
                className={
                  p.profit > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ${p.profit.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}