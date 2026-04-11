import type { User } from '@supabase/supabase-js'

type DisplayUser = Pick<User, 'email' | 'user_metadata'>

export function getUserDisplayName(user: DisplayUser | null) {
  if (!user) return ''

  const metadataName = String(
    user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.user_metadata?.user_name ??
      ''
  ).trim()

  return metadataName || user.email || 'Signed in user'
}
