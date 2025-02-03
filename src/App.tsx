import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Teams from "@/pages/Teams";
import Pitches from "@/pages/Pitches";
import Profile from "@/pages/Profile";
import EmailTemplates from "@/pages/EmailTemplates";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/pitches" element={<Pitches />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/templates" element={<EmailTemplates />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;