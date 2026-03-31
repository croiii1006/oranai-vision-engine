"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/components/HomePage";
import ModelsPage from "@/components/ModelsPage";
import ProductsPage from "@/components/ProductsPage";
import LibraryPage from "@/components/LibraryPage";
import PricingPage from "@/components/PricingPage";
import Footer from "@/components/Footer";
import type { PlanId } from "@/lib/pricing";
import { normalizeSitePath, pathFromTab, tabFromPathname } from "@/lib/site-routes";

export default function IndexPage() {
  const pathname = usePathname();
  const router = useRouter();
  const normalizedPath = useMemo(() => normalizeSitePath(pathname), [pathname]);
  const activeTab = useMemo(() => tabFromPathname(normalizedPath), [normalizedPath]);

  const setActiveTab = useCallback(
    (tab: string) => {
      const next = pathFromTab(tab);
      if (normalizeSitePath(next) === normalizedPath) return;
      router.push(next);
    },
    [normalizedPath, router],
  );
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>("free");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [libraryFooterVisible, setLibraryFooterVisible] = useState(false);
  const [librarySubTab, setLibrarySubTab] = useState<"video" | "voice" | "model">("video");
  const [showFooterInSolution, setShowFooterInSolution] = useState(false);
  const [loginDialogTrigger, setLoginDialogTrigger] = useState(0);

  const handleScrollToFooter = () => {
    setShowFooterInSolution(true);
    setTimeout(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleHideFooter = () => {
    setShowFooterInSolution(false);
  };

  useEffect(() => {
    if (activeTab !== "solution") {
      setShowFooterInSolution(false);
    }
  }, [activeTab]);

  const isHeroView = activeTab === "home" || activeTab === "hero";

  const renderContent = () => {
    switch (activeTab) {
      case "models":
        return <ModelsPage />;
      case "products":
        return <ProductsPage />;
      case "pricing":
        return (
          <PricingPage
            currentPlanId={currentPlanId}
            setCurrentPlanId={setCurrentPlanId}
            onRequestLogin={() => setLoginDialogTrigger((n) => n + 1)}
          />
        );
      case "library":
        return <LibraryPage initialTab={librarySubTab} />;
      case "home":
      case "hero":
      case "solution":
      default:
        return (
          <HomePage
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onScrollToFooter={handleScrollToFooter}
            onHideFooter={handleHideFooter}
          />
        );
    }
  };

  const isLibrary = activeTab === "library";
  const isSolution = activeTab === "solution";
  const showFooter =
    (isLibrary && libraryFooterVisible) ||
    (!isLibrary && !isSolution) ||
    (isSolution && showFooterInSolution);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPlanId={currentPlanId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isVisible={!isHeroView}
        setLibrarySubTab={setLibrarySubTab}
        loginDialogTrigger={loginDialogTrigger}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="animate-fade-in flex-1">{renderContent()}</main>

      {showFooter && <Footer setActiveTab={setActiveTab} />}
    </div>
  );
}
