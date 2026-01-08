import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateWill from "./pages/CreateWill";
import CreateAudioWill from "./pages/CreateAudioWill";
import AssetManagement from "./pages/AssetManagement";
import Recipients from "./pages/Recipients";
import ReviewWill from "./pages/ReviewWill";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<CreateWill />} />
            <Route path="/create/audio" element={<CreateAudioWill />} />
            <Route path="/create/video" element={<CreateAudioWill />} />
            <Route path="/create/chat" element={<CreateAudioWill />} />
            <Route path="/assets" element={<AssetManagement />} />
            <Route path="/recipients" element={<Recipients />} />
            <Route path="/review" element={<ReviewWill />} />
            <Route path="/confirmation" element={<Confirmation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
