export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function daysBetween(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}