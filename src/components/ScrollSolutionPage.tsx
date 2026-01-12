import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// KNOW section images
import knowMarketInsight from "@/assets/solutions/know-market-insight.png";
import knowConsumerInsight from "@/assets/solutions/know-consumer-insight.png";
import knowHealthInsight from "@/assets/solutions/know-health-insight.png";

// BUILD section images
import buildBrandPositioning from "@/assets/solutions/build-brand-positioning.png";
import buildBrandStory from "@/assets/solutions/build-brand-story.png";
import buildContentGeneration from "@/assets/solutions/build-content-generation.png";

// MANAGE section images
import manageSocialMedia from "@/assets/solutions/manage-social-media.png";
import manageDam from "@/assets/solutions/manage-dam.png";
import manageSentiment from "@/assets/solutions/manage-sentiment.png";

// SCALE section images
import scaleSeo from "@/assets/solutions/scale-seo.png";
import scaleAds from "@/assets/solutions/scale-ads.png";
import scaleGrowth from "@/assets/solutions/scale-growth.png";

interface SectionData {
  id: string;
  titleKey: string;
  descKey: string;
  images?: string[];
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
  const [imageIndex, setImageIndex] = useState(0);

  const sections: SectionData[] = [
    {
      id: "know",
      titleKey: "solution.know",
      descKey: "solution.knowDesc",
      images: [knowMarketInsight, knowConsumerInsight, knowHealthInsight],
      tabs: [
        { labelKey: "solution.marketInsight", contentKey: "solution.marketInsightDesc" },
        { labelKey: "solution.consumerInsight", contentKey: "solution.consumerInsightDesc" },
        { labelKey: "solution.healthInsight", contentKey: "solution.healthInsightDesc" },
      ],
    },
    {
      id: "build",
      titleKey: "solution.build",
      descKey: "solution.buildDesc",
      images: [buildBrandPositioning, buildBrandStory, buildContentGeneration],
      tabs: [
        { labelKey: "solution.brandPositioning", contentKey: "solution.brandPositioningDesc" },
        { labelKey: "solution.brandStory", contentKey: "solution.brandStoryDesc" },
        { labelKey: "solution.contentGeneration", contentKey: "solution.contentGenerationDesc" },
      ],
    },
    {
      id: "manage",
      titleKey: "solution.manage",
      descKey: "solution.manageDesc",
      images: [manageSocialMedia, manageDam, manageSentiment],
      tabs: [
        { labelKey: "solution.socialMedia", contentKey: "solution.socialMediaDesc" },
        { labelKey: "solution.dam", contentKey: "solution.damDesc" },
        { labelKey: "solution.sentiment", contentKey: "solution.sentimentDesc" },
      ],
    },
    {
      id: "scale",
      titleKey: "solution.scale",
      descKey: "solution.scaleDesc",
      images: [scaleSeo, scaleAds, scaleGrowth],
      tabs: [
        { labelKey: "solution.seo", contentKey: "solution.seoDesc" },
        { labelKey: "solution.ads", contentKey: "solution.adsDesc" },
        { labelKey: "solution.predictiveGrowth", contentKey: "solution.predictiveGrowthDesc" },
      ],
    },
  ];

  const currentSectionData = sections[currentSection];

  // Auto rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle wheel events for custom scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY;

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
  }, [showDetail, currentTab, currentSection, currentSectionData.tabs.length, sections.length]);

  // Calculate progress
  const totalSteps = sections.reduce((acc, s) => acc + s.tabs.length + 1, 0);
  const currentStep =
    sections.slice(0, currentSection).reduce((acc, s) => acc + s.tabs.length + 1, 0) +
    (showDetail ? currentTab + 1 : 0);
  const progress = (currentStep / totalSteps) * 100;

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

      {/* Left sidebar navigation - compact centered */}
      <div className="fixed left-0 top-0 h-screen w-20  z-30  hidden lg:flex  flex-col  justify-evenly  items-center  py-24">
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
              <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 lg:gap-8">
                <h1 className="text-[60px] md:text-[80px] lg:text-[120px] xl:text-[140px] font-bold tracking-tighter leading-none shrink-0">
                  {t(currentSectionData.titleKey)}
                </h1>
                <div className="flex flex-col gap-1 pb-2 lg:pb-4">
                  <span className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground">
                    {t("solution.yourBrand")}
                  </span>
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-xs lg:max-w-sm leading-snug">
                    {t(currentSectionData.descKey)}
                  </p>
                </div>
              </div>
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
              {/* Section title - MANAGE + your brand on the same line */}
              <div className="flex items-baseline gap-4 mb-12">
                <h2 className="text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tighter leading-none">
                  {t(currentSectionData.titleKey)}
                </h2>
                <span className="text-2xl md:text-3xl lg:text-4xl font-light text-muted-foreground whitespace-nowrap">
                  {t("solution.yourBrand")}
                </span>
              </div>

              {/* Content grid - tabs on left, image on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
                {/* Left content */}
                <div className="flex flex-col">
                  {/* Tabs with separator lines */}
                  <div className="space-y-0 mb-10">
                    {currentSectionData.tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTab(index)}
                        className={`flex items-center justify-between w-full text-left py-3 border-b border-border/30 transition-all duration-300 ${
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
                        <div
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            currentTab === index ? "bg-foreground" : "bg-muted-foreground/20"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Description */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md"
                    >
                      {t(currentSectionData.tabs[currentTab].contentKey)}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Right - Image area with indicators, aligned with text content */}
                <div className="relative flex items-start justify-center">
                  <div className="relative w-full aspect-[4/3] bg-muted/10 rounded-xl overflow-hidden border border-border/10">
                    {/* Section images - show current tab image if available */}
                    {currentSectionData.images && currentSectionData.images.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentTab}
                          src={currentSectionData.images[currentTab] || currentSectionData.images[0]}
                          alt=""
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </AnimatePresence>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5" />
                    )}

                    {/* Image indicators (right side inside card) - only show if images exist */}
                    {currentSectionData.images && currentSectionData.images.length > 1 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                        {currentSectionData.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentTab(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentTab === i ? "bg-foreground" : "bg-foreground/20 hover:bg-foreground/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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
    </div>
  );
};

export default ScrollSolutionPage;
