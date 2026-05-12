import { z } from "zod"

export const tradeSchema = z.object({
  symbol: z.string().min(2),

  side: z.enum([
    "LONG",
    "SHORT"
  ]),

  entryPrice: z.coerce.number(),

  stopLoss: z.coerce.number(),

  takeProfit: z.coerce
    .number()
    .optional(),

  size: z.coerce.number(),

  leverage: z.coerce
    .number()
    .optional(),

  accountId: z.string()
})

export type TradeFormData =
  z.input<typeof tradeSchema>