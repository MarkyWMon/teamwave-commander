import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import Pitches from "./pages/Pitches";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/pitches" element={<Pitches />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;