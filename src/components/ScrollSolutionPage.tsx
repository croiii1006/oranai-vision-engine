import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface SectionData {
  id: string;
  titleKey: string;
  descKey: string;
  tabs: {
    labelKey: string;
    contentKey: string;
  }[];
}

const ScrollSolutionPage: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const sections: SectionData[] = [
    {
      id: 'know',
      titleKey: 'solution.know',
      descKey: 'solution.knowDesc',
      tabs: [
        { labelKey: 'solution.marketInsight', contentKey: 'solution.marketInsightDesc' },
        { labelKey: 'solution.consumerInsight', contentKey: 'solution.consumerInsightDesc' },
        { labelKey: 'solution.healthInsight', contentKey: 'solution.healthInsightDesc' },
      ],
    },
    {
      id: 'build',
      titleKey: 'solution.build',
      descKey: 'solution.buildDesc',
      tabs: [
        { labelKey: 'solution.brandPositioning', contentKey: 'solution.brandPositioningDesc' },
        { labelKey: 'solution.brandStory', contentKey: 'solution.brandStoryDesc' },
        { labelKey: 'solution.contentGeneration', contentKey: 'solution.contentGenerationDesc' },
      ],
    },
    {
      id: 'manage',
      titleKey: 'solution.manage',
      descKey: 'solution.manageDesc',
      tabs: [
        { labelKey: 'solution.socialMedia', contentKey: 'solution.socialMediaDesc' },
        { labelKey: 'solution.dam', contentKey: 'solution.damDesc' },
        { labelKey: 'solution.sentiment', contentKey: 'solution.sentimentDesc' },
      ],
    },
    {
      id: 'scale',
      titleKey: 'solution.scale',
      descKey: 'solution.scaleDesc',
      tabs: [
        { labelKey: 'solution.seo', contentKey: 'solution.seoDesc' },
        { labelKey: 'solution.ads', contentKey: 'solution.adsDesc' },
        { labelKey: 'solution.predictiveGrowth', contentKey: 'solution.predictiveGrowthDesc' },
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
          setCurrentTab(prev => prev + 1);
        } else if (currentSection < sections.length - 1) {
          setCurrentSection(prev => prev + 1);
          setCurrentTab(0);
          setShowDetail(false);
        }
      } else {
        // Scrolling up
        if (showDetail && currentTab > 0) {
          setCurrentTab(prev => prev - 1);
        } else if (showDetail && currentTab === 0) {
          setShowDetail(false);
        } else if (!showDetail && currentSection > 0) {
          setCurrentSection(prev => prev - 1);
          setCurrentTab(sections[currentSection - 1].tabs.length - 1);
          setShowDetail(true);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [showDetail, currentTab, currentSection, currentSectionData.tabs.length, sections.length]);

  // Calculate progress
  const totalSteps = sections.reduce((acc, s) => acc + s.tabs.length + 1, 0);
  const currentStep = sections.slice(0, currentSection).reduce((acc, s) => acc + s.tabs.length + 1, 0) 
    + (showDetail ? currentTab + 1 : 0);
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-muted/30 z-40">
        <motion.div 
          className="h-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Left sidebar navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-6">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => {
              setCurrentSection(index);
              setCurrentTab(0);
              setShowDetail(false);
            }}
            className="group flex items-center gap-3"
          >
            <div 
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index 
                  ? 'bg-foreground border-foreground scale-125' 
                  : 'border-muted-foreground/40 hover:border-foreground'
              }`}
            />
            <span 
              className={`text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                currentSection === index 
                  ? 'text-foreground opacity-100' 
                  : 'text-muted-foreground/50 group-hover:text-muted-foreground'
              }`}
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {t(section.titleKey)}
            </span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showDetail ? (
          // Title screen - KNOW/BUILD/MANAGE/SCALE big title
          <motion.div
            key={`title-${currentSection}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex items-center justify-center px-8 lg:px-24"
          >
            <div className="max-w-6xl w-full flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
              <h1 className="text-[80px] md:text-[120px] lg:text-[160px] font-bold tracking-tighter leading-none">
                {t(currentSectionData.titleKey)}
              </h1>
              <div className="flex flex-col gap-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
                  {t('solution.yourBrand')}
                </span>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                  {t(currentSectionData.descKey)}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // Detail screen with tabs
          <motion.div
            key={`detail-${currentSection}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pt-24 pb-12 px-8 lg:pl-32 lg:pr-8"
          >
            <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-8 lg:gap-16">
              {/* Left content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Section title */}
                <div className="flex items-baseline gap-4 mb-12">
                  <h2 className="text-[60px] md:text-[80px] font-bold tracking-tighter leading-none">
                    {t(currentSectionData.titleKey)}
                  </h2>
                  <span className="text-2xl md:text-3xl font-light text-muted-foreground">
                    {t('solution.yourBrand')}
                  </span>
                </div>

                {/* Tabs */}
                <div className="space-y-4 mb-8">
                  {currentSectionData.tabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTab(index)}
                      className={`flex items-center gap-4 w-full text-left transition-all duration-300 ${
                        currentTab === index ? '' : 'opacity-40 hover:opacity-60'
                      }`}
                    >
                      <span className={`text-xl md:text-2xl font-medium ${
                        currentTab === index ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {t(tab.labelKey)}
                      </span>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentTab === index ? 'bg-foreground' : 'bg-muted-foreground/30'
                      }`} />
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
                    className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
                  >
                    {t(currentSectionData.tabs[currentTab].contentKey)}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Right - Image area */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full aspect-[4/3] bg-muted/20 rounded-2xl overflow-hidden">
                  {/* Image placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10" />
                  
                  {/* Image indicators (right side) */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          imageIndex === i 
                            ? 'bg-foreground scale-110' 
                            : 'bg-foreground/30 hover:bg-foreground/50'
                        }`}
                      />
                    ))}
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
              currentSection === index
                ? 'bg-foreground text-background'
                : 'text-muted-foreground'
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
