import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollSolutionPage from './ScrollSolutionPage';
import HeroEmoji from './HeroEmoji';

interface HomePageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onScrollToFooter?: () => void;
  onHideFooter?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab, setActiveTab, onScrollToFooter, onHideFooter }) => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'hero' | 'solution'>('hero');
  const scrollLock = useRef(false);
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
          >
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-left"
              >
                {/* Main headline with inline emojis - bold Inter font */}
                <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-snug tracking-tight text-foreground">
                  {language === 'en' ? 'Empower your brand through customized ' : '通过定制化 '}
                  <HeroEmoji type="solutions" />
                  <span className="italic"> {language === 'en' ? 'Solutions' : '解决方案'}</span>
                  {language === 'en' ? ', cutting-edge ' : '，前沿 '}
                  <HeroEmoji type="models" />
                  <span className="italic"> {language === 'en' ? 'Models' : '模型'}</span>
                  {language === 'en' ? ', versatile ' : '，多功能 '}
                  <HeroEmoji type="products" />
                  <span className="italic"> {language === 'en' ? 'Products' : '产品'}</span>
                  {language === 'en' ? ', and creative ' : '，以及创意 '}
                  <HeroEmoji type="library" />
                  <span className="italic"> {language === 'en' ? 'Library' : '素材库'}</span>
                  {language === 'en' ? '.' : '。'}
                </h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-12 text-lg sm:text-xl text-muted-foreground max-w-2xl"
                >
                  {language === 'en' 
                    ? 'Our mission is to make AI-powered marketing accessible, effective and innovative.'
                    : '我们的使命是让AI驱动的营销变得触手可及、高效且富有创新。'
                  }
                </motion.p>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
                <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
              </div>
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
