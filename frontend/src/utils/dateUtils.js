export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN");
}

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}