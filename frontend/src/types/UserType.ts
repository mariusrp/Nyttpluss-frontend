export type UserProfile = {
  userId: string
  normalizedUserName: string
  normalizedEmail: string
  emailConfirmed: boolean
  passwordHash: string | null
  securityStamp: string | null
  concurrencyStamp: string
  phoneNumber: string | null
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: string | null
  lockoutEnabled: boolean
  accessFailedCount: number
  email: string
  userName: string
  profilePictureUrl: string | null
}
