// utils/date.js
// Asia/Colombo date as YYYY-MM-DD without extra deps
export function getTodayColombo() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(new Date()); // "YYYY-MM-DD"
}
