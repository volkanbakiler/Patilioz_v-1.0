import { type NextRequest, NextResponse } from "next/server"

// Korumalı prefix'ler — bu path'lere giriş yapmadan erişilemez.
const PROTECTED = ["/hesap"]

// Firebase'e geçildiğinde bu cookie adı session token'ı taşıyacak.
// Mock aşamasında localStorage kullanıldığından proxy client-side
// hydration'a güvenir; bu satır gerçek auth'a geçişte aktive edilir.
const SESSION_COOKIE = "patilioz:session"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  )

  if (!isProtected) return NextResponse.next()

  // Gerçek session cookie kontrolü (Firebase'e geçişte dolu olacak).
  const session = request.cookies.get(SESSION_COOKIE)?.value

  // Mock aşaması: auth localStorage tabanlı olduğundan proxy cookie göremez.
  // Bu blok Firebase session cookie entegrasyonuyla aktive edilir:
  //
  // if (!session) {
  //   const loginUrl = new URL("/katil", request.url)
  //   loginUrl.searchParams.set("next", pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // Şimdilik her isteği geçir; client-side useAuth hydration koruma sağlar.
  void session
  return NextResponse.next()
}

export const config = {
  matcher: [
    // /hesap ve alt route'lar; statik dosyaları ve API'yi hariç tut.
    "/hesap/:path*",
  ],
}
