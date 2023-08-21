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
