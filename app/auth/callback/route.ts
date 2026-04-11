import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const nextPath = request.nextUrl.searchParams.get('next')
  const redirectPath = nextPath?.startsWith('/') ? nextPath : '/'

  if (!code) {
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const failureUrl = new URL(redirectPath, request.url)
    failureUrl.searchParams.set('auth_error', 'oauth_callback_failed')
    return NextResponse.redirect(failureUrl)
  }

  return NextResponse.redirect(new URL(redirectPath, request.url))
}
