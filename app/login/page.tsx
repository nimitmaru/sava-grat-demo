"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const next = searchParams.get("next") || "/"
      router.push(next)
      router.refresh()
    } else {
      setError("Incorrect password")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary transition-shadow"
        />
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Verifying..." : "Continue"}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <Image
            src="/sava-icon.svg"
            alt="Sava"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Sava GRAT Platform
          </h1>
          <p className="text-sm text-on-surface-variant">
            Enter the access password to continue
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
