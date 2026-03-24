export type Leg = {
  playerName: string;
  odds: number;
  hitHomeRun?: boolean;
};

export type Parlay = {
  id: string;
  date: string;
  legs: Leg[];
  wagerAmount: number;
  totalOdds: number;
  boostedOdds?: number;
  result: "WIN" | "LOSS" | "CASHOUT" | "PENDING";
  profit?: number;
  units?: number;
};