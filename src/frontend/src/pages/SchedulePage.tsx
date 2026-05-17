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
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Edit2,
  Trash2,
  User,
} from "lucide-react";
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
  type SlotCategory,
  type TimeSlot,
  type UpdateSlotInput,
  formatTime,
  getCategoryLabel,
  getSlotStatus,
} from "../types";

// ─── Category helpers ───────────────────────────────────────────────────────

const CATEGORY_META: Record<
  SlotCategory,
  { label: string; icon: React.ReactNode; style: React.CSSProperties }
> = {
  work: {
    label: "Work",
    icon: <Briefcase className="w-3 h-3" />,
    style: {
      borderColor: "var(--category-work)",
      color: "var(--category-work)",
      backgroundColor: "var(--category-work-bg)",
    },
  },
  personal: {
    label: "Personal",
    icon: <User className="w-3 h-3" />,
    style: {
      borderColor: "var(--category-personal)",
      color: "var(--category-personal)",
      backgroundColor: "var(--category-personal-bg)",
    },
  },
  study: {
    label: "Study",
    icon: <BookOpen className="w-3 h-3" />,
    style: {
      borderColor: "var(--category-study)",
      color: "var(--category-study)",
      backgroundColor: "var(--category-study-bg)",
    },
  },
};

function CategoryBadge({ category }: { category: SlotCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-medium leading-none"
      style={meta.style}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

// ─── Date utilities ──────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekStart(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  const day = r.getDay(); // 0=Sun
  r.setDate(r.getDate() - day + 1); // Mon as week start
  if (day === 0) r.setDate(r.getDate() - 6);
  return r;
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatWeekLabel(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  return `${formatShortDate(weekStart)} – ${formatShortDate(end)}`;
}

function formatDayLabel(d: Date): string {
  const today = startOfDay(new Date());
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, addDays(today, 1))) return "Tomorrow";
  if (isSameDay(d, addDays(today, -1))) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── SlotCard ────────────────────────────────────────────────────────────────

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
      ? "bg-primary/5 border-primary/30 shadow-md"
      : status === "past" && !isCompleted
        ? "bg-muted/30 border-border/60 opacity-65"
        : isCompleted
          ? "bg-accent/5 border-accent/25"
          : "bg-card border-border hover:border-primary/20 hover:shadow-sm",
  ].join(" ");

  return (
    <div className={containerClass} data-ocid={`schedule.item.${index}`}>
      {status === "current" && !isCompleted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
      )}
      {isCompleted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-xl" />
      )}

      <div className="pl-4 pr-3 pt-3 pb-0">
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
            <CategoryBadge category={slot.category} />
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

        {slot.description && (
          <p className="text-sm text-muted-foreground mt-1 ml-6 line-clamp-2">
            {slot.description}
          </p>
        )}
      </div>

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

// ─── Empty state ─────────────────────────────────────────────────────────────

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

// ─── Week view cell ──────────────────────────────────────────────────────────

