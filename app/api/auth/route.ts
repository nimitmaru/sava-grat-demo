import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const ACCESS_PASSWORD = "savatrust"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password !== ACCESS_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set("sava-auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })

  return NextResponse.json({ ok: true })
}
