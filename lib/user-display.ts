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

export function getProviderDisplayName(user: DisplayUser | null) {
  if (!user) return ''

  return String(
    user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.user_metadata?.user_name ??
      ''
  ).trim()
}

export function getUserDisplayName(user: DisplayUser | null, profile?: DisplayProfile | null) {
  const profileName = getProfileDisplayName(profile ?? null)
  if (profileName) return profileName

  if (!user) return ''

  return getProviderDisplayName(user) || user.email || 'Signed in user'
}

export function splitDisplayName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}
