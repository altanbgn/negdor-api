export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  avatar?: string
  email: string
  firstname: string
  lastname: string
  username: string
  phonenumber?: string
  password: string
}

export type ChangePasswordPayload = {
  oldPassword: string
  newPassword: string
}

export type ForgotPasswordPayload = { email: string }
export type RecoverPasswordQuery = { token: string }
export type RecoverPasswordPayload = { password: string }
