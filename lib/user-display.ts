import type { User } from '@supabase/supabase-js'

type DisplayUser = Pick<User, 'email' | 'user_metadata'>
type DisplayProfile = {
  first_name: string
  last_name: string
}

export function getProfileDisplayName(profile: DisplayProfile | null) {
  if (!profile) return ''

  return `${profile.first_name} ${profile.last_name}`.trim()
}

export function getUserDisplayName(user: DisplayUser | null, profile?: DisplayProfile | null) {
  const profileName = getProfileDisplayName(profile ?? null)
  if (profileName) return profileName

  if (!user) return ''

  const metadataName = String(
    user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.user_metadata?.user_name ??
      ''
  ).trim()

  return metadataName || user.email || 'Signed in user'
}
