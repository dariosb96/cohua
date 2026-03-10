export async function createTrade(data) {
 const result = calculateTrade(data)

 return prisma.trade.create({
  data: {
   ...data,
   ...result
  }
 })
}