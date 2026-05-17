export interface TimeSlot {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  completed: boolean;
}

export type SlotStatus = "past" | "current" | "future";

export interface CreateSlotInput {
  startTime: number;
  endTime: number;
  title: string;
  description: string;
}

export interface UpdateSlotInput extends CreateSlotInput {
  id: number;
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
