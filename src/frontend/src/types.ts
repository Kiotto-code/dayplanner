export type SlotCategory = "work" | "personal" | "study";

export interface TimeSlot {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  completed: boolean;
  category: SlotCategory;
}

export type SlotStatus = "past" | "current" | "future";

export interface CreateSlotInput {
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  category: SlotCategory;
}

export interface UpdateSlotInput extends CreateSlotInput {
  id: number;
}

export function getCategoryLabel(category: SlotCategory): string {
  switch (category) {
    case "work":
      return "Work";
    case "personal":
      return "Personal";
    case "study":
      return "Study";
  }
}

export function getCategoryColor(category: SlotCategory): string {
  switch (category) {
    case "work":
      return "category-work";
    case "personal":
      return "category-personal";
    case "study":
      return "category-study";
  }
}

export function getSlotStatus(startTime: number, endTime: number): SlotStatus {
  const now = Date.now();
  if (now > endTime) return "past";
  if (now >= startTime && now <= endTime) return "current";
  return "future";
}

export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function timeInputToMs(timeStr: string, date: Date): number {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function msToTimeInput(ms: number): string {
  const d = new Date(ms);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
