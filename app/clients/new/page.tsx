import { Header } from "@/components/layout/header"
import { OnboardingWizard } from "./components/onboarding_wizard"

export default function NewClientPage() {
  return (
    <>
      <Header
        title="New Client"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Clients", href: "/clients" },
          { label: "New Client" },
        ]}
      />
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <OnboardingWizard />
      </div>
    </>
  )
}
