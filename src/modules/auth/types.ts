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

export type DecodedData = {
  email: string
  iat: number
  exp: number
}

export type ForgotPasswordPayload = { email: string }
export type RecoverPasswordPayload = { password: string }
