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
  onScrollToFooter?: () => void;
  onHideFooter?: () => void;
}

const ScrollSolutionPage: React.FC<ScrollSolutionPageProps> = ({ onScrollToTop, onScrollToFooter, onHideFooter }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // 滚动控制
  const scrollLock = useRef(false);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  
  // 滚动配置
  const SCROLL_THRESHOLD = 50; // 需要累积的滚动量
  const SCROLL_LOCK_DURATION = 500; // 滚动锁定时长（毫秒）
  const SCROLL_DEBOUNCE = 50; // 防抖时间（毫秒）

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
      if (scrollLock.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      // 防抖：如果距离上次滚动时间太短，忽略
      if (now - lastScrollTime.current < SCROLL_DEBOUNCE) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      
      // 累积滚动量
      if (delta > 0) {
        scrollAccumulator.current += delta;
      } else {
        scrollAccumulator.current += delta; // 负数累积
      }

      // 只有累积滚动量超过阈值才触发切换
      const shouldTrigger = Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD;
      
      if (!shouldTrigger) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      lastScrollTime.current = now;
      scrollLock.current = true;

      const currentSectionData = sections[currentSection];

      if (delta > 0) {
        // Scrolling down
        if (!showDetail) {
          e.preventDefault();
          setShowDetail(true);
          setIsAtEnd(false);
        } else if (currentTab < currentSectionData.tabs.length - 1) {
          e.preventDefault();
          setCurrentTab((prev) => prev + 1);
          setIsAtEnd(false);
        } else if (currentSection < sections.length - 1) {
          e.preventDefault();
          setCurrentSection((prev) => prev + 1);
          setCurrentTab(0);
          setShowDetail(false);
          setIsAtEnd(false);
        } else {
          // At the last section and last tab, allow normal scroll to footer
          setIsAtEnd(true);
        }
      } else {
        // Scrolling up
        e.preventDefault();
        setIsAtEnd(false); // 向上滚动时，重置isAtEnd状态
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

      // 重置累积器
      scrollAccumulator.current = 0;
      
      // 解锁滚动
      setTimeout(() => {
        scrollLock.current = false;
      }, SCROLL_LOCK_DURATION);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [showDetail, currentTab, currentSection, onScrollToTop, onScrollToFooter]);

  // 检测是否为最后一步，并控制footer显示和isAtEnd状态
  useEffect(() => {
    const isLastStep = 
      currentSection === sections.length - 1 &&
      showDetail &&
      currentTab === sections[sections.length - 1].tabs.length - 1;
    
    // 同步isAtEnd状态
    setIsAtEnd(isLastStep);
    
    if (isLastStep) {
      onScrollToFooter?.();
    } else {
      onHideFooter?.();
    }
  }, [currentSection, currentTab, showDetail, onScrollToFooter, onHideFooter]);

  // Calculate progress - 每个section有1步标题 + tabs.length步详情
  const totalSteps = sections.reduce((acc, s) => acc + s.tabs.length + 1, 0);
  
  // 计算当前步数
  let currentStep = 0;
  
  // 前面所有section的步数（每个section：1步标题 + tabs.length步详情）
  for (let i = 0; i < currentSection; i++) {
    currentStep += sections[i].tabs.length + 1;
  }
  
  // 当前section的进度
  if (showDetail) {
    // 已展开详情：1步标题 + (currentTab + 1)步tab
    currentStep += 1 + (currentTab + 1);
  } else {
    // 未展开详情：只有标题步（第0步，但算作1步）
    currentStep += 1;
  }
  
  const progress = isAtEnd ? 100 : Math.min(100, (currentStep / totalSteps) * 100);

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
