import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000); // nanoseconds
const hour = BigInt(60 * 60 * 1_000_000_000);

const sampleSlots = [
  {
    id: BigInt(1),
    title: "Morning Workout",
    description: "Cardio + strength training",
    startTime: now - hour * BigInt(3),
    endTime: now - hour * BigInt(2),
    completed: true,
  },
  {
    id: BigInt(2),
    title: "Team Standup",
    description: "Daily sync with the team",
    startTime: now - hour,
    endTime: now - BigInt(30) * BigInt(60 * 1_000_000_000),
    completed: true,
  },
  {
    id: BigInt(3),
    title: "Deep Work: Frontend",
    description: "Focus session on timetable UI",
    startTime: now - BigInt(15) * BigInt(60 * 1_000_000_000),
    endTime: now + BigInt(45) * BigInt(60 * 1_000_000_000),
    completed: false,
  },
  {
    id: BigInt(4),
    title: "Lunch Break",
    description: "Step away, eat, recharge",
    startTime: now + hour,
    endTime: now + hour * BigInt(2),
    completed: false,
  },
  {
    id: BigInt(5),
    title: "Code Review",
    description: "Review PRs from the team",
    startTime: now + hour * BigInt(2),
    endTime: now + hour * BigInt(3),
    completed: false,
  },
];

export const mockBackend: backendInterface = {
  listSlots: async () => sampleSlots,
  createSlot: async (args) => ({
    id: BigInt(Date.now()),
    title: args.title,
    description: args.description,
    startTime: args.startTime,
    endTime: args.endTime,
    completed: false,
  }),
  deleteSlot: async (_id) => true,
  toggleSlotComplete: async (id) => {
    const slot = sampleSlots.find((s) => s.id === id);
    if (!slot) return null;
    return { ...slot, completed: !slot.completed };
  },
  updateSlot: async (args) => {
    const slot = sampleSlots.find((s) => s.id === args.id);
    if (!slot) return null;
    return { ...slot, ...args };
  },
};
