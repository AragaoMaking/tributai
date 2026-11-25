import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const allowedNextPaths = new Set(["/assinar", "/redefinir-senha", "/visao-geral"]);

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return new NextResponse("Supabase não configurado.", { status: 503 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next") || "";
  const nextPath = allowedNextPaths.has(requestedNext) ? requestedNext : "/visao-geral";
  const destination = new URL(nextPath, request.url);
  const response = NextResponse.redirect(destination);

  if (!code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("authError", "link-invalido");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("authError", "link-expirado");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
