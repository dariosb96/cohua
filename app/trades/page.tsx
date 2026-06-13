// app/trades/page.tsx

import { getTrades } from "@/services/tradeService"

export default async function TradesPage() {

  const trades = await getTrades()

  type Trade =
    Awaited<
      ReturnType<typeof getTrades>
    >[number]


  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">


        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Trading Journal
          </h1>

          <p className="text-zinc-400 mt-2">
            {trades.length} trades
          </p>

        </div>



        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">


          <StatCard
            title="Total Trades"
            value={trades.length}
          />


          <StatCard
            title="Wins"
            value={
              trades.filter(
                (t: Trade) =>
                  t.result === "WIN"
              ).length
            }
          />


          <StatCard
            title="Losses"
            value={
              trades.filter(
                (t: Trade) =>
                  t.result === "LOSS"
              ).length
            }
          />


          <StatCard
            title="Open"
            value={
              trades.filter(
                (t: Trade) =>
                  t.status === "OPEN"
              ).length
            }
          />


        </div>



        {/* TABLE */}


        <div className="
          rounded-3xl
          border
          border-zinc-800
          overflow-hidden
        ">


          <table className="w-full">


            <thead className="bg-zinc-950">

              <tr>

                <Th>Date</Th>
                <Th>Pair</Th>
                <Th>Side</Th>
                <Th>Status</Th>
                <Th>Result</Th>
                <Th>RR</Th>
                <Th>Risk</Th>
                <Th>Account</Th>

              </tr>

            </thead>



            <tbody>


              {trades.map(
                (trade: Trade) => (

                <tr
                  key={trade.id}
                  className="
                    border-t
                    border-zinc-800
                    hover:bg-zinc-950
                  "
                >


                  <Td>
                    {new Date(
                      trade.createdAt
                    ).toLocaleDateString()}
                  </Td>



                  <Td>
                    {trade.symbol}
                  </Td>



                  <Td>
                    {trade.side}
                  </Td>



                  <Td>
                    {trade.status}
                  </Td>



                  <Td>
                    {trade.result ?? "-"}
                  </Td>



                  <Td>

                    {
                      trade.rr
                      ? Number(
                          trade.rr
                        ).toFixed(2)
                      : "-"
                    }

                  </Td>



                  <Td>

                    {
                      trade.riskAmount
                      ? `$${Number(
                          trade.riskAmount
                        ).toFixed(2)}`
                      : "-"
                    }

                  </Td>



                  <Td>

                    {trade.account.name}

                  </Td>


                </tr>

              ))}



              {
                trades.length === 0 &&
                (

                <tr>

                  <td
                    colSpan={8}
                    className="
                      text-center
                      py-12
                      text-zinc-500
                    "
                  >
                    No trades found
                  </td>

                </tr>

              )}


            </tbody>


          </table>


        </div>


      </div>
    </div>
  )
}




function StatCard({
  title,
  value
}: {
  title:string
  value:number
}) {

  return (

    <div
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
      "
    >

      <p className="text-zinc-500 text-sm">
        {title}
      </p>


      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>


    </div>

  )

}





function Th({
  children
}: {
  children:React.ReactNode
}) {

  return (

    <th
      className="
        text-left
        p-4
        text-zinc-400
        font-medium
      "
    >
      {children}
    </th>

  )

}





function Td({
  children
}: {
  children:React.ReactNode
}) {

  return (

    <td className="p-4">
      {children}
    </td>

  )

}