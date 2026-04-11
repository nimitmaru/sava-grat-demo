"use client"

import { useState } from "react"
import type { Household, AssetType } from "@/lib/types"
import { ParameterForm } from "./parameter_form"

type ModelingParams = {
  householdId: string
  fundingAmount: number
  termYears: number
  fundingAsset: string
  assetType: AssetType
  expectedReturn: number
  rate7520: number
  custodian: string
  advisorFeeRate: number
}

export function ModelingClient({
  households,
  currentRate,
  initialClientId,
}: {
  households: Household[]
  currentRate: number
  initialClientId?: string
}) {
  const defaultHousehold = initialClientId
    ? households.find(h => h.id === initialClientId) ?? households[0]
    : households[0]

  const [params, setParams] = useState<ModelingParams>({
    householdId: defaultHousehold.id,
    fundingAmount: 5_000_000,
    termYears: 2,
    fundingAsset: defaultHousehold.holdings[0]?.name ?? "",
    assetType: defaultHousehold.holdings[0]?.type ?? "diversified",
    expectedReturn: 0.12,
    rate7520: currentRate,
    custodian: defaultHousehold.custodian,
    advisorFeeRate: defaultHousehold.advisorFeeRate,
  })

  return (
    <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
      {/* Left: Parameters */}
      <div className="col-span-5 overflow-y-auto">
        <ParameterForm
          households={households}
          currentRate={currentRate}
          params={params}
          onParamsChange={setParams}
        />
      </div>
      {/* Right: Projections — will be added in Task 18 */}
      <div className="col-span-7 overflow-y-auto rounded-xl bg-surface-container-lowest p-6">
        <p className="text-sm text-on-surface-variant">Projections will appear here as you adjust parameters...</p>
      </div>
    </div>
  )
}
