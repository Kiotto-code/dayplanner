import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UpdateSlotArgs {
    id: SlotId;
    startTime: bigint;
    title: string;
    endTime: bigint;
    description: string;
}
export interface TimeSlotView {
    id: SlotId;
    startTime: bigint;
    title: string;
    endTime: bigint;
    completed: boolean;
    description: string;
}
export type SlotId = bigint;
export interface CreateSlotArgs {
    startTime: bigint;
    title: string;
    endTime: bigint;
    description: string;
}
export interface backendInterface {
    createSlot(args: CreateSlotArgs): Promise<TimeSlotView>;
    deleteSlot(id: SlotId): Promise<boolean>;
    listSlots(): Promise<Array<TimeSlotView>>;
    toggleSlotComplete(id: SlotId): Promise<TimeSlotView | null>;
    updateSlot(args: UpdateSlotArgs): Promise<TimeSlotView | null>;
}
