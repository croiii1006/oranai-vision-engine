import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Play,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  X,
  Sparkles,
  Video,
  Music,
  User,
  Volume2,
  ArrowLeft,
  Globe,
  Sun,
  Moon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { mockLibraryItems, mockModelItems, mockVoiceItems, LibraryItem, VoiceItem, ModelItem } from '../data/libraryData';

interface LibraryPageProps {
  onBack?: () => void;
}

// Shared layout constants for the carousel fan
const CARD_WIDTH = 210;
const CARD_GAP = 28;
// Fan/stack tuning for up to 8 cards (distance 0-4), wider spread to fill width
const FAN_OFFSETS = [0, 130, 240, 340, 440];
const SCALE_BY_DISTANCE = [1, 0.92, 0.84, 0.76, 0.74];
const ROTATE_BY_DISTANCE = [0, 6, 10, 14, 16];
const Y_OFFSETS = [0, 8, 16, 24, 30];
const OPACITY_DROP_BY_DISTANCE = [0, 0.06, 0.12, 0.18, 0.2];
const BLUR_PER_STEP = 0.6;
const MAX_DISTANCE_INDEX = FAN_OFFSETS.length - 1;

// Expanded view card dimensions
const EXPANDED_CARD_WIDTH = 280;
const EXPANDED_CARD_HEIGHT = 420;

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

type TabType = 'video' | 'voice' | 'model';

const CATEGORY_FILTERS = [
  { id: 'all', labelKey: 'library.all' },
  { id: 'food', labelKey: 'library.food' },
  { id: 'auto', labelKey: 'library.auto' },
  { id: 'fashion', labelKey: 'library.fashion' },
  { id: 'digital', labelKey: 'library.digital' },
  { id: 'finance', labelKey: 'library.finance' },
  { id: 'personal', labelKey: 'library.personal' },
  { id: 'culture', labelKey: 'library.culture' },
  { id: 'platform', labelKey: 'library.platform' },
  { id: 'diy', labelKey: 'library.diy' },
];

