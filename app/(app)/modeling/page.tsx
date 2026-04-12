import { Header } from "@/components/layout/header"
import { SavaFooter } from "@/components/layout/sava_footer"
import { ModelingClient } from "./components/modeling_client"
import { getHouseholds, getCurrentRate } from "@/lib/data/store"

export default async function ModelingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const clientId = typeof params.client === "string" ? params.client : undefined
  const households = getHouseholds()
  const currentRate = getCurrentRate()

  return (
    <>
      <Header
        title="GRAT Modeling"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "GRAT Modeling" }]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6 flex flex-col min-h-0">
        <ModelingClient
          households={households}
          currentRate={currentRate}
          initialClientId={clientId}
        />
        <div className="mt-6">
          <SavaFooter />
        </div>
      </div>
    </>
  )
}
