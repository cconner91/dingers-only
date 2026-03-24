import { Parlay } from "@/types/parlay";

const STORAGE_KEY = "dingers_parlays";

export const getParlays = (): Parlay[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const saveParlays = (parlays: Parlay[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parlays));
};

export const addParlay = (parlay: any) => {
  const current = getParlays();
  const updated = [parlay, ...current];
  saveParlays(updated);
  return updated;
};

export const deleteParlay = (id: string) => {
  const current = getParlays();
  const updated = current.filter((p) => p.id !== id);
  saveParlays(updated);
  return updated;
};

export const updateParlay = (updatedParlay: any) => {
  const current = getParlays();
  const updated = current.map((p) =>
    p.id === updatedParlay.id ? updatedParlay : p
  );
  saveParlays(updated);
  return updated;
};