function WeekDayCell({
  day,
  slots,
  isToday,
  isSelected,
  onClick,
}: {
  day: Date;
  slots: TimeSlot[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex flex-col rounded-xl border p-3 text-left min-h-[120px] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "bg-primary/5 border-primary/40 shadow-sm"
          : isToday
            ? "bg-accent/5 border-accent/25"
            : "bg-card border-border hover:border-primary/20 hover:shadow-sm",
      ].join(" ")}
      data-ocid={`week.day_cell.${day.getDay()}`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className={[
            "text-xs font-medium uppercase tracking-wide",
            isToday ? "text-accent" : "text-muted-foreground",
          ].join(" ")}
        >
          {day.toLocaleDateString([], { weekday: "short" })}
        </span>
        <span
          className={[
            "text-sm font-display font-semibold",
            isSelected
              ? "text-primary"
              : isToday
                ? "text-accent"
                : "text-foreground",
          ].join(" ")}
        >
          {day.getDate()}
        </span>
        {slots.length > 0 && (
          <span className="ml-auto text-[10px] text-muted-foreground font-medium">
            {slots.length}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {slots.slice(0, 3).map((s) => (
          <div
            key={s.id}
            className="text-[10px] leading-tight px-1.5 py-0.5 rounded font-medium truncate border"
            style={CATEGORY_META[s.category].style}
          >
            {formatTime(s.startTime)} {s.title}
          </div>
        ))}
        {slots.length > 3 && (
          <span className="text-[10px] text-muted-foreground pl-1">
            +{slots.length - 3} more
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Category filter bar ─────────────────────────────────────────────────────

const ALL_CATEGORIES: (SlotCategory | "all")[] = [
  "all",
  "work",
  "personal",
  "study",
];

function CategoryFilter({
  active,
  onChange,
}: {
  active: SlotCategory | "all";
  onChange: (c: SlotCategory | "all") => void;
}) {
  return (
    <div
      className="flex gap-1.5 flex-wrap"
      data-ocid="schedule.category_filter"
    >
      {ALL_CATEGORIES.map((c) => {
        const isActive = active === c;
        const meta = c === "all" ? null : CATEGORY_META[c];
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={[
              "flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !isActive
                ? "border-border text-muted-foreground hover:border-border/70"
                : "",
            ]
              .join(" ")
              .trim()}
            style={
              isActive
                ? meta
                  ? meta.style
                  : {
                      borderColor: "oklch(var(--primary) / 0.4)",
                      color: "oklch(var(--primary))",
                      backgroundColor: "oklch(var(--primary) / 0.1)",
                    }
                : undefined
            }
            data-ocid={`schedule.filter.${c}`}
          >
            {meta?.icon}
            {c === "all" ? "All" : getCategoryLabel(c)}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const today = startOfDay(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [categoryFilter, setCategoryFilter] = useState<SlotCategory | "all">(
    "all",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data: slots, isLoading, isError } = useSlots();
  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlot();
  const deleteSlot = useDeleteSlot();
  const toggleSlot = useToggleSlot();

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const slotsForDay = (day: Date) =>
    (slots ?? []).filter((s) => isSameDay(new Date(s.startTime), day));

  const filteredSlots = (slots ?? [])
    .filter((s) => isSameDay(new Date(s.startTime), currentDate))
    .filter((s) => categoryFilter === "all" || s.category === categoryFilter);

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
    category: SlotCategory;
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
      {/* View/Nav controls */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Row 1: view toggle + today */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex rounded-lg border border-border overflow-hidden text-sm"
            data-ocid="schedule.view_toggle"
          >
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={[
                "px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                viewMode === "day"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
              data-ocid="schedule.day_view_tab"
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={[
                "px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                viewMode === "week"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
              data-ocid="schedule.week_view_tab"
            >
              Week
            </button>
          </div>

          {!isSameDay(currentDate, today) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentDate(today)}
              className="text-xs h-8"
              data-ocid="schedule.today_button"
            >
              Today
            </Button>
          )}
        </div>

        {/* Row 2: date navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentDate((d) =>
                viewMode === "day"
                  ? addDays(d, -1)
                  : addDays(getWeekStart(d), -7),
              )
            }
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous"
            data-ocid="schedule.pagination_prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="flex-1 text-center text-sm font-display font-semibold text-foreground">
            {viewMode === "day"
              ? formatDayLabel(currentDate)
              : formatWeekLabel(weekStart)}
          </p>
          <button
            type="button"
            onClick={() =>
              setCurrentDate((d) =>
                viewMode === "day"
                  ? addDays(d, 1)
                  : addDays(getWeekStart(d), 7),
              )
            }
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next"
            data-ocid="schedule.pagination_next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Row 3: category filter (day view only) */}
        {viewMode === "day" && (
          <CategoryFilter
            active={categoryFilter}
            onChange={setCategoryFilter}
          />
        )}
      </div>

      {/* ── Week view ── */}
      {viewMode === "week" &&
        (isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2"
            data-ocid="schedule.week_loading_state"
          >
            {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => (
              <div
                key={`skeleton-${day}`}
                className="rounded-xl border border-border bg-card p-3 min-h-[120px] space-y-2"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-ocid="schedule.week_error_state"
          >
            <p className="text-destructive font-medium">
              Failed to load schedule.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please refresh the page.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2"
            data-ocid="schedule.week_grid"
          >
            {weekDays.map((day) => (
              <WeekDayCell
                key={day.toISOString()}
                day={day}
                slots={slotsForDay(day)}
                isToday={isSameDay(day, today)}
                isSelected={isSameDay(day, currentDate)}
                onClick={() => {
                  setCurrentDate(day);
                  setViewMode("day");
                }}
              />
            ))}
          </div>
        ))}

      {/* ── Day view ── */}
      {viewMode === "day" &&
        (isLoading ? (
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
        ) : filteredSlots.length === 0 ? (
          (slots ?? []).filter((s) =>
            isSameDay(new Date(s.startTime), currentDate),
          ).length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div
              className="flex flex-col items-center justify-center py-14 text-center"
              data-ocid="schedule.filtered_empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No <strong>{categoryFilter}</strong> tasks today.
              </p>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className="mt-2 text-xs text-primary hover:underline focus-visible:outline-none"
              >
                Show all tasks
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3" data-ocid="schedule.list">
            {filteredSlots.map((slot, i) => (
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
        ))}

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
