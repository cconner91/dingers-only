"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addParlay } from "@/lib/store";

export default function AddParlay({ onAdd }: any) {
  const [legs, setLegs] = useState([
    { playerName: "", odds: "+100" },
  ]);

  const [wager, setWager] = useState("");

  // ✅ American → Decimal
  const americanToDecimal = (odds: number) => {
    if (odds > 0) return 1 + odds / 100;
    return 1 + 100 / Math.abs(odds);
  };

  // ✅ Decimal → American
  const decimalToAmerican = (decimal: number) => {
    if (decimal >= 2) return Math.round((decimal - 1) * 100);
    return Math.round(-100 / (decimal - 1));
  };

  // ✅ Safe odds parsing
  const parseOdds = (odds: string) => {
    const cleaned = odds.replace(/[^0-9-]/g, "");
    const num = Number(cleaned);

    if (isNaN(num) || num === 0) return null;

    return odds.includes("-") ? -Math.abs(num) : Math.abs(num);
  };

  // ✅ Update leg
  const updateLeg = (index: number, field: string, value: string) => {
    const updated = [...legs];
    updated[index] = { ...updated[index], [field]: value };
    setLegs(updated);
  };

  // ✅ Add leg
  const addLeg = () => {
    setLegs([...legs, { playerName: "", odds: "+100" }]);
  };

  // ✅ Remove leg
  const removeLeg = (index: number) => {
    if (legs.length === 1) return;
    setLegs(legs.filter((_, i) => i !== index));
  };

  // ✅ Calculate parlay odds
  const calculateParlayOdds = () => {
    const parsed = legs
      .map((leg) => parseOdds(leg.odds))
      .filter((o) => o !== null) as number[];

    if (parsed.length === 0) return 0;

    const decimal = parsed.reduce(
      (acc, odds) => acc * americanToDecimal(odds),
      1
    );

    return decimalToAmerican(decimal);
  };

  // ✅ Calculate return
  const calculateReturn = () => {
    const odds = calculateParlayOdds();

    if (!wager || odds === 0) return 0;

    const decimal =
      odds > 0
        ? 1 + odds / 100
        : 1 + 100 / Math.abs(odds);

    return Number(wager) * decimal;
  };

  // ✅ Submit
  const handleSubmit = () => {
    const totalOdds = calculateParlayOdds();

    const cleanedLegs = legs.map((leg) => ({
      playerName: leg.playerName,
      odds: parseOdds(leg.odds) || 0,
    }));

    const newParlay = {
      id: uuidv4(),
      date: new Date().toISOString(),
      legs: cleanedLegs,
      wagerAmount: Number(wager || 0),
      totalOdds,
      result: "PENDING",
    };

    const updated = addParlay(newParlay);
    onAdd(updated);

    // reset
    setLegs([{ playerName: "", odds: "+100" }]);
    setWager("");
  };

  return (
    <div className="p-4 rounded-xl space-y-4 bg-[#0f172a] text-white shadow-lg">
      <h2 className="font-bold text-lg text-orange-400">
        Add Parlay
      </h2>

      {/* Headers */}
      <div className="flex gap-2 text-sm font-semibold">
        <div className="w-full">Player</div>
        <div className="w-28 text-center">
          Odds
          <div className="text-xs text-gray-400">
            (+100 / -100)
          </div>
        </div>
        <div className="w-6"></div>
      </div>

      {/* Legs */}
      {legs.map((leg, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            placeholder="Player"
            className="border border-gray-600 bg-black p-2 rounded w-full text-white placeholder:text-gray-400"
            value={leg.playerName}
            onChange={(e) =>
              updateLeg(i, "playerName", e.target.value)
            }
          />

          <input
            type="text"
            placeholder="+100"
            className="border border-gray-600 bg-black p-2 rounded w-28 text-center text-white placeholder:text-gray-400"
            value={leg.odds}
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

      <button onClick={addLeg} className="text-blue-400 text-sm">
        + Add Leg
      </button>

      {/* Wager + Return */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-gray-300 font-medium">
            Wager
          </label>

          <input
            value={wager}
            onChange={(e) =>
              setWager(e.target.value.replace(/[^0-9.]/g, ""))
            }
            className="border border-gray-600 bg-black p-2 rounded w-full text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="$10.00"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-300 font-medium">
            Potential Return
          </label>

          <div className="p-2 w-full text-green-400 font-semibold text-xl">
            ${calculateReturn().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Odds */}
      <div className="text-sm font-semibold text-orange-400">
        Parlay Odds:{" "}
        {calculateParlayOdds() > 0 ? "+" : ""}
        {calculateParlayOdds()}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-orange-500 hover:bg-orange-600 text-black w-full p-2 rounded-xl font-semibold"
      >
        Save Parlay
      </button>
    </div>
  );
}