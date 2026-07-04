export type Trade = {
  id: string;

  date: string;

  direction: "LONG" | "SHORT";

  entry: number;
  stopLoss: number;
  takeProfit?: number;

  size: number;
  leverage: number;

  result?: number; // % o USD

  marketContext: MarketContext;

  confluences: Confluence[];

  execution: Execution;
};