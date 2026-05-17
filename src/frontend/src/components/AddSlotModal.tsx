import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { type TimeSlot, msToTimeInput, timeInputToMs } from "../types";

interface AddSlotModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    startTime: number;
    endTime: number;
    title: string;
    description: string;
  }) => void;
  editSlot?: TimeSlot | null;
  isLoading?: boolean;
}

interface FormState {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface FormErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  timeOrder?: string;
}

const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
};

export function AddSlotModal({
  open,
  onClose,
  onSubmit,
  editSlot,
  isLoading,
}: AddSlotModalProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  useEffect(() => {
    if (open) {
      if (editSlot) {
        setForm({
          title: editSlot.title,
          description: editSlot.description,
          startTime: msToTimeInput(editSlot.startTime),
          endTime: msToTimeInput(editSlot.endTime),
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
      setTouched({});
    }
  }, [open, editSlot]);

  function validate(f: FormState): FormErrors {
    const e: FormErrors = {};
    if (!f.title.trim()) e.title = "Title is required";
    if (!f.startTime) e.startTime = "Start time is required";
    if (!f.endTime) e.endTime = "End time is required";
    if (f.startTime && f.endTime) {
      const today = new Date();
      const start = timeInputToMs(f.startTime, today);
      const end = timeInputToMs(f.endTime, today);
      if (end <= start) e.timeOrder = "End time must be after start time";
    }
    return e;
  }

  function handleBlur(field: keyof FormState) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  }

  function handleChange(field: keyof FormState, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = {
      title: true,
      startTime: true,
      endTime: true,
      description: true,
    };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const today = new Date();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      startTime: timeInputToMs(form.startTime, today),
      endTime: timeInputToMs(form.endTime, today),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="slot.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {editSlot ? "Edit Time Slot" : "Add Time Slot"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="slot-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slot-title"
              placeholder="e.g. Deep Work Session"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              data-ocid="slot.title_input"
              aria-invalid={!!errors.title}
            />
            {touched.title && errors.title && (
              <p
                className="text-xs text-destructive"
                data-ocid="slot.title_field_error"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="slot-start">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slot-start"
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                onBlur={() => handleBlur("startTime")}
                data-ocid="slot.start_time_input"
                aria-invalid={!!errors.startTime}
              />
              {touched.startTime && errors.startTime && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="slot.start_time_field_error"
                >
                  {errors.startTime}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slot-end">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slot-end"
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                onBlur={() => handleBlur("endTime")}
                data-ocid="slot.end_time_input"
                aria-invalid={!!errors.endTime}
              />
              {touched.endTime && errors.endTime && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="slot.end_time_field_error"
                >
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {touched.startTime && touched.endTime && errors.timeOrder && (
            <p
              className="text-xs text-destructive -mt-2"
              data-ocid="slot.time_order_field_error"
            >
              {errors.timeOrder}
            </p>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="slot-desc">
              Description{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="slot-desc"
              placeholder="Add notes or details..."
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              data-ocid="slot.description_textarea"
              className="resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              data-ocid="slot.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-ocid="slot.submit_button"
            >
              {isLoading ? "Saving…" : editSlot ? "Save Changes" : "Add Slot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
