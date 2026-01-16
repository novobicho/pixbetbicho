import { useState, useEffect } from "react";
import { MobileBetWizardNew } from "@/components/mobile-bet-wizard-new";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Animal, Draw, GameMode, SystemSettings } from "@/types";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { BannerCarousel } from "@/components/banner-carousel";
import { RecentResultsDisplay } from "@/components/recent-results-display";
import { ModernBettingModal } from "@/components/modern-betting-modal";
import { PlayCircle } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { LiveOddsSection } from "@/components/live-odds-section";
import { WinnersSection } from "@/components/winners-section";
import { BottomBannerSection } from "@/components/bottom-banner-section";
import { registerBettingModalOpener } from "@/lib/betting-modal";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Estados para controlar o modal de aposta
  const [bettingModalOpen, setBettingModalOpen] = useState(false);

  // Register betting modal opener
  useEffect(() => {
    registerBettingModalOpener(() => setBettingModalOpen(true));
  }, []);

  // Queries para dados
  const { data: animals, isLoading: isLoadingAnimals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const { data: upcomingDraws, isLoading: isLoadingDraws } = useQuery<Draw[]>({
    queryKey: ["/api/draws/upcoming"],
  });

  const { data: gameModes, isLoading: isLoadingGameModes } = useQuery<GameMode[]>({
    queryKey: ["/api/game-modes"],
  });

  const { data: systemSettings, isLoading: isLoadingSettings } = useQuery<SystemSettings>({
    queryKey: ["/api/settings"],
  });

  const isLoading = isLoadingAnimals || isLoadingDraws || isLoadingGameModes || isLoadingSettings;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Full Width Banner */}
      <div className="w-full">
        <BannerCarousel />
      </div>

      {/* Live Odds Section */}
      <LiveOddsSection gameModes={gameModes || []} />

      {/* Winners Section */}
      <WinnersSection />

      {/* Recent Results Section */}
      <div className="bg-white py-8">
        <RecentResultsDisplay />
      </div>

      {/* Bottom Banner */}
      <BottomBannerSection />


      {/* Floating Action Button for Betting (Mobile/Desktop) */}

      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={bettingModalOpen} onOpenChange={setBettingModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 px-6 shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-2 border-white animate-bounce flex items-center gap-2"
            >
              <PlayCircle className="h-6 w-6" />
              <span className="font-bold text-base">FAZER APOSTA</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-md p-0 max-h-[90vh] overflow-y-auto flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center h-full p-8">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            ) : (
              <MobileBetWizardNew
                draws={upcomingDraws || []}
                animals={animals || []}
                gameModes={gameModes || []}
                systemSettings={systemSettings}
                inDialog={true}
                onComplete={() => setBettingModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <SiteFooter />
    </div>
  );
}
