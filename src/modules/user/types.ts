export type UserUpdatePayload = {
  avatar?: string
  email?: string
  firstname?: string
  lastname?: string
  username?: string
  phonenumber?: string
  password?: string
}

export type ChangePasswordPayload = {
  newPassword: string
  oldPassword?: string
}
