// Exclude keys from user
export default function(
  data: any,
  keys: Array<string>
) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !keys.includes(key))
  )
}
