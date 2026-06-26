export const getRateConfig = (rate: number) => {
  if (rate === 0) return 0
  if (rate <= 3) return 1
  if (rate <= 10) return 2
  if (rate <= 50) return 3
  if (rate <= 100) return 4
  return 5
}