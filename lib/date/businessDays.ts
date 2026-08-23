export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) remaining -= 1;
  }
  return result;
}

export function businessDaysRemaining(now: Date, target: Date): number {
  if (now >= target) return 0;
  let count = 0;
  const cursor = new Date(now);
  while (cursor < target) {
    cursor.setDate(cursor.getDate() + 1);
    const dayOfWeek = cursor.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count += 1;
  }
  return count;
}
