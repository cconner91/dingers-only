"use client";

import { useEffect, useState } from "react";
import { getParlays } from "@/lib/store";
import TopNav from "@/components/TopNav";

export default function StatsPage() {
  const [parlays, setParlays] = useState<any[]>([]);

  useEffect(() => {
    setParlays(getParlays());
  }, []);

  const totalProfit = parlays.reduce(
    (sum, p) => sum + (p.profit || 0),
    0
  );

  const wins = parlays.filter((p) => p.result === "WIN").length;
  const total = parlays.length;

  const winRate = total ? (wins / total) * 100 : 0;

  const playerStats: any = {};

  parlays.forEach((p) => {
    p.legs?.forEach((leg: any) => {
      if (!playerStats[leg.playerName]) {
        playerStats[leg.playerName] = {
          hits: 0,
          total: 0,
        };
      }

      if (leg.hitHomeRun === true) {
        playerStats[leg.playerName].hits++;
      }

      playerStats[leg.playerName].total++;
    });
  });

  const topPlayers = Object.entries(playerStats)
    .map(([name, stats]: any) => ({
      name,
      avg: stats.hits / stats.total,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return (
    <>
      <TopNav />

      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold text-orange-400">
          Stats Dashboard
        </h1>

        {/* EMPTY STATE */}
        {parlays.length === 0 ? (
          <div className="card p-4 text-center text-gray-400">
            No bets tracked yet.
            <div className="text-sm mt-2">
              Add a parlay to start tracking stats.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3">
                Profit: ${totalProfit.toFixed(2)}
              </div>

              <div className="card p-3">
                Win Rate: {winRate.toFixed(1)}%
              </div>
            </div>

            <div className="card p-3">
              <h2 className="font-semibold mb-2">
                Top Players
              </h2>

              {topPlayers.map((p, i) => (
                <div key={i} className="text-sm">
                  {p.name} — {(p.avg * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}