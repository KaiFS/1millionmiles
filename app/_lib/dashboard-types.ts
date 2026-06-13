import type { User } from '@supabase/supabase-js'
import type { DistanceUnit } from '@/lib/challenge'

export type Submission = {
  name: string
  trust: string
  activity_type: string
  distance_miles: number
  created_at: string
}

export type Stats = {
  totalMiles: number
  participantCount: number
  leaderboard: { name: string; miles: number; trust: string }[]
  trusts: { name: string; miles: number }[]
  recent: Submission[]
}

export type PersonalStats = {
  totalMiles: number | null
  rank: number | null
  totalParticipants: number
}

export type ProofItem = {
  submission_id: string
  name: string
  trust: string
  activity_type: string
  distance_miles: number
  created_at: string
  proof_uploaded_at: string
  proof_url: string
}

export type UserProfile = {
  first_name: string
  last_name: string
}

export type DashboardFormState = {
  name: string
  activity_type: string
  distance_miles: string
  distance_unit: DistanceUnit
}

export type DashboardState = {
  isHydrated: boolean
  stats: Stats | null
  loading: boolean
  showForm: boolean
  setShowForm: (value: boolean) => void
  daysRemaining: number
  form: DashboardFormState
  setFormField: <K extends keyof DashboardFormState>(field: K, value: DashboardFormState[K]) => void
  proofFile: File | null
  submitting: boolean
  submitted: boolean
  submitWarning: string
  formError: string
  user: User | null
  profile: UserProfile | null
  profileLoading: boolean
  profileSaving: boolean
  profileError: string
  showProfilePrompt: boolean
  authLoading: boolean
  authBusy: boolean
  authError: string
  proofs: ProofItem[]
  proofsLoading: boolean
  proofsLoaded: boolean
  selectedProof: ProofItem | null
  setSelectedProof: (proof: ProofItem | null) => void
  personalStats: PersonalStats
  personalStatsLoading: boolean
  enteredDistance: number
  convertedMiles: number
  totalMiles: number
  pct: number
  userLabel: string
  handleGoogleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
  handleProfileSave: (firstName: string, lastName: string) => Promise<void>
  handleProofSelected: (event: React.ChangeEvent<HTMLInputElement>) => void
  loadProofs: () => Promise<void>
  handleSubmit: () => Promise<void>
}
