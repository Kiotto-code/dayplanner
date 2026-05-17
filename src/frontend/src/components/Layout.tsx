import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { formatDate } from "../types";

interface LayoutProps {
  children: ReactNode;
  onAddSlot: () => void;
}

export function Layout({ children, onAddSlot }: LayoutProps) {
  const today = formatDate(Date.now());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-foreground tracking-tight leading-none">
                DayPlanner
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
            </div>
          </div>
          <Button
            onClick={onAddSlot}
            size="sm"
            className="gap-1.5 font-medium"
            data-ocid="schedule.add_slot_button"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Separator className="mb-4" />
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
