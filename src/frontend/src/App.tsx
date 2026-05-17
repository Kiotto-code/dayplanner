import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SchedulePage from "./pages/SchedulePage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SchedulePage />
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}
