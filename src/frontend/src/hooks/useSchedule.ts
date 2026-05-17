import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateSlotInput, TimeSlot, UpdateSlotInput } from "../types";

const QUERY_KEY = ["slots"];

function toTimeSlot(raw: {
  id: bigint;
  startTime: bigint;
  endTime: bigint;
  title: string;
  description: string;
  completed: boolean;
}): TimeSlot {
  return {
    id: Number(raw.id),
    startTime: Number(raw.startTime),
    endTime: Number(raw.endTime),
    title: raw.title,
    description: raw.description,
    completed: raw.completed,
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
          }) => Promise<{
            id: bigint;
            startTime: bigint;
            endTime: bigint;
            title: string;
            description: string;
            completed: boolean;
          }>;
        }
      ).createSlot({
        startTime: BigInt(input.startTime),
        endTime: BigInt(input.endTime),
        title: input.title,
        description: input.description,
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
          }) => Promise<
            | {
                __kind__: "Some";
                value: {
                  id: bigint;
                  startTime: bigint;
                  endTime: bigint;
                  title: string;
                  description: string;
                  completed: boolean;
                };
              }
            | { __kind__: "None" }
          >;
        }
      ).updateSlot({
        id: BigInt(input.id),
        startTime: BigInt(input.startTime),
        endTime: BigInt(input.endTime),
        title: input.title,
        description: input.description,
      });
      if (result.__kind__ === "Some") return toTimeSlot(result.value);
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
          toggleSlotComplete: (id: bigint) => Promise<
            | {
                __kind__: "Some";
                value: {
                  id: bigint;
                  startTime: bigint;
                  endTime: bigint;
                  title: string;
                  description: string;
                  completed: boolean;
                };
              }
            | { __kind__: "None" }
          >;
        }
      ).toggleSlotComplete(BigInt(id));
      if (result.__kind__ === "Some") return toTimeSlot(result.value);
      return null;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
