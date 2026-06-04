import { z } from "zod"

export const tradeSchema = z.object({
  // =========================
  // TRADE
  // =========================

  symbol: z
    .string()
    .min(2, "Symbol required"),

  side: z.enum([
    "LONG",
    "SHORT"
  ]),

  entryPrice: z.coerce.number(),

  stopLoss: z.coerce.number(),

  takeProfit: z.coerce
    .number()
    .optional(),

  size: z.coerce
    .number()
    .optional(),

  leverage: z.coerce
    .number()
    .optional(),

  riskPercent:
    z.coerce.number(),

  accountId: z
    .string()
    .min(1, "Select account"),

  // =========================
  // EXCEL FIELDS
  // =========================

  result: z
    .enum([
      "WIN",
      "LOSS",
      "BE"
    ])
    .optional(),

  origin: z.string().optional(),

  quality: z.string().optional(),

  sweep: z.boolean().optional(),

  liquidityType: z
    .string()
    .optional(),

  liquidityTimeframe: z
    .string()
    .optional(),

  fvgVisible: z
    .boolean()
    .optional(),

  fvgTimeframe: z
    .string()
    .optional(),

  fvgCount: z.coerce
    .number()
    .optional(),

  obVisible: z
    .boolean()
    .optional(),

  obTimeframe: z
    .string()
    .optional(),

  obCount: z.coerce
    .number()
    .optional(),

  supportResistance: z
    .boolean()
    .optional(),

  blindEntry: z
    .boolean()
    .optional(),

  notes: z
    .string()
    .optional(),

  // =========================
  // CONFLUENCIAS
  // =========================

  liquiditySweep: z
    .boolean()
    .optional(),

  reclaim: z
    .boolean()
    .optional(),

  displacement: z
    .boolean()
    .optional(),

  choch: z
    .boolean()
    .optional(),

  bos: z
    .boolean()
    .optional(),

  ema15mTouch: z
    .boolean()
    .optional(),

  ema1hTouch: z
    .boolean()
    .optional(),

  htfAligned: z
    .boolean()
    .optional()
})

export type TradeFormData =
  z.infer<typeof tradeSchema>