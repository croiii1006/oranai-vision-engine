import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUp } from "lucide-react";

interface SectionData {
  id: string;
  titleKey: string;
  descKey: string;
  tabs: {
    labelKey: string;
    contentKey: string;
  }[];
}

interface ScrollSolutionPageProps {
  onScrollToTop?: () => void;
}

const ScrollSolutionPage: React.FC<ScrollSolutionPageProps> = ({ onScrollToTop }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollAccumulator = useRef(0);
  const SCROLL_STEP_THRESHOLD = 320; // wheel delta needed before advancing
  const handleBackToTop = () => {
    setCurrentSection(0);
    setCurrentTab(0);
    setShowDetail(false);
    setIsAtEnd(false);
    scrollAccumulator.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Title-level descriptions (intro and detail) use separate class handles for easy tuning.
  const introDescClass =
    "text-base md:text-xl lg:text-5xl text-muted-foreground/50 leading-snug max-w-[65rem] text-left font-medium";
  const detailDescClass =
    "text-base md:text-lg lg:text-4xl text-muted-foreground leading-snug max-w-[30rem] text-left font-normal";
  const tabDescClass =
    "text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl min-h-[120px]";

  const sections: SectionData[] = [
    {
      id: "know",
      titleKey: "solution.know",
      descKey: "solution.knowDesc",
      tabs: [
        { labelKey: "solution.marketInsight", contentKey: "solution.marketInsightDesc" },
        { labelKey: "solution.consumerInsight", contentKey: "solution.consumerInsightDesc" },
        { labelKey: "solution.brandHealthMetrics", contentKey: "solution.brandHealthMetricsDesc" },
        { labelKey: "solution.industryTrends", contentKey: "solution.industryTrendsDesc" },
      ],
    },
    {
      id: "build",
      titleKey: "solution.build",
      descKey: "solution.buildDesc",
      tabs: [
        { labelKey: "solution.brandPositioningGen", contentKey: "solution.brandPositioningGenDesc" },
        { labelKey: "solution.contentEngine", contentKey: "solution.contentEngineDesc" },
        { labelKey: "solution.socialOps", contentKey: "solution.socialOpsDesc" },
        { labelKey: "solution.crmOps", contentKey: "solution.crmOpsDesc" },
      ],
    },
    {
      id: "manage",
      titleKey: "solution.manage",
      descKey: "solution.manageDesc",
      tabs: [
        { labelKey: "solution.dataAssetMgmt", contentKey: "solution.dataAssetMgmtDesc" },
        { labelKey: "solution.sentimentMgmt", contentKey: "solution.sentimentMgmtDesc" },
        { labelKey: "solution.complianceMgmt", contentKey: "solution.complianceMgmtDesc" },
        { labelKey: "solution.salesServiceMgmt", contentKey: "solution.salesServiceMgmtDesc" },
      ],
    },
    {
      id: "scale",
      titleKey: "solution.scale",
      descKey: "solution.scaleDesc",
      tabs: [
        { labelKey: "solution.geoSeoOpt", contentKey: "solution.geoSeoOptDesc" },
        { labelKey: "solution.localizationGrowth", contentKey: "solution.localizationGrowthDesc" },
        { labelKey: "solution.leadAdsOpt", contentKey: "solution.leadAdsOptDesc" },
        { labelKey: "solution.trendForecast", contentKey: "solution.trendForecastDesc" },
      ],
    },
  ];

  const currentSectionData = sections[currentSection];

  // Handle wheel events for custom scrolling
  useEffect(() => {
    // If at end, allow normal scrolling
    if (isAtEnd) return;

    const handleWheel = (e: WheelEvent) => {
      if (isAtEnd) return;

      e.preventDefault();
      scrollAccumulator.current += e.deltaY;
      if (Math.abs(scrollAccumulator.current) < SCROLL_STEP_THRESHOLD) return;

      const delta = scrollAccumulator.current;
      scrollAccumulator.current = 0;

      if (delta > 0) {
        // Scrolling down
        if (!showDetail) {
          setShowDetail(true);
        } else if (currentTab < currentSectionData.tabs.length - 1) {
          setCurrentTab((prev) => prev + 1);
        } else if (currentSection < sections.length - 1) {
          setCurrentSection((prev) => prev + 1);
          setCurrentTab(0);
          setShowDetail(false);
        } else {
          // At the last section and last tab, allow normal scroll to footer
          setIsAtEnd(true);
          scrollAccumulator.current = 0;
        }
      } else {
        // Scrolling up
        if (showDetail && currentTab > 0) {
          setCurrentTab((prev) => prev - 1);
        } else if (showDetail && currentTab === 0) {
          setShowDetail(false);
        } else if (!showDetail && currentSection > 0) {
          setCurrentSection((prev) => prev - 1);
          setCurrentTab(sections[currentSection - 1].tabs.length - 1);
          setShowDetail(true);
        } else if (!showDetail && currentSection === 0 && onScrollToTop) {
          // At the very top, scroll back to hero
          onScrollToTop();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [showDetail, currentTab, currentSection, currentSectionData.tabs.length, sections.length, isAtEnd, onScrollToTop]);

  // Reset isAtEnd when scrolling back up from footer
  useEffect(() => {
    if (!isAtEnd) return;

    const handleScrollUp = (e: WheelEvent) => {
      if (e.deltaY < 0 && window.scrollY === 0) {
        e.preventDefault();
        setIsAtEnd(false);
      }
    };

    window.addEventListener("wheel", handleScrollUp, { passive: false });
    return () => window.removeEventListener("wheel", handleScrollUp);
  }, [isAtEnd]);

  // Calculate progress
  const totalSteps = sections.reduce((acc, s) => acc + s.tabs.length + 1, 0);
  const currentStep =
    sections.slice(0, currentSection).reduce((acc, s) => acc + s.tabs.length + 1, 0) +
    (showDetail ? currentTab + 1 : 0);
  const progress = isAtEnd ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-64px)] relative">
      {/* Progress bar - full width at top */}
      <div className="fixed top-16 left-0 right-0 h-0.5 bg-muted/20 z-40">
        <motion.div
          className="h-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Left sidebar navigation - compact centered, hide when at end */}
      <div className={`fixed left-0 top-0 h-screen w-20 z-30 hidden lg:flex flex-col justify-evenly items-center py-24 transition-opacity duration-300 ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col gap-20">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                setCurrentSection(index);
                setCurrentTab(0);
                setShowDetail(false);
              }}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                  currentSection === index
                    ? "bg-foreground border-foreground"
                    : "border-muted-foreground/30 bg-transparent hover:border-muted-foreground/60"
                }`}
              />
              <span
                className={`text-[9px] font-medium uppercase tracking-widest transition-all duration-300 ${
                  currentSection === index
                    ? "text-foreground"
                    : "text-muted-foreground/40 group-hover:text-muted-foreground/60"
                }`}
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                {t(section.titleKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area - centered with left padding */}
      <AnimatePresence mode="wait">
        {!showDetail ? (
          // Title screen - KNOW/BUILD/MANAGE/SCALE big title
          <motion.div
            key={`title-${currentSection}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[calc(100vh-64px)] flex items-center justify-center pl-24 lg:pl-32 pr-8 lg:pr-16"
          >
            <div className="w-full max-w-[1320px] mx-auto">
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 lg:gap-8 pb-6">
                <h1 className="text-[60px] md:text-[80px] lg:text-[120px] xl:text-[140px] font-bold tracking-tighter leading-none shrink-0">
                  {t(currentSectionData.titleKey)}
                </h1>
                <div className="flex flex-col items-start gap-3 pb-2 lg:pb-4">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground">
                    {t("solution.yourBrand")}
                  </span>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className={introDescClass}
              >
                {t(currentSectionData.descKey)}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          // Detail screen with tabs - centered layout matching reference
          <motion.div
            key={`detail-${currentSection}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[calc(100vh-64px)] flex items-center pl-24 lg:pl-40 pr-8 lg:pr-16"
          >
            <div className="w-full max-w-[1320px] mx-auto pt-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="space-y-6">
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tighter leading-none">
                      {t(currentSectionData.titleKey)}
                    </h2>
                    <span className="text-2xl md:text-3xl lg:text-4xl font-light text-muted-foreground whitespace-nowrap">
                      {t("solution.yourBrand")}
                    </span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className={detailDescClass}
                  >
                    {t(currentSectionData.descKey)}
                  </motion.p>
                </div>

                <div className="flex flex-col">
                  <div className="space-y-0 mb-10 border-b border-border/30 pb-2">
                    {currentSectionData.tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTab(index)}
                        className={`group flex items-center justify-between w-full text-left py-3 transition-all duration-300 ${
                          currentTab === index ? "" : "opacity-40 hover:opacity-60"
                        }`}
                      >
                        <span
                          className={`text-lg md:text-xl lg:text-2xl font-medium ${
                            currentTab === index ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {t(tab.labelKey)}
                        </span>
                        <svg
                          className={`w-6 h-6 transition-all duration-300 ${
                            currentTab === index
                              ? "text-foreground translate-x-1 opacity-100"
                              : "text-muted-foreground/40 opacity-60 group-hover:text-muted-foreground/70 group-hover:opacity-90"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={tabDescClass}
                    >
                      {t(currentSectionData.tabs[currentTab].contentKey)}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md rounded-full border border-border/30 p-2 flex justify-around z-30">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              setCurrentSection(index);
              setCurrentTab(0);
              setShowDetail(false);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentSection === index ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            {t(section.titleKey)}
          </button>
        ))}
      </div>

      <button
        onClick={handleBackToTop}
        className="fixed bottom-20 right-5 lg:bottom-10 lg:right-10 z-50 w-12 h-12 rounded-full bg-background/70 backdrop-blur-lg border border-border/40 text-foreground shadow-lg hover:bg-background/90 transition-colors flex items-center justify-center"
        aria-label={t("solution.backToTop")}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ScrollSolutionPage;
