export const PREDEFINED_ROLES = [
  'Doctor', 'Nurse', 'ACP', 'Physio', 'Tech',
  'Admin', 'Housekeeper', 'Dietician', 'Pharmacist',
] as const

export type PredefinedRole = typeof PREDEFINED_ROLES[number]
