"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addParlay } from "@/lib/store";

type Leg = {
  playerName: string;
  odds: string;
};

export default function AddParlay({ onAdd }: any) {
  const [legs, setLegs] = useState<Leg[]>([
    { playerName: "", odds: "+100" },
  ]);
  const [wager, setWager] = useState("");

  // ---- ODDS ----
  const parseOdds = (odds: string) => {
    if (!odds) return null;
    const num = Number(odds.replace("+", ""));
    if (isNaN(num)) return null;
    return num;
  };

  const americanToDecimal = (odds: number) =>
    odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);

  const decimalToAmerican = (decimal: number) =>
    decimal >= 2
      ? Math.round((decimal - 1) * 100)
      : Math.round(-100 / (decimal - 1));

  const calculateParlayOdds = () => {
    const parsed = legs
      .map((l) => parseOdds(l.odds))
      .filter((o) => o !== null) as number[];

    if (!parsed.length) return 0;

    const decimal = parsed.reduce(
      (acc, o) => acc * americanToDecimal(o),
      1
    );

    return decimalToAmerican(decimal);
  };

  const calculateReturn = () => {
    const odds = calculateParlayOdds();
    if (!wager || odds === 0) return 0;

    const decimal = americanToDecimal(odds);
    return Number(wager) * decimal;
  };

  // ---- UI ----
  const addLeg = () =>
    setLegs([...legs, { playerName: "", odds: "+100" }]);

  const removeLeg = (i: number) => {
    if (legs.length === 1) return;
    setLegs(legs.filter((_, idx) => idx !== i));
  };

  const updateLeg = (i: number, field: keyof Leg, value: string) => {
    const updated = [...legs];
    updated[i] = { ...updated[i], [field]: value };
    setLegs(updated);
  };

  const handleSubmit = () => {
    const newParlay = {
      id: uuidv4(),
      date: new Date().toISOString(),
      legs: legs.map((l) => ({
        playerName: l.playerName,
        odds: parseOdds(l.odds) || 0,
      })),
      wagerAmount: Number(wager || 0),
      totalOdds: calculateParlayOdds(),
      result: "PENDING",
    };

    onAdd(addParlay(newParlay));
  };

  return (
    <div className="bg-[#0f172a]/70 backdrop-blur rounded-xl p-4 border border-white/5 shadow-lg space-y-4">
      <h2 className="text-orange-400 font-semibold">Add Parlay</h2>

      {/* HEADERS */}
      <div className="flex gap-2 text-xs text-gray-400 px-1">
        <div className="flex-1">Player</div>
        <div className="w-24 text-center">
          Odds
          <div className="text-[10px] text-gray-500">
            (+100 / -120)
          </div>
        </div>
      </div>

      {/* LEGS */}
      {legs.map((leg, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder="Player"
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
            value={leg.playerName}
            onChange={(e) =>
              updateLeg(i, "playerName", e.target.value)
            }
          />

          <input
            value={leg.odds}
            className="w-24 text-center bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm"
            onChange={(e) =>
              updateLeg(i, "odds", e.target.value)
            }
          />

          <button
            onClick={() => removeLeg(i)}
            className="text-red-400 text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addLeg}
        className="text-blue-400 text-sm"
      >
        + Add Leg
      </button>

      {/* WAGER + RETURN SIDE BY SIDE */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400">
            Wager Amount
          </label>
          <input
            placeholder="$10.00"
            value={wager}
            onChange={(e) =>
              setWager(e.target.value.replace(/[^0-9.]/g, ""))
            }
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">
            Potential Winnings
          </label>
          <div className="mt-1 px-3 py-2 text-green-400 font-semibold text-sm">
            ${calculateReturn().toFixed(2)}
          </div>
        </div>
      </div>

      {/* PARLAY ODDS */}
      <div className="text-orange-400 font-semibold text-sm">
        Total Odds:{" "}
        {calculateParlayOdds() > 0 ? "+" : ""}
        {calculateParlayOdds()}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-xl bg-orange-500 text-black font-semibold"
      >
        Save Parlay
      </button>
    </div>
  );
}