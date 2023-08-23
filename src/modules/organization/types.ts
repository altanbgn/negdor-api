type Connection = {
  id: string
}



export type OrganizationCreatePayload = {
  name: string
  shortDescription: string
  fullDescription: string
  emails?: Array<string>
  phonenumbers?: Array<string>
  locations?: Array<string>
  features?: Array<string>
  logo?: string
  banner?: string
  images?: Array<string>
  tags?: Array<Connection>
}

export type OrganizationUpdatePayload = Partial<OrganizationCreatePayload> & { categories?: Array<string> }
