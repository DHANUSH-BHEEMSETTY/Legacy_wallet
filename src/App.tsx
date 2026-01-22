import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import LearnMore from "./pages/LearnMore";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import CreateWill from "./pages/CreateWill";
import CreateAudioWill from "./pages/CreateAudioWill";
import CreateVideoWill from "./pages/CreateVideoWill";
import CreateChatWill from "./pages/CreateChatWill";
import AssetManagement from "./pages/AssetManagement";
import Recipients from "./pages/Recipients";
import ReviewWill from "./pages/ReviewWill";
import WillDetail from "./pages/WillDetail";
import Confirmation from "./pages/Confirmation";
import Reminders from "./pages/Reminders";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyRecipient from "./pages/VerifyRecipient";
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
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-recipient" element={<VerifyRecipient />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateWill /></ProtectedRoute>} />
            <Route path="/create/audio" element={<ProtectedRoute><CreateAudioWill /></ProtectedRoute>} />
            <Route path="/create/video" element={<ProtectedRoute><CreateVideoWill /></ProtectedRoute>} />
            <Route path="/create/chat" element={<ProtectedRoute><CreateChatWill /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><AssetManagement /></ProtectedRoute>} />
            <Route path="/recipients" element={<ProtectedRoute><Recipients /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><ReviewWill /></ProtectedRoute>} />
            <Route path="/will/:id" element={<ProtectedRoute><WillDetail /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
