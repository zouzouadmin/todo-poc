function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toDateOnlyString(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function formatDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
