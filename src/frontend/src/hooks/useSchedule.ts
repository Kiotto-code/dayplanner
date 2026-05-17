import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateSlotInput,
  SlotCategory,
  TimeSlot,
  UpdateSlotInput,
} from "../types";

const QUERY_KEY = ["slots"];

function toTimeSlot(raw: {
  id: bigint;
  startTime: bigint;
  endTime: bigint;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}): TimeSlot {
  const categoryMap: Record<string, SlotCategory> = {
    work: "work",
    personal: "personal",
    study: "study",
  };
  return {
    id: Number(raw.id),
    startTime: Number(raw.startTime),
    endTime: Number(raw.endTime),
    title: raw.title,
    description: raw.description,
    completed: raw.completed,
    category: categoryMap[raw.category] ?? "personal",
  };
}

export function useSlots() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TimeSlot[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const result = await (
        actor as unknown as {
          listSlots: () => Promise<
            {
              id: bigint;
              startTime: bigint;
              endTime: bigint;
              title: string;
              description: string;
              completed: boolean;
              category: string;
            }[]
          >;
        }
      ).listSlots();
      return result.map(toTimeSlot).sort((a, b) => a.startTime - b.startTime);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSlotInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          createSlot: (args: {
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            category: string;
          }) => Promise<{
            id: bigint;
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            completed: boolean;
            category: string;
          }>;
        }
      ).createSlot({
        startTime: BigInt(input.startTime),
        endTime: BigInt(input.endTime),
        title: input.title,
        description: input.description,
        category: input.category,
      });
      return toTimeSlot(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateSlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateSlotInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          updateSlot: (args: {
            id: bigint;
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            category: string;
          }) => Promise<{
            id: bigint;
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            completed: boolean;
            category: string;
          } | null>;
        }
      ).updateSlot({
        id: BigInt(input.id),
        startTime: BigInt(input.startTime),
        endTime: BigInt(input.endTime),
        title: input.title,
        description: input.description,
        category: input.category,
      });
      if (result) return toTimeSlot(result);
      return null;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteSlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as { deleteSlot: (id: bigint) => Promise<boolean> }
      ).deleteSlot(BigInt(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useToggleSlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as {
          toggleSlotComplete: (id: bigint) => Promise<{
            id: bigint;
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            completed: boolean;
            category: string;
          } | null>;
        }
      ).toggleSlotComplete(BigInt(id));
      if (result) return toTimeSlot(result);
      return null;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
