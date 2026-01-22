import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react';
import ScrollSolutionPage from './ScrollSolutionPage';
import logoDarkSvg from '/logo_dark.svg';
import logoSvg from '/logo.svg';

const marqueeLogos = [
  { src: '/partners/funny-fuzzy.png', alt: 'FUNNY FUZZY' },
  { src: '/partners/plug-and-play.png', alt: 'Plug and Play China' },
  { src: '/partners/tencent.png', alt: 'Tencent' },
  { src: '/partners/aosom.png', alt: 'Aosom' },
  { src: '/partners/aws.png', alt: 'AWS' },
  { src: '/partners/google.png', alt: 'Google' },
  { src: '/partners/matrix.png', alt: 'Matrix Partners' }
];

interface HomePageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'hero' | 'solution'>('hero');
  const scrollLock = useRef(false);
  const scrollDeltaRef = useRef(0);
  const HERO_SCROLL_THRESHOLD = 200; // reduce accidental switches on light trackpad flicks

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh' : 'en');

  const handleScrollToHero = () => {
    if (scrollLock.current) return;
    scrollLock.current = true;
    scrollDeltaRef.current = 0;
    setCurrentView('hero');
    setActiveTab('home');
    setTimeout(() => {
      scrollLock.current = false;
    }, 800);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollLock.current) return;
      if (currentView === 'hero' && e.deltaY > 0) {
        e.preventDefault();
        scrollDeltaRef.current += e.deltaY;
        if (scrollDeltaRef.current < HERO_SCROLL_THRESHOLD) return;

        scrollDeltaRef.current = 0;
        scrollLock.current = true;
        setCurrentView('solution');
        setActiveTab('solution');
        setTimeout(() => {
          scrollLock.current = false;
        }, 800);
      }
    };

    const container = containerRef.current;
    if (container && currentView === 'hero') {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentView, setActiveTab]);

  // Sync with activeTab changes from header
  useEffect(() => {
    if (activeTab === 'solution' && currentView !== 'solution') {
      setCurrentView('solution');
    } else if (activeTab === 'home' || activeTab === 'hero') {
      setCurrentView('hero');
    }
  }, [activeTab, currentView]);

  return (
    <div ref={containerRef} className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'hero' ? (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen overflow-hidden hero-gradient"
          >
            {/* Hero Header - only visible on hero */}
            <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={theme === 'dark' ? logoSvg : logoDarkSvg}
                    alt="ORANAI logo"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm font-semibold tracking-wide text-foreground">ORANAI</span>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center space-x-1 p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Large Logo Text */}
            <div className="absolute top-0 left-1/2 -translate-x-[52%] -translate-y-[20%] z-10 w-full px-6 sm:px-10 lg:px-16 flex justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-[33vw] sm:text-[30.8vw] md:text-[28.6vw] lg:text-[26.4vw] leading-none text-foreground select-none px-0 text-center font-normal"
                style={{
                  fontFamily: 'Urbanist, Zalando Sans Expanded, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.001em'
                }}
              >
                oranAI
              </motion.h1>
            </div>

            {/* Right Side Content */}
            <div className="absolute top-1/2 right-0 -translate-y-1/3 z-10 px-6 sm:px-10 lg:px-16 max-w-xl lg:max-w-[38rem]">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-left"
              >
                <h2
                  className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-foreground dark:opacity-70"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {language === 'en'
                    ? 'Integrate cutting-edge models, product matrices and creative asset libraries to build a one-stop marketing solution, empowering the growth of global brands.'
                    : '整合前沿模型、产品矩阵和创意素材库，打造一站式营销解决方案，赋能全球品牌增长。'}
                </h2>
              </motion.div>
            </div>

            {/* Bottom Subtitle + Logo marquee */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="px-6 sm:px-10 lg:px-16 pb-4">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, 0] }}
                  transition={{
                    duration: 2.2,
                    times: [0, 0.3, 0.8, 1],
                    delay: 0.4,
                    ease: 'easeInOut'
                  }}
                  className="text-[1.2rem] sm:text-[1.35rem] text-foreground text-center font-sans font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {language === 'en'
                    ? 'Our mission is to make AI-powered marketing accessible, effective and innovative.'
                    : '我们的使命是让AI驱动的营销变得触手可及、高效且富有创新。'}
                </motion.p>
              </div>

              <div className="w-screen overflow-hidden relative left-1/2 -translate-x-1/2">
                <div className="logo-marquee px-6 sm:px-10 lg:px-16 py-3 gap-10 sm:gap-12">
                  {[...marqueeLogos, ...marqueeLogos].map((logo, index) => (
                    <div key={`${logo.alt}-${index}`} className="shrink-0 flex items-center justify-center h-10 sm:h-11">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-7 sm:h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
          </motion.section>
        ) : (
          <motion.div
            key="solution"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ScrollSolutionPage onScrollToTop={handleScrollToHero} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
