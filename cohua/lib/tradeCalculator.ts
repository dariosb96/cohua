export function calculateTradeMetrics(
 entry:number,
 stop:number,
 exit:number | null,
 size:number
){

 const risk = Math.abs(entry - stop) * size

 const pnl =
  exit !== null
   ? (exit - entry) * size
   : null

 const result =
  pnl === null
   ? null
   : pnl > 0
   ? "WIN"
   : pnl < 0
   ? "LOSS"
   : "BE"

 return {
  risk,
  pnl,
  result
 }

}