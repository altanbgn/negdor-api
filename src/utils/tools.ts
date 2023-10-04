export const handleConverter = (value: string) => {
  return value
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}
