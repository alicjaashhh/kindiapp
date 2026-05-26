import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import BabyInfoPage from "./pages/BabyInfoPage";
import HomePage from "./pages/HomePage";
import DevelopmentPage from "./pages/DevelopmentPage";
import FoodPage from "./pages/FoodPage";
import SleepPage from "./pages/SleepPage";
import SkillsPage from "./pages/SkillsPage";
import GrowthSpurtsPage from "./pages/GrowthSpurtsPage";
import TeethingPage from "./pages/TeethingPage";
import VaccinationPage from "./pages/VaccinationPage";
import ShopPage from "./pages/ShopPage";
import ArticlesPage from "./pages/ArticlesPage";
import AccountPage from "./pages/AccountPage";
import PremiumPage from "./pages/PremiumPage";
import GiftIdeasPage from "./pages/GiftIdeasPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/baby-info" element={<BabyInfoPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/development" element={<DevelopmentPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/growth" element={<GrowthSpurtsPage />} />
          <Route path="/teething" element={<TeethingPage />} />
          <Route path="/vaccination" element={<VaccinationPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/gifts" element={<GiftIdeasPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
