import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Globe, Sun, Moon } from 'lucide-react';
import ScrollSolutionPage from './ScrollSolutionPage';
import logoDarkSvg from '/logo_dark.svg';
import logoSvg from '/logo.svg';
interface HomePageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScrollToFooter?: () => void;
  onHideFooter?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab, setActiveTab, onScrollToFooter, onHideFooter }) => {
  const {
    language,
    setLanguage
  } = useLanguage();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'hero' | 'solution'>('hero');
  const scrollLock = useRef(false);
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);

  // 滚动配置
  const SCROLL_THRESHOLD = 10; // 需要累积的滚动量
  const SCROLL_LOCK_DURATION = 500; // 滚动锁定时长（毫秒）
  const SCROLL_DEBOUNCE = 50; // 防抖时间（毫秒）

  const handleScrollToHero = () => {
    if (scrollLock.current) return;
    scrollLock.current = true;
    scrollAccumulator.current = 0;
    setCurrentView('hero');
    setActiveTab('home');
    setTimeout(() => {
      scrollLock.current = false;
    }, SCROLL_LOCK_DURATION);
  };
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollLock.current) return;
      
      const now = Date.now();
      // 防抖：如果距离上次滚动时间太短，忽略
      if (now - lastScrollTime.current < SCROLL_DEBOUNCE) {
        return;
      }
      lastScrollTime.current = now;
      
      if (currentView === 'hero' && e.deltaY > 0) {
        e.preventDefault();
        
        // 累积滚动量
        scrollAccumulator.current += e.deltaY;
        
        // 只有累积滚动量超过阈值才触发切换
        if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
          scrollLock.current = true;
          scrollAccumulator.current = 0;
          setCurrentView('solution');
          setActiveTab('solution');
          setTimeout(() => {
            scrollLock.current = false;
          }, SCROLL_LOCK_DURATION);
        }
      } else if (e.deltaY < 0) {
        // 向上滚动时重置累积器
        scrollAccumulator.current = Math.max(0, scrollAccumulator.current + e.deltaY);
      }
    };
    const container = containerRef.current;
    if (container && currentView === 'hero') {
      container.addEventListener('wheel', handleWheel, {
        passive: false
      });
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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              y: -100,
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative min-h-screen overflow-hidden hero-gradient"
          >
            {/* Hero Header - only visible on hero */}
            <div className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 py-6">
              <div className="flex items-center justify-between">
                {/* Left -y */}
                <div className="flex items-center space-x-3">
                  <img src={theme === 'dark' ? logoSvg : logoDarkSvg} alt="ORANAI logo" className="w-5 h-5 object-contain" />
                  <span className="text-sm font-semibold tracking-wide text-foreground">ORANAI</span>
                </div>
                
                {/* Right - Controls */}
                <div className="flex items-center space-x-4">
                  <button onClick={toggleTheme} className="p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button onClick={toggleLanguage} className="flex items-center space-x-1 p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200">
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Large Logo Text */}
            <div className="absolute top-0 left-1/2 -translate-x-[52%] -translate-y-[20%] z-10 w-full px-6 sm:px-10 lg:px-16 flex justify-center">
              <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }} className="font-sans text-[33vw] sm:text-[30.8vw] md:text-[28.6vw] lg:text-[26.4vw] leading-none text-foreground select-none px-0 text-center font-normal" style={{
            fontFamily: 'Urbanist, Zalando Sans Expanded, sans-serif',
            fontWeight: 400,
            letterSpacing: '0.001em'
          }}>
                oranAI
              </motion.h1>
            </div>

            {/* Right Side Content */}
            <div className="absolute top-1/2 right-0 -translate-y-1/3 z-10 px-6 sm:px-10 lg:px-16 max-w-xl lg:max-w-[38rem]">
              <motion.div initial={{
            opacity: 0,
            y: 40
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }} className="text-left">
                {/* Main headline */}
                <h2 className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-foreground dark:opacity-70" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {language === 'en' ? 'Empower your brand through customized ' : '通过定制化'}
                  <span className="italic font-medium">{language === 'en' ? 'Solutions' : '解决方案'}</span>
                  {language === 'en' ? ', cutting-edge ' : '、前沿'}
                  <span className="italic font-medium">{language === 'en' ? 'Models' : '模型'}</span>
                  {language === 'en' ? ', versatile ' : '、多功能'}
                  <span className="italic font-medium">{language === 'en' ? 'Products' : '产品'}</span>
                  {language === 'en' ? ', and creative ' : '以及创意'}
                  <span className="italic font-medium">{language === 'en' ? 'Library' : '素材库'}</span>
                  {language === 'en' ? '.' : '，为您的品牌赋能。'}
                </h2>
              </motion.div>
            </div>

            {/* Bottom Subtitle */}
            <div className="absolute bottom-16 left-0 right-0 z-10 px-6 sm:px-10 lg:px-16">
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[1.2rem] sm:text-[1.35rem] text-foreground text-center font-sans font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {language === 'en'
                  ? 'Our mission is to make AI-powered marketing accessible, effective and innovative.'
                  : '我们的使命是让AI驱动的营销变得触手可及、高效且富有创新。'}
              </motion.p>
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="solution"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ScrollSolutionPage onScrollToTop={handleScrollToHero} onScrollToFooter={onScrollToFooter} onHideFooter={onHideFooter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default HomePage;