const LibraryPage: React.FC<LibraryPageProps> = ({ onBack }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [animationProgress, setAnimationProgress] = useState(0); // 0 = hero, 1 = expanded
  const animationProgressRef = useRef(0);

  const [titleOffsets, setTitleOffsets] = useState({ x: 0, y: -116 }); // defaults aligned with HERO_TOP->TARGET_TOP
  const [subtitleFade, setSubtitleFade] = useState(0);

  const [activeCardIndex, setActiveCardIndex] = useState<Record<TabType, number>>({
    video: 2,
    voice: 2,
    model: 2,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const previewVideoItems = mockLibraryItems.slice(0, 8);
  const previewVoiceItems = mockVoiceItems.slice(0, 8);
  const previewModelItems = mockModelItems.slice(0, 8);

  // Filter videos based on search and category
  const filteredVideoItems = mockLibraryItems.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      t(item.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const clampIndex = (index: number, total: number) => Math.max(0, Math.min(total - 1, index));
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const progress = animationProgress;
  const isExpanded = progress > 0.5;

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh' : 'en');

  useEffect(() => {
    animationProgressRef.current = animationProgress;
  }, [animationProgress]);

  const setProgressClamped = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    animationProgressRef.current = clamped;
    setAnimationProgress(clamped);
  }, []);

  // Compute dynamic offsets so the title moves from centered to ~24px from edges responsively
  useLayoutEffect(() => {
    const HERO_TOP = 140;
    const TARGET_TOP = 24;
    const LEFT_PADDING = 24;

    const updateOffsets = () => {
      if (typeof window === 'undefined') return;
      const viewportWidth = window.innerWidth;
      const centerToLeftX = -(viewportWidth / 2 - LEFT_PADDING);
      const centerToTopY = TARGET_TOP - HERO_TOP;
      setTitleOffsets({ x: centerToLeftX, y: centerToTopY });
    };

    updateOffsets();
    window.addEventListener('resize', updateOffsets);
    return () => window.removeEventListener('resize', updateOffsets);
  }, []);

  // Handle wheel events for animation control
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selectedItem) return; // Don't animate when modal is open
      
      // If expanded and scrolling horizontally, let the scroll container handle it
      if (isExpanded && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const target = e.target as HTMLElement;
        if (container.contains(target)) {
          return; // Let the horizontal scroll happen
        }
      }
      
      e.preventDefault();

      const delta = e.deltaY;
      const sensitivity = 0.012;
      const current = animationProgressRef.current;
      const target = current + delta * sensitivity;
      setProgressClamped(target);
    },
    [selectedItem, setProgressClamped, isExpanded]
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (selectedItem) return;
      if (isExpanded) return; // Let touch scroll work in expanded state
      e.preventDefault();

      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;

      const sensitivity = 0.014;
      const current = animationProgressRef.current;
      const target = current + deltaY * sensitivity;
      setProgressClamped(target);
    },
    [selectedItem, setProgressClamped, isExpanded]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove]);

  const tabs = [
    { id: 'video' as TabType, labelKey: 'library.tab.video', icon: Video, sectionKey: 'library.section.video' },
    { id: 'voice' as TabType, labelKey: 'library.tab.voice', icon: Music, sectionKey: 'library.section.voice' },
    { id: 'model' as TabType, labelKey: 'library.tab.model', icon: User, sectionKey: 'library.section.model' },
  ];

  const setActiveForTab = useCallback((tab: TabType, index: number, total: number) => {
    setActiveCardIndex((prev) => ({
      ...prev,
      [tab]: clampIndex(index, total),
    }));
  }, []);

  // Subtitle content based on tab
  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const subtitleKey = currentTab?.sectionKey || 'library.section.video';

  // Easing function for smoother animations
  const easeOutCubic = (tt: number) => 1 - Math.pow(1 - tt, 3);
  const easedProgress = easeOutCubic(animationProgress);

  // Title fade logic: fade out mid-way, then fade back in
  const fadeOut = clamp01((progress - 0.1) / 0.25);
  const fadeIn = clamp01((progress - 0.55) / 0.25);
  const titleOpacity = clamp01(1 - fadeOut + fadeIn);
  const subtitleOpacity = subtitleFade;
  const alignToLeft = easedProgress >= 0.85;

  const titleTranslateX = titleOffsets.x * easedProgress * 0.85;
  const titleTranslateY = titleOffsets.y * easedProgress * 0.4;

  // Subtitle fades only after expansion nearly completes
  useEffect(() => {
    let raf = 0;

    if (alignToLeft) {
      const start = performance.now();
      const duration = 400; // ms

      const tick = (ts: number) => {
        const tt = Math.min(1, (ts - start) / duration);
        setSubtitleFade(tt);
        if (tt < 1) raf = requestAnimationFrame(tick);
      };

      setSubtitleFade(0);
      raf = requestAnimationFrame(tick);
    } else {
      setSubtitleFade(0);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [alignToLeft]);

  // Initialize active cards to the middle item of each tab
  useEffect(() => {
    setActiveCardIndex({
      video: clampIndex(Math.floor(previewVideoItems.length / 2), previewVideoItems.length),
      voice: clampIndex(Math.floor(previewVoiceItems.length / 2), previewVoiceItems.length),
      model: clampIndex(Math.floor(previewModelItems.length / 2), previewModelItems.length),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildFanLayout = useCallback(
    (index: number, totalCards: number, activeIndex: number) => {
      const distanceFromActive = index - activeIndex;
      const distanceAbs = Math.min(Math.abs(distanceFromActive), MAX_DISTANCE_INDEX);
      const sign = Math.sign(distanceFromActive);

      const fanX = sign * FAN_OFFSETS[distanceAbs];
      const fanY = Y_OFFSETS[distanceAbs];
      const fanRotation = sign * ROTATE_BY_DISTANCE[distanceAbs];

      const totalWidth = totalCards * CARD_WIDTH + (totalCards - 1) * CARD_GAP;
      const startX = -totalWidth / 2 + CARD_WIDTH / 2;
      const linearX = startX + index * (CARD_WIDTH + CARD_GAP);
      const linearY = easedProgress > 0.5 ? 0 : -450;

      const currentX = fanX + (linearX - fanX) * easedProgress;
      const currentY = fanY + (linearY - fanY) * easedProgress;
      const currentRotation = fanRotation * (1 - easedProgress);

      const baseScale = SCALE_BY_DISTANCE[distanceAbs];
      const currentScale = baseScale + (1 - baseScale) * easedProgress;

      const opacityDrop = OPACITY_DROP_BY_DISTANCE[distanceAbs];
      const opacity = 1 - opacityDrop * (1 - easedProgress);

      const tiltY = -fanRotation * (1 - easedProgress);
      const blur = BLUR_PER_STEP * distanceAbs * (1 - easedProgress);
      const shadowStrength = Math.max(0.15, 0.35 - distanceAbs * 0.06);
      const zIndex = 200 - Math.abs(Math.round(distanceFromActive));

      return {
        currentX,
        currentY,
        currentRotation,
        currentScale,
        opacity,
        tiltY,
        blur,
        shadowStrength,
        zIndex,
      };
    },
    [easedProgress]
  );

  // Scroll handlers for horizontal scroll
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-background pt-0" style={{ touchAction: 'none' }}>
      {/* Mini Header - Back button and controls */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">OranAI</span>
        </button>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'EN' : '中文'}</span>
          </button>
        </div>
      </div>

      {/* Title Container - Animates from center to top-left */}
      <div className="absolute z-20 left-1/2 -translate-x-1/2" style={{ top: 140, opacity: titleOpacity }}>
        <div 
          className={`flex flex-col gap-2 ${alignToLeft ? 'items-start text-left justify-start' : 'items-center text-center justify-center'}`}
          style={{
            transform: `translateX(${titleTranslateX}px) translateY(${titleTranslateY}px)`,
            transition: 'transform 0.35s ease, opacity 0.35s ease',
          }}
        >
          <h1
            className="font-bold tracking-tight whitespace-nowrap"
            style={{
              fontSize: `${Math.max(1.75, 4 - easedProgress * 2.5)}rem`,
              opacity: titleOpacity,
              transition: 'font-size 0.35s ease, opacity 0.35s ease',
            }}
          >
            {t('library.title')}
          </h1>

          <span
            className="text-xl md:text-2xl font-light text-muted-foreground whitespace-nowrap block"
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(6px)`,
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {t(subtitleKey)}
          </span>
        </div>
      </div>

      {/* Description - Fades out */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl text-center px-6 z-10"
        style={{
          top: '30%',
          opacity: 1 - easedProgress * 2.5,
          transform: `translateX(-50%) translateY(${easedProgress * -25}px)`,
          pointerEvents: progress > 0.3 ? 'none' : 'auto',
        }}
      >
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t('library.heroDesc')}</p>
      </div>

      {/* Tab Selector - Fades out, positioned below description */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-30"
        style={{
          top: '48%',
          opacity: 1 - easedProgress * 2.5,
          transform: `translateX(-50%) translateY(${easedProgress * -20}px)`,
          pointerEvents: progress > 0.3 ? 'none' : 'auto',
        }}
      >
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar - Only shows when expanded */}
      {isExpanded && activeTab === 'video' && (
        <div 
          className="absolute left-0 right-0 z-30 px-6"
          style={{
            top: '100px',
            opacity: Math.min(1, (easedProgress - 0.5) * 2),
            transform: `translateY(${(1 - easedProgress) * 20}px)`,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-shrink-0 w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted/30 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 flex-1 scrollbar-hide">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-foreground text-background'
                      : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/30'
                  }`}
                >
                  {t(cat.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cards Container - Fan view (initial) */}
      {!isExpanded && (
        <div
          className="absolute left-0 right-0 z-10 overflow-visible"
          style={{
            top: 'auto',
            bottom: `${-15 + easedProgress * 30}%`,
            height: '65%',
          }}
        >
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />

          {/* Video Cards - Fan Layout */}
          {activeTab === 'video' && (
            <div className="relative w-full h-full flex items-end justify-center overflow-visible">
              {previewVideoItems.map((item, index) => {
                const totalCards = previewVideoItems.length;
                const activeIndex = clampIndex(activeCardIndex.video ?? Math.floor(totalCards / 2), totalCards);
                const layout = buildFanLayout(index, totalCards, activeIndex);

                const currentHeight = 340 + easedProgress * 80;
                const isActiveCard = index === activeIndex;

                const baseTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
                const zIndex = isActiveCard ? 999 : layout.zIndex;

                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      bottom: '0',
                      marginLeft: `-${CARD_WIDTH / 2}px`,
                      transformOrigin: 'center bottom',
                      transform: baseTransform,
                      zIndex,
                      opacity: layout.opacity,
                      transition: 'transform 0.4s ease, height 0.4s ease, opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease',
                      filter: `blur(${layout.blur}px)`,
                      boxShadow: `0 18px 50px rgba(0,0,0,${layout.shadowStrength})`,
                      borderRadius: '24px',
                      overflow: 'hidden',
                    }}
                    onClick={() => setActiveForTab('video', index, totalCards)}
                  >
                    <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted">
                      <video
                        src={item.videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover rounded-[inherit]"
                        onMouseEnter={(e) => {
                          e.currentTarget.currentTime = 0;
                          e.currentTarget.play().catch(() => {});
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[inherit]" />
                      {item.duration && (
                        <span className="absolute top-3 right-3 text-white text-xs font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                          {item.duration}
                        </span>
                      )}
                      <div className="absolute top-3 left-3">
                        <p className="text-white/60 text-xs font-medium">{item.publisher}</p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg line-clamp-2">{t(item.titleKey)}</p>
                      </div>
                      <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Voice Cards - Fan Layout */}
          {activeTab === 'voice' && (
            <div className="relative w-full h-full flex items-end justify-center overflow-visible">
              {previewVoiceItems.map((item, index) => {
                const totalCards = previewVoiceItems.length;
                const activeIndex = clampIndex(activeCardIndex.voice ?? Math.floor(totalCards / 2), totalCards);
                const layout = buildFanLayout(index, totalCards, activeIndex);

                const currentHeight = 340 + easedProgress * 80;
                const isActiveCard = index === activeIndex;

                const baseTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
                const zIndex = isActiveCard ? 999 : layout.zIndex;

                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      bottom: '0',
                      marginLeft: `-${CARD_WIDTH / 2}px`,
                      transformOrigin: 'center bottom',
                      transform: baseTransform,
                      zIndex,
                      opacity: layout.opacity,
                      transition: 'transform 0.4s ease, height 0.4s ease, opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease',
                      filter: `blur(${layout.blur}px)`,
                      boxShadow: `0 18px 50px rgba(0,0,0,${layout.shadowStrength})`,
                      borderRadius: '24px',
                      overflow: 'hidden',
                    }}
                    onClick={() => setActiveForTab('voice', index, totalCards)}
                  >
                    <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted">
                      <img src={item.thumbnail} alt={t(item.titleKey)} className="w-full h-full object-cover rounded-[inherit]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center rounded-[inherit]">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Volume2 className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 right-3">
                        <p className="text-white/60 text-xs font-medium">
                          {item.style} • {item.duration}
                        </p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{t(item.titleKey)}</p>
                      </div>
                      <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Model Cards - Fan Layout */}
          {activeTab === 'model' && (
            <div className="relative w-full h-full flex items-end justify-center overflow-visible">
              {previewModelItems.map((item, index) => {
                const totalCards = previewModelItems.length;
                const activeIndex = clampIndex(activeCardIndex.model ?? Math.floor(totalCards / 2), totalCards);
                const layout = buildFanLayout(index, totalCards, activeIndex);

                const currentHeight = 340 + easedProgress * 80;
                const isActiveCard = index === activeIndex;

                const baseTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
                const zIndex = isActiveCard ? 999 : layout.zIndex;

                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      bottom: '0',
                      marginLeft: `-${CARD_WIDTH / 2}px`,
                      transformOrigin: 'center bottom',
                      transform: baseTransform,
                      zIndex,
                      opacity: layout.opacity,
                      transition: 'transform 0.4s ease, height 0.4s ease, opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease',
                      filter: `blur(${layout.blur}px)`,
                      boxShadow: `0 18px 50px rgba(0,0,0,${layout.shadowStrength})`,
                      borderRadius: '24px',
                      overflow: 'hidden',
                    }}
                    onClick={() => setActiveForTab('model', index, totalCards)}
                  >
                    <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover rounded-[inherit]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[inherit]" />
                      <div className="absolute top-3 left-3 right-3">
                        <p className="text-white/60 text-xs font-medium">
                          {item.style} • {item.gender}
                        </p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{item.name}</p>
                      </div>
                      <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expanded Horizontal Scroll View */}
      {isExpanded && activeTab === 'video' && (
        <div 
          className="absolute left-0 right-0 z-10"
          style={{
            top: '180px',
            bottom: '40px',
            opacity: Math.min(1, (easedProgress - 0.5) * 2),
          }}
        >
          {/* Scroll Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Cards Container */}
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto overflow-y-hidden px-16 py-4 scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-6 h-full items-center" style={{ width: 'max-content' }}>
              {filteredVideoItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 cursor-pointer group"
                  style={{ width: `${EXPANDED_CARD_WIDTH}px`, height: `${EXPANDED_CARD_HEIGHT}px` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <video
                      src={item.videoUrl}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => {
                        e.currentTarget.currentTime = 0;
                        e.currentTarget.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Duration */}
                    {item.duration && (
                      <span className="absolute top-3 right-3 text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                        {item.duration}
                      </span>
                    )}
                    
                    {/* Publisher */}
                    <div className="absolute top-3 left-3">
                      <p className="text-white/80 text-xs font-medium bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">{item.publisher}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="absolute bottom-16 left-4 right-4 flex items-center gap-3 text-white/80">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{formatNumber(item.likes)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">{formatNumber(item.views)}</span>
                      </span>
                    </div>
                    
                    {/* Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-bold leading-tight drop-shadow-lg line-clamp-2">{t(item.titleKey)}</p>
                    </div>
                    
                    {/* Hover Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 rounded-[24px] border border-white/10 pointer-events-none" />
                  </div>
                </div>
              ))}
              
              {filteredVideoItems.length === 0 && (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                  <p className="text-lg">{language === 'en' ? 'No videos found' : '未找到视频'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="absolute bottom-4 right-4 w-1 h-20 bg-muted/30 rounded-full overflow-hidden z-20">
        <div className="w-full bg-foreground/50 rounded-full transition-all duration-100" style={{ height: `${progress * 100}%` }} />
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div
            className="relative bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors z-10">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-[280px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[240px] lg:max-w-none mx-auto">
                  <video src={selectedItem.videoUrl} controls autoPlay className="w-full h-full object-cover" poster={selectedItem.thumbnail} />
                </div>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4">{t(selectedItem.titleKey)}</h2>

                <div className="space-y-2 mb-5">
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{language === 'en' ? 'Publisher' : '发布者'}: </span>
                    <span className="text-foreground font-medium">{selectedItem.publisher}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{language === 'en' ? 'Release Date' : '发布时间'}: </span>
                    <span className="text-foreground font-medium">{selectedItem.publishDateFull}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.videoType')}: </span>
                    <span className="text-foreground font-medium">{t(selectedItem.videoTypeKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.purpose')}: </span>
                    <span className="text-foreground font-medium">{t(selectedItem.purposeKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.audience')}: </span>
                    <span className="text-foreground font-medium">{t(selectedItem.audienceKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.aiAnalysis')}: </span>
                    <span className="text-foreground font-medium">{t(selectedItem.aiAnalysisKey)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{selectedItem.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{selectedItem.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{selectedItem.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{selectedItem.shares.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-sm font-medium rounded-full border border-border/20">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={selectedItem.videoUrl}
                    download
                    className="flex-1 py-3 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {t('library.downloadVideo')}
                  </a>
                  <button className="flex-1 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t('library.replicate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
