import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Clock, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddSlotModal } from "../components/AddSlotModal";
import { Layout } from "../components/Layout";
import {
  useCreateSlot,
  useDeleteSlot,
  useSlots,
  useToggleSlot,
  useUpdateSlot,
} from "../hooks/useSchedule";
import {
  type TimeSlot,
  type UpdateSlotInput,
  formatTime,
  getSlotStatus,
} from "../types";

function SlotCard({
  slot,
  index,
  onEdit,
  onDelete,
  onToggle,
}: {
  slot: TimeSlot;
  index: number;
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) {
  const status = getSlotStatus(slot.startTime, slot.endTime);
  const isCompleted = slot.completed;

  const containerClass = [
    "relative rounded-xl border transition-smooth group overflow-hidden",
    status === "current" && !isCompleted
      ? "bg-primary/5 border-primary/30 shadow-md slot-current"
      : status === "past" && !isCompleted
        ? "bg-muted/30 border-border/60 opacity-65"
        : isCompleted
          ? "bg-accent/5 border-accent/25"
          : "bg-card border-border hover:border-primary/20 hover:shadow-sm",
  ].join(" ");

  return (
    <div className={containerClass} data-ocid={`schedule.item.${index}`}>
      {/* Side accent bar */}
      {status === "current" && !isCompleted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
      )}
      {isCompleted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-xl" />
      )}

      <div className="pl-4 pr-3 pt-3 pb-0">
        {/* Time row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm font-display font-semibold text-foreground">
            <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span
              className={
                status === "past" && !isCompleted ? "text-muted-foreground" : ""
              }
            >
              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {status === "current" && !isCompleted && (
              <Badge
                variant="outline"
                className="text-xs border-primary/40 text-primary bg-primary/10"
              >
                Now
              </Badge>
            )}
            {isCompleted && (
              <Badge
                variant="outline"
                className="text-xs border-accent/40 text-accent bg-accent/10"
              >
                Done
              </Badge>
            )}
          </div>
        </div>

        {/* Title with toggle */}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            type="button"
            onClick={() => onToggle(slot.id)}
            className="text-muted-foreground hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded shrink-0"
            aria-label={slot.completed ? "Mark incomplete" : "Mark complete"}
            data-ocid={`schedule.toggle.${index}`}
          >
            {slot.completed ? (
              <CheckCircle2 className="w-4 h-4 text-accent" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </button>
          <p
            className={[
              "font-display font-semibold text-base leading-snug",
              slot.completed
                ? "line-through text-muted-foreground"
                : status === "past"
                  ? "text-muted-foreground"
                  : "text-foreground",
            ].join(" ")}
          >
            {slot.title}
          </p>
        </div>

        {/* Description */}
        {slot.description && (
          <p className="text-sm text-muted-foreground mt-1 ml-6 line-clamp-2">
            {slot.description}
          </p>
        )}
      </div>

      {/* Action bar */}
      <div className="flex border-t border-border/60 mt-3">
        <button
          type="button"
          onClick={() => onEdit(slot)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          aria-label="Edit slot"
          data-ocid={`schedule.edit_button.${index}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Edit</span>
        </button>
        <div className="w-px bg-border/60" />
        <button
          type="button"
          onClick={() => onDelete(slot.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          aria-label="Delete slot"
          data-ocid={`schedule.delete_button.${index}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="schedule.empty_state"
    >
      <img
        src="/assets/generated/hero-schedule.dim_1200x400.jpg"
        alt="Empty schedule"
        className="w-full max-w-md rounded-2xl object-cover mb-8 shadow-sm opacity-80"
      />
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Your day is wide open
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        Add your first time slot to start planning your day. Stay focused and
        make every hour count.
      </p>
      <Button onClick={onAdd} data-ocid="schedule.empty_add_button">
        Add Your First Slot
      </Button>
    </div>
  );
}

export default function SchedulePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data: slots, isLoading, isError } = useSlots();
  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlot();
  const deleteSlot = useDeleteSlot();
  const toggleSlot = useToggleSlot();

  function openAdd() {
    setEditSlot(null);
    setModalOpen(true);
  }

  function openEdit(slot: TimeSlot) {
    setEditSlot(slot);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditSlot(null);
  }

  async function handleSubmit(data: {
    startTime: number;
    endTime: number;
    title: string;
    description: string;
  }) {
    try {
      if (editSlot) {
        const input: UpdateSlotInput = { id: editSlot.id, ...data };
        await updateSlot.mutateAsync(input);
        toast.success("Slot updated");
      } else {
        await createSlot.mutateAsync(data);
        toast.success("Slot added");
      }
      handleClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function confirmDelete() {
    if (deleteTarget === null) return;
    try {
      await deleteSlot.mutateAsync(deleteTarget);
      toast.success("Slot deleted");
    } catch {
      toast.error("Failed to delete slot");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleToggle(id: number) {
    try {
      await toggleSlot.mutateAsync(id);
    } catch {
      toast.error("Failed to update slot");
    }
  }

  const isMutating = createSlot.isPending || updateSlot.isPending;

  return (
    <Layout onAddSlot={openAdd}>
      {isLoading ? (
        <div className="space-y-3" data-ocid="schedule.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
          data-ocid="schedule.error_state"
        >
          <p className="text-destructive font-medium">
            Failed to load schedule.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please refresh the page.
          </p>
        </div>
      ) : !slots || slots.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="space-y-3" data-ocid="schedule.list">
          {slots.map((slot, i) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              index={i + 1}
              onEdit={openEdit}
              onDelete={(id) => setDeleteTarget(id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <AddSlotModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editSlot={editSlot}
        isLoading={isMutating}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="schedule.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this time slot?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The slot will be permanently removed
              from your schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="schedule.delete_cancel_button"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="schedule.delete_confirm_button"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
