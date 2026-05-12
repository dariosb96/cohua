
import { z } from "zod"

export const tradeSchema = z.object({
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
    .min(1, "Select account")
})

export type TradeFormData =
  z.input<typeof tradeSchema>