import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import InteractiveParticles from './InteractiveParticles';
import AnimatedHeadline from './AnimatedHeadline';
import ScrollSolutionPage from './ScrollSolutionPage';

interface HomePageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'hero' | 'solution'>('hero');
  const scrollLock = useRef(false);

  const handleScrollToHero = () => {
    if (scrollLock.current) return;
    scrollLock.current = true;
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
          >
            {/* Dark background base */}
            <div className="absolute inset-0 bg-background" />
            
            {/* Interactive particles with mouse glow */}
            <InteractiveParticles />
            
            {/* Subtle noise texture */}
            <div className="absolute inset-0 noise pointer-events-none" />
            
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in-up">
                {/* Main headline with stronger gradient */}
                <AnimatedHeadline
                  text={t('hero.title')}
                  as="h1"
                  className="heading-xl mb-6"
                  charClassName="bg-clip-text text-transparent"
                  charStyle={{
                    backgroundImage: 'linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 70%) 30%, hsl(0 0% 100%) 60%, hsl(0 0% 100%))',
                    fontFamily: "'Century Gothic', sans-serif",
                  }}
                />
                
                {/* Subtitle */}
                <h2 className="heading-md text-muted-foreground mb-6" style={{ fontSize: '162%' }}>
                  {t('hero.subtitle')}
                </h2>
                
                {/* Description */}
                <p className="body-lg max-w-2xl mx-auto mb-12">
                  {t('hero.description')}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-foreground/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
            <ScrollSolutionPage onScrollToTop={handleScrollToHero} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
