import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  ALLOWED_PROOF_MIME_TYPES,
  convertToMiles,
  MAX_DISTANCE_MILES,
  MAX_PROOF_FILE_BYTES,
} from '@/lib/challenge'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/user-display'
import { GOAL } from '@/app/_lib/dashboard-constants'
import type { DashboardFormState, DashboardState, ProofItem, Stats } from '@/app/_lib/dashboard-types'

const DEFAULT_FORM: DashboardFormState = {
  name: '',
  trust: '',
  activity_type: '',
  distance_miles: '',
  distance_unit: 'MI',
}

export function useDashboardState(): DashboardState {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [daysRemaining] = useState(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    return 365 - dayOfYear
  })
  const [form, setForm] = useState<DashboardFormState>(DEFAULT_FORM)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitWarning, setSubmitWarning] = useState('')
  const [formError, setFormError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [proofs, setProofs] = useState<ProofItem[]>([])
  const [proofsLoading, setProofsLoading] = useState(false)
  const [proofRefreshKey, setProofRefreshKey] = useState(0)
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null)

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

    const syncUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!active) return

      setUser(currentUser ?? null)
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

    const channel = supabase
      .channel('miles_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'miles_submissions' }, () => {
        void loadStats()
      })
      .subscribe()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      setAuthLoading(false)
      setAuthBusy(false)
      setAuthError('')
    })

    return () => {
      active = false
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadProofs = async () => {
      if (!user) {
        setProofs([])
        setProofsLoading(false)
        return
      }

      setProofsLoading(true)

      try {
        const response = await fetch('/api/proofs')

        if (!active) return

        if (!response.ok) {
          setProofs([])
          return
        }

        const data = await response.json()

        if (!active) return

        setProofs(data.proofs ?? [])
      } finally {
        if (active) setProofsLoading(false)
      }
    }

    void loadProofs()

    return () => {
      active = false
    }
  }, [user, proofRefreshKey])

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
    if (!user) return

    const suggestedName = getUserDisplayName(user)
    if (!suggestedName) return

    setForm(currentForm => {
      if (currentForm.name.trim()) return currentForm
      return { ...currentForm, name: suggestedName }
    })
  }, [user])

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

    setProofs([])
  }

  const handleProofSelected = (event: ChangeEvent<HTMLInputElement>) => {
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

    if (file.size > MAX_PROOF_FILE_BYTES) {
      setProofFile(null)
      setFormError('Proof image must be 10MB or smaller.')
      event.target.value = ''
      return
    }

    setProofFile(file)
  }

  const handleSubmit = async () => {
    setFormError('')
    setSubmitWarning('')

    if (!form.name || !form.trust || !form.activity_type || !form.distance_miles) {
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
    payload.set('trust', form.trust)
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
      setProofRefreshKey(current => current + 1)

      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
        setSubmitWarning('')
        setProofFile(null)
        setForm({
          ...DEFAULT_FORM,
          name: user ? getUserDisplayName(user) : '',
        })
      }, 2500)

      return
    }

    setFormError(data.error ?? 'Something went wrong.')
  }

  const totalMiles = stats?.totalMiles ?? 0
  const pct = Math.min((totalMiles / GOAL) * 100, 100)
  const userLabel = getUserDisplayName(user)

  const setFormField: DashboardState['setFormField'] = (field, value) => {
    setForm(currentForm => ({
      ...currentForm,
      [field]: value,
    }))
  }

  return {
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
    authLoading,
    authBusy,
    authError,
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
    handleProofSelected,
    handleSubmit,
  }
}
