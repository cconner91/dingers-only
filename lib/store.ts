export const getParlays = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("parlays") || "[]");
};

export const addParlay = (parlay: any) => {
  const existing = getParlays();
  const updated = [parlay, ...existing];

  localStorage.setItem("parlays", JSON.stringify(updated));
  return updated;
};

export const deleteParlay = (id: string) => {
  const existing = getParlays();
  const updated = existing.filter((p: any) => p.id !== id);

  localStorage.setItem("parlays", JSON.stringify(updated));
  return updated;
};

export const updateParlay = (updatedParlay: any) => {
  const existing = getParlays();

  const updated = existing.map((p: any) => {
    if (p.id !== updatedParlay.id) return p;

    let profit = 0;

    if (updatedParlay.result === "WIN") {
      const decimal =
        updatedParlay.totalOdds > 0
          ? 1 + updatedParlay.totalOdds / 100
          : 1 + 100 / Math.abs(updatedParlay.totalOdds);

      profit = updatedParlay.wagerAmount * (decimal - 1);
    }

    if (updatedParlay.result === "LOSS") {
      profit = -updatedParlay.wagerAmount;
    }

    return {
      ...updatedParlay,
      profit,
    };
  });

  localStorage.setItem("parlays", JSON.stringify(updated));
  return updated;
};