export type LoginBody = {
  email: string
  password: string
}

export type RegisterBody = {
  avatar?: string
  email: string
  firstname: string
  lastname: string
  username: string
  phonenumber?: string
  password: string
}

export type ChangePasswordBody = {
  oldPassword: string
  newPassword: string
}
