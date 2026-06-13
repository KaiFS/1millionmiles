import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  ALLOWED_PROOF_MIME_TYPES,
  convertToMiles,
  MAX_DISTANCE_MILES,
  MAX_PROOF_FILE_BYTES,
  MAX_PROOF_SOURCE_FILE_BYTES,
} from '@/lib/challenge'
import { compressProofImage } from '@/lib/proof-compression'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/user-display'
import { GOAL } from '@/app/_lib/dashboard-constants'
import type { DashboardFormState, DashboardState, PersonalStats, ProofItem, Stats, UserProfile } from '@/app/_lib/dashboard-types'

const DEFAULT_FORM: DashboardFormState = {
  name: '',
  activity_type: '',
  distance_miles: '',
  distance_unit: 'MI',
}

export function useDashboardState(): DashboardState {
  const [isHydrated, setIsHydrated] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(365)
  const [form, setForm] = useState<DashboardFormState>(DEFAULT_FORM)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitWarning, setSubmitWarning] = useState('')
  const [formError, setFormError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null)
  const [personalStatsLoading, setPersonalStatsLoading] = useState(false)
  const [proofs, setProofs] = useState<ProofItem[]>([])
  const [proofsLoading, setProofsLoading] = useState(false)
  const [proofRefreshKey, setProofRefreshKey] = useState(0)
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    let active = true

    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()

        if (!active) return

        setStats(data)
      } finally {
        if (active) setLoading(false)
      }
    }

    const loadPersonalStats = async (currentUser: User | null) => {
      if (!currentUser) {
        if (!active) return
        setPersonalStats(null)
        setPersonalStatsLoading(false)
        return
      }

      setPersonalStatsLoading(true)

      try {
        const response = await fetch('/api/me/stats')

        if (!active) return

        if (response.ok) {
          setPersonalStats(await response.json())
        } else {
          setPersonalStats(null)
        }
      } finally {
        if (active) setPersonalStatsLoading(false)
      }
    }

    const loadProfile = async (currentUser: User | null) => {
      if (!currentUser) {
        if (!active) return
        setProfile(null)
        setProfileLoading(false)
        setProfileError('')
        setShowProfilePrompt(false)
        return
      }

      setProfileLoading(true)

      try {
        const response = await fetch('/api/profile')
        const data = await response.json()

        if (!active) return

        if (!response.ok) {
          setProfile(null)
          setShowProfilePrompt(false)
          setProfileError(data.error ?? 'Could not load your profile.')
          return
        }

        const nextProfile = data.profile ?? null
        setProfile(nextProfile)
        setProfileError('')
        setShowProfilePrompt(!nextProfile)
      } finally {
        if (active) setProfileLoading(false)
      }
    }

    const syncUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!active) return

      setUser(currentUser ?? null)
      void loadProfile(currentUser ?? null)
      void loadPersonalStats(currentUser ?? null)
      setAuthLoading(false)
    }

    if (typeof window !== 'undefined') {
      const authErrorCode = new URLSearchParams(window.location.search).get('auth_error')
      if (authErrorCode) {
        setAuthError('Google sign-in could not be completed. Please try again.')
      }
    }

    void loadStats()
    void syncUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      const currentUser = session?.user ?? null
      setUser(currentUser)
      void loadProfile(currentUser)
      void loadPersonalStats(currentUser)
      setAuthLoading(false)
      setAuthBusy(false)
      setAuthError('')
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const today = new Date()
    const challengeEnd = new Date('2027-06-01T00:00:00')
    const diffDays = Math.ceil((challengeEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    setDaysRemaining(Math.max(0, diffDays))
  }, [])

  const loadProofs = useCallback(async () => {
    if (!user) {
      setProofs([])
      setProofsLoading(false)
      return
    }

    setProofsLoading(true)

    try {
      const response = await fetch('/api/proofs', { cache: 'no-store' })

      if (!response.ok) {
        setProofs([])
        return
      }

      const data = await response.json()
      setProofs(data.proofs ?? [])
    } finally {
      setProofsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) return
    setProofs([])
    setProofsLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    void loadProofs()
  }, [user, proofRefreshKey, loadProofs])

  useEffect(() => {
    if (!selectedProof) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProof(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProof])

  useEffect(() => {
    const suggestedName = getUserDisplayName(user, profile)
    if (!suggestedName) return

    setForm(currentForm => {
      if (currentForm.name.trim()) return currentForm
      return { ...currentForm, name: suggestedName }
    })
  }, [user, profile])

  const enteredDistance = Number(form.distance_miles)
  const convertedMiles = Number.isFinite(enteredDistance)
    ? convertToMiles(enteredDistance, form.distance_unit)
    : 0

  const handleGoogleSignIn = async () => {
    setAuthBusy(true)
    setAuthError('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    })

    if (error) {
      setAuthBusy(false)
      setAuthError(error.message)
    }
  }

  const handleSignOut = async () => {
    setAuthBusy(true)
    setAuthError('')

    const { error } = await supabase.auth.signOut()

    setAuthBusy(false)

    if (error) {
      setAuthError(error.message)
      return
    }

    setProfile(null)
    setShowProfilePrompt(false)
    setProofs([])
  }

  const handleProfileSave = async (firstName: string, lastName: string) => {
    setProfileSaving(true)
    setProfileError('')

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName }),
    })

    const data = await response.json()
    setProfileSaving(false)

    if (!response.ok) {
      setProfileError(data.error ?? 'Could not save your profile.')
      return
    }

    const nextProfile = data.profile as UserProfile
    const fullName = `${nextProfile.first_name} ${nextProfile.last_name}`.trim()
    setProfile(nextProfile)
    setShowProfilePrompt(false)
    setProfileError('')
    setForm(currentForm => ({
      ...currentForm,
      name: fullName,
    }))
  }

  const handleProofSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setFormError('')

    if (!file) {
      setProofFile(null)
      return
    }

    if (!ALLOWED_PROOF_MIME_TYPES.includes(file.type as (typeof ALLOWED_PROOF_MIME_TYPES)[number])) {
      setProofFile(null)
      setFormError('Proof must be a PNG, JPG, or WEBP image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_PROOF_SOURCE_FILE_BYTES) {
      setProofFile(null)
      setFormError('Proof image must be 20MB or smaller before compression.')
      event.target.value = ''
      return
    }

    try {
      const compressedFile = await compressProofImage(file)

      if (compressedFile.size > MAX_PROOF_FILE_BYTES) {
        setProofFile(null)
        setFormError('Proof image is still too large after compression. Please choose a smaller screenshot.')
        event.target.value = ''
        return
      }

      setProofFile(compressedFile)
    } catch {
      setProofFile(null)
      setFormError('Proof image could not be compressed. Please choose a different screenshot.')
      event.target.value = ''
    }
  }

  const handleSubmit = async () => {
    setFormError('')
    setSubmitWarning('')

    if (user && !profile) {
      setFormError('Please complete your profile before logging miles.')
      setShowProfilePrompt(true)
      return
    }

    if (!form.name || !form.activity_type || !form.distance_miles) {
      setFormError('Please fill in all fields.')
      return
    }

    if (!Number.isFinite(enteredDistance) || convertedMiles <= 0 || convertedMiles > MAX_DISTANCE_MILES) {
      setFormError('Please enter a valid distance.')
      return
    }

    if (proofFile && !user) {
      setFormError('Sign in with Google to upload proof screenshots.')
      return
    }

    const payload = new FormData()
    payload.set('name', form.name.trim())
    payload.set('activity_type', form.activity_type)
    payload.set('distance_miles', String(parseFloat(form.distance_miles)))
    payload.set('distance_unit', form.distance_unit)

    if (proofFile) {
      payload.set('proof', proofFile)
    }

    setSubmitting(true)

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: payload,
    })

    const data = await response.json()
    setSubmitting(false)

    if (response.ok) {
      setSubmitWarning(data.warning ?? '')
      setSubmitted(true)
      const statsResponse = await fetch('/api/stats', { cache: 'no-store' })
      if (statsResponse.ok) {
        setStats(await statsResponse.json())
      }
      if (user) {
        const meStatsResponse = await fetch('/api/me/stats', { cache: 'no-store' })
        if (meStatsResponse.ok) {
          setPersonalStats(await meStatsResponse.json())
        }
      }
      setProofRefreshKey(current => current + 1)

      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
        setSubmitWarning('')
        setProofFile(null)
        setForm({
          ...DEFAULT_FORM,
          name: getUserDisplayName(user, profile),
        })
      }, 2500)

      return
    }

    setFormError(data.error ?? 'Something went wrong.')
  }

  const totalMiles = stats?.totalMiles ?? 0
  const pct = Math.min((totalMiles / GOAL) * 100, 100)
  const userLabel = getUserDisplayName(user, profile)

  const setFormField: DashboardState['setFormField'] = (field, value) => {
    setForm(currentForm => ({
      ...currentForm,
      [field]: value,
    }))
  }

  return {
    isHydrated,
    stats,
    loading,
    showForm,
    setShowForm,
    daysRemaining,
    form,
    setFormField,
    proofFile,
    submitting,
    submitted,
    submitWarning,
    formError,
    user,
    profile,
    profileLoading,
    profileSaving,
    profileError,
    showProfilePrompt,
    authLoading,
    authBusy,
    authError,
    personalStats,
    personalStatsLoading,
    proofs,
    proofsLoading,
    selectedProof,
    setSelectedProof,
    enteredDistance,
    convertedMiles,
    totalMiles,
    pct,
    userLabel,
    handleGoogleSignIn,
    handleSignOut,
    handleProfileSave,
    handleProofSelected,
    handleSubmit,
  }
}
