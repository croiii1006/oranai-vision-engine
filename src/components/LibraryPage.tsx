import React, { useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
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
  Search,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchMaterialSquareDetail,
  fetchMaterialSquareList,
  fetchMaterialSquareAudioList,
  fetchMaterialSquareAudioDetail,
  fetchMaterialSquareModelList,
  fetchMaterialSquareModelDetail,
  type MaterialSquareItem,
  type MaterialSquareDetail,
  type MaterialSquareAudioItem,
  type MaterialSquareAudioDetail,
  type MaterialSquareModelItem,
  type MaterialSquareModelDetail,
} from '@/lib/api/library';

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
// Decouple collapsed/expanded title top positions
const TITLE_TOP_COLLAPSED = 70;
const TITLE_TOP_EXPANDED = 20;
// Gap between main title and subtitle/search row (px)
const TITLE_SUBTITLE_GAP = 1;

const formatNumber = (num: number | undefined | null): string => {
  const value = num ?? 0;
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return value.toString();
};

type TabType = 'video' | 'voice' | 'model';

type SelectedItemType = MaterialSquareDetail | MaterialSquareAudioDetail | MaterialSquareModelDetail;

const LibraryPage: React.FC = () => {
  const { t } = useLanguage();

  const [selectedItem, setSelectedItem] = useState<SelectedItemType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('video');

  const [animationProgress, setAnimationProgress] = useState(0); // 0 = hero, 1 = expanded
  const animationProgressRef = useRef(0);

  const [titleOffsets, setTitleOffsets] = useState({ x: 0, y: -116 }); // defaults aligned with HERO_TOP->TARGET_TOP
  const [subtitleFade, setSubtitleFade] = useState(0);

  const [activeCardIndex, setActiveCardIndex] = useState<Record<TabType, number>>({
    video: 2,
    voice: 2,
    model: 2,
  });
  const [cardOffsets, setCardOffsets] = useState<Record<TabType, number>>({
    video: 0,
    voice: 0,
    model: 0,
  });
  const [maxVideoOffset, setMaxVideoOffset] = useState(800);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取 AI 视频列表数据（只在初始加载时获取，不依赖搜索和分类）
  const { data: videoListData } = useQuery({
    queryKey: ['materialSquareList', 'video'],
    queryFn: () => fetchMaterialSquareList({
      page: 1,
      size: 100,
    }),
  });

  // 获取 AI 音频列表数据（只在初始加载时获取，不依赖搜索）
  const { data: audioListData } = useQuery({
    queryKey: ['materialSquareAudioList'],
    queryFn: () => fetchMaterialSquareAudioList({
      page: 1,
      size: 100,
    }),
  });

  // 获取 AI 模特列表数据（只在初始加载时获取，不依赖搜索）
  const { data: modelListData } = useQuery({
    queryKey: ['materialSquareModelList'],
    queryFn: () => fetchMaterialSquareModelList({
      page: 1,
      size: 100,
    }),
  });

  // 搜索防抖：300ms延迟
  useEffect(() => {
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
    searchDebounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // 切换tab时清空搜索框和重置Video类型
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedCategory('all');
  }, []);

  // 使用 API 数据
  const previewVideoItems: MaterialSquareItem[] = videoListData?.data?.list || [];
  const previewVoiceItems: MaterialSquareAudioItem[] = audioListData?.data?.list || [];
  const previewModelItems: MaterialSquareModelItem[] = modelListData?.data?.list || [];

  // 从 API 数据中提取所有唯一的 category 值（去重处理）
  const videoCategories = useMemo(() => {
    const categoryMap = new Map<string, string>(); // 使用 Map 存储：小写key -> 原始值
    previewVideoItems.forEach((item) => {
      if (item.category && item.category.trim()) {
        const trimmedCategory = item.category.trim();
        const lowerKey = trimmedCategory.toLowerCase();
        // 如果已存在，保留第一个出现的原始值（保持大小写）
        if (!categoryMap.has(lowerKey)) {
          categoryMap.set(lowerKey, trimmedCategory);
        }
      }
    });
    // 转换为数组并排序（按原始值排序，不区分大小写）
    return Array.from(categoryMap.values()).sort((a, b) => 
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
  }, [previewVideoItems]);

  // 使用防抖后的搜索查询进行过滤
  const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();

  // 客户端过滤：前端遍历控制数据展示隐藏
  const filteredVideoItems = useMemo(() => {
    return previewVideoItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const textBlob = `${item.title} ${item.publisher} ${(item.tags || []).join(' ')}`.toLowerCase();
      const matchesSearch = !normalizedQuery || textBlob.includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [previewVideoItems, selectedCategory, normalizedQuery]);

  const filteredVoiceItems = useMemo(() => {
    return previewVoiceItems.filter((item) => {
      const textBlob = `${item.title} ${item.publisher} ${item.style}`.toLowerCase();
      return !normalizedQuery || textBlob.includes(normalizedQuery);
    });
  }, [previewVoiceItems, normalizedQuery]);

  const filteredModelItems = useMemo(() => {
    return previewModelItems.filter((item) => {
      const textBlob = `${item.name} ${item.style} ${item.gender} ${item.ethnicity}`.toLowerCase();
      return !normalizedQuery || textBlob.includes(normalizedQuery);
    });
  }, [previewModelItems, normalizedQuery]);

  const clampIndex = (index: number, total: number) => Math.max(0, Math.min(total - 1, index));
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const progress = animationProgress;
  const isExpanded = progress > 0.5;

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
    const LEFT_PADDING = 185;

    const updateOffsets = () => {
      if (typeof window === 'undefined') return;
      const viewportWidth = window.innerWidth;
      const centerToLeftX = -(viewportWidth / 2 - LEFT_PADDING);
      const centerToTopY = TARGET_TOP - HERO_TOP;
      setTitleOffsets({ x: centerToLeftX, y: centerToTopY });

      // Update max horizontal offset for video carousel so we can scroll all cards
      const totalVideoCards = filteredVideoItems.length;
      if (totalVideoCards === 0) {
        setMaxVideoOffset(0);
        return;
      }
      const totalWidth = totalVideoCards * CARD_WIDTH + (totalVideoCards - 1) * CARD_GAP;
      const maxOffset = Math.max(0, (totalWidth - viewportWidth) / 2 + 120);
      setMaxVideoOffset(maxOffset);
    };

    updateOffsets();
    window.addEventListener('resize', updateOffsets);
    return () => window.removeEventListener('resize', updateOffsets);
  }, [filteredVideoItems.length]);

  // Handle wheel events for animation control
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selectedItem) return; // Don't animate when modal is open
      e.preventDefault();

      // When expanded and on video tab, allow horizontal scroll of cards
      if (isExpanded && activeTab === 'video' && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        setCardOffsets((prev) => ({
          ...prev,
          video: Math.max(-maxVideoOffset, Math.min(maxVideoOffset, prev.video + e.deltaX)),
        }));
        return;
      }

      const delta = e.deltaY;
      const sensitivity = 0.012;
      const current = animationProgressRef.current;
      const target = current + delta * sensitivity;
      setProgressClamped(target);
    },
    [selectedItem, setProgressClamped, isExpanded, activeTab, maxVideoOffset]
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (selectedItem) return;
      e.preventDefault();

      const deltaY = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;

      const sensitivity = 0.014;
      const current = animationProgressRef.current;
      const target = current + deltaY * sensitivity;
      setProgressClamped(target);
    },
    [selectedItem, setProgressClamped]
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

  // Only shift left once aligned; keep centered before expansion
  const titleTranslateX = alignToLeft ? titleOffsets.x * easedProgress * 0.85 + 310 : 0;
  const titleTranslateY = 0; // vertical handled via top interpolation
  const titleTop = TITLE_TOP_COLLAPSED + (TITLE_TOP_EXPANDED - TITLE_TOP_COLLAPSED) * easedProgress;

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
      video: clampIndex(Math.floor(filteredVideoItems.length / 2), filteredVideoItems.length),
      voice: clampIndex(Math.floor(filteredVoiceItems.length / 2), filteredVoiceItems.length),
      model: clampIndex(Math.floor(filteredModelItems.length / 2), filteredModelItems.length),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActiveCardIndex((prev) => ({
      video: clampIndex(prev.video ?? 0, filteredVideoItems.length),
      voice: clampIndex(prev.voice ?? 0, filteredVoiceItems.length),
      model: clampIndex(prev.model ?? 0, filteredModelItems.length),
    }));
  }, [filteredVideoItems.length, filteredVoiceItems.length, filteredModelItems.length]);

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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-background"
      style={{ touchAction: 'none', top: '60px' }}
    >
      {/* Title Container - Animates from center to top-left */}
      <div
        className="absolute z-20 left-0 right-0 px-6 sm:px-10 lg:px-16"
        style={{ top: titleTop, opacity: titleOpacity }}
      >
        <div 
          className={`flex flex-col ${alignToLeft ? 'items-start text-left justify-start' : 'items-center text-center justify-center'}`}
          style={{
            gap: `${TITLE_SUBTITLE_GAP}px`,
            transform: alignToLeft ? 'none' : `translateX(${titleTranslateX}px) translateY(${titleTranslateY}px)`,
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
          
          <div
            className="flex w-full items-center justify-between"
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(6px)`,
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              marginTop: '1px',
            }}
          >
            <span className="text-xl md:text-2xl font-light text-muted-foreground whitespace-nowrap block">
              {t(subtitleKey)}
            </span>

            <div className="w-[220px] sm:w-[260px] md:w-[320px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, tags, or publisher"
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-border/50 bg-background/90 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all"
              />
            </div>
            </div>
          </div>
          </div>
        </div>

      {/* Description - Fades out */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl text-center px-6 z-10"
        style={{
          top: '26%',
          // Fade even faster as soon as the user starts scrolling
          opacity: Math.max(0, 1 - easedProgress * 10),
          transform: `translateX(-50%) translateY(${easedProgress * -25}px)`,
          pointerEvents: progress > 0.02 ? 'none' : 'auto',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t('library.heroDesc')}</p>
      </div>

      {/* Tab Selector - Fades out, positioned below description */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-30"
        style={{
          top: '42%',
          opacity: 1 - easedProgress * 2.5,
          transform: `translateX(-50%) translateY(${easedProgress * -20}px)`,
          pointerEvents: progress > 0.3 ? 'none' : 'auto',
        }}
      >
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
                <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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

      {/* Filter Bar - sits under subtitle, full width */}
      <div
        className="absolute left-0 right-0 z-30 px-6 sm:px-10 lg:px-16"
        style={{
          top: '18vh',
          opacity: alignToLeft ? 1 : 0,
          transform: `translateY(${alignToLeft ? 0 : 8}px)`,
          pointerEvents: alignToLeft ? 'auto' : 'none',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {activeTab === 'video' && (
          <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex flex-nowrap gap-2 min-w-max pb-1">
              {/* All 选项 */}
              <button
                key="all"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border/60 text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {t('library.all')}
            </button>
              {/* 从 API 数据中动态生成的分类 */}
              {videoCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border/60 text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
          </div>
        )}
        </div>

      {/* Cards Container - Positioned at bottom initially, moves to top when expanded */}
      <div
        className="absolute left-0 right-0 z-10 overflow-visible"
        style={{
          top: easedProgress > 0.5 ? '30vh' : 'auto',
          bottom: easedProgress > 0.5 ? 'auto' : `${-15 + easedProgress * 30}%`,
          height: easedProgress > 0.5 ? 'auto' : '65%',
        }}
      >
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />

        {/* Video Cards */}
        <div 
          className="relative w-full h-full flex items-end justify-center overflow-visible" 
          style={{ 
            minHeight: easedProgress > 0.5 ? '420px' : 'auto',
            display: activeTab === 'video' ? 'flex' : 'none',
          }}
        >
            {filteredVideoItems.map((item, index) => {
              const totalCards = filteredVideoItems.length;
              const activeIndex = clampIndex(activeCardIndex.video ?? Math.floor(totalCards / 2), totalCards);
              const layout = buildFanLayout(index, totalCards, activeIndex);

              const currentHeight = 340 + easedProgress * 80;
              const isActiveCard = index === activeIndex;

              const offsetX = isExpanded ? cardOffsets.video : 0;
              const baseX = layout.currentX + offsetX;
              const baseY = layout.currentY;
              const baseTransform = `perspective(1200px) translateX(${baseX}px) translateY(${baseY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
              const hoverTransform = `perspective(1200px) translateX(${baseX}px) translateY(${baseY - 18}px) rotate(0deg) rotateY(0deg) scale(${layout.currentScale + 0.06})`;
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
                  onClick={async () => {
                    setActiveForTab('video', index, totalCards);
                    if (isExpanded) {
                      // 获取详情数据
                      try {
                        const detailResponse = await fetchMaterialSquareDetail(item.id);
                        setSelectedItem(detailResponse.data);
                      } catch (error) {
                        console.error('Failed to fetch video detail:', error);
                        setSelectedItem(item as any);
                      }
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isExpanded) {
                      e.currentTarget.style.transform = hoverTransform;
                      e.currentTarget.style.zIndex = '1000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = baseTransform;
                    e.currentTarget.style.zIndex = String(zIndex);
                  }}
                >
                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted">
                  <video 
                    src={item.sourceUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                      className="w-full h-full object-cover rounded-[inherit]"
                    onMouseEnter={(e) => {
                        if (isExpanded) {
                          e.currentTarget.currentTime = 0;
                          e.currentTarget.play().catch(() => {});
                        }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[inherit]" />
                    <div className="absolute top-3 left-3">
                      <p className="text-white/60 text-xs font-medium">{item.publisher}</p>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3 text-white mb-2 transition-opacity duration-300" style={{ opacity: easedProgress }}>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(item.likeCount ?? 0)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(item.viewCount ?? 0)}</span>
                        </span>
                      </div>
                      <p className="text-white text-sm font-bold leading-tight drop-shadow-lg line-clamp-2">{item.title}</p>
                    </div>
                    <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>

        {/* Voice Cards */}
        <div 
          className="relative w-full h-full flex items-end justify-center overflow-visible" 
          style={{ 
            minHeight: easedProgress > 0.5 ? '420px' : 'auto',
            display: activeTab === 'voice' ? 'flex' : 'none',
          }}
        >
            {filteredVoiceItems.map((item, index) => {
              const totalCards = filteredVoiceItems.length;
              const activeIndex = clampIndex(activeCardIndex.voice ?? Math.floor(totalCards / 2), totalCards);
              const layout = buildFanLayout(index, totalCards, activeIndex);

              const currentHeight = 340 + easedProgress * 80;
              const isActiveCard = index === activeIndex;

              const baseTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
              const hoverTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY - 18}px) rotate(0deg) rotateY(0deg) scale(${layout.currentScale + 0.06})`;
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
                  onClick={async () => {
                    setActiveForTab('voice', index, totalCards);
                    if (isExpanded) {
                      // 获取详情数据
                      try {
                        const detailResponse = await fetchMaterialSquareAudioDetail(item.id);
                        setSelectedItem(detailResponse.data);
                      } catch (error) {
                        console.error('Failed to fetch audio detail:', error);
                        setSelectedItem(item as any);
                      }
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isExpanded) {
                      e.currentTarget.style.transform = hoverTransform;
                      e.currentTarget.style.zIndex = '1000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = baseTransform;
                    e.currentTarget.style.zIndex = String(zIndex);
                  }}
                >
                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-muted">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover rounded-[inherit]" />
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
                      <div className="flex items-center gap-3 text-white mb-2 transition-opacity duration-300" style={{ opacity: easedProgress }}>
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          <span className="text-xs">{formatNumber(item.plays ?? 0)}</span>
                  </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{formatNumber(item.likes ?? 0)}</span>
                    </span>
                      </div>
                      <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{item.title}</p>
                    </div>
                    <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                  </div>
                </div>
              );
            })}
                  </div>
                  
        {/* Model Cards */}
        <div 
          className="relative w-full h-full flex items-end justify-center overflow-visible" 
          style={{ 
            minHeight: easedProgress > 0.5 ? '420px' : 'auto',
            display: activeTab === 'model' ? 'flex' : 'none',
          }}
        >
            {filteredModelItems.map((item, index) => {
              const totalCards = filteredModelItems.length;
              const activeIndex = clampIndex(activeCardIndex.model ?? Math.floor(totalCards / 2), totalCards);
              const layout = buildFanLayout(index, totalCards, activeIndex);

              const currentHeight = 340 + easedProgress * 80;
              const isActiveCard = index === activeIndex;

              const baseTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY}px) rotate(${layout.currentRotation}deg) rotateY(${layout.tiltY}deg) scale(${layout.currentScale})`;
              const hoverTransform = `perspective(1200px) translateX(${layout.currentX}px) translateY(${layout.currentY - 18}px) rotate(0deg) rotateY(0deg) scale(${layout.currentScale + 0.06})`;
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
                  onClick={async () => {
                    setActiveForTab('model', index, totalCards);
                    if (isExpanded) {
                      // 获取详情数据
                      try {
                        const detailResponse = await fetchMaterialSquareModelDetail(item.id);
                        setSelectedItem(detailResponse.data);
                      } catch (error) {
                        console.error('Failed to fetch model detail:', error);
                        setSelectedItem(item as any);
                      }
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isExpanded) {
                      e.currentTarget.style.transform = hoverTransform;
                      e.currentTarget.style.zIndex = '1000';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = baseTransform;
                    e.currentTarget.style.zIndex = String(zIndex);
                  }}
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
                      <div className="flex items-center gap-3 text-white mb-2 transition-opacity duration-300" style={{ opacity: easedProgress }}>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span className="text-xs">{formatNumber(item.downloads ?? 0)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{formatNumber(item.likes ?? 0)}</span>
                    </span>
                  </div>
                      <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{item.name}</p>
                    </div>
                    <div className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 right-4 w-1 h-20 bg-muted/30 rounded-full overflow-hidden z-20">
        <div className="w-full bg-foreground/50 rounded-full transition-all duration-100" style={{ height: `${progress * 100}%` }} />
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" 
          onClick={() => setSelectedItem(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSelectedItem(null);
            }
          }}
        >
          <div 
            className="relative bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }} 
              className="absolute top-4 right-4 z-[101] p-2 rounded-full hover:bg-muted/30 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* 判断类型并渲染对应的详情 */}
            {('sourceUrl' in selectedItem) ? (
              // Video 详情
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                    <video src={selectedItem.sourceUrl} controls autoPlay className="w-full h-full object-cover" poster={selectedItem.sourceUrl} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-w-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4">{selectedItem.title}</h2>
                
                <div className="space-y-2 mb-5">
                  <p className="text-sm md:text-base">
                      <span className="text-muted-foreground">{t('library.publisher')}: </span>
                      <span className="text-foreground font-medium">{selectedItem.publisher || t('library.unknown')}</span>
                  </p>
                    {selectedItem.category && (
                  <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.category')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.category}</span>
                  </p>
                    )}
                    {selectedItem.purpose && (
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.purpose')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.purpose}</span>
                  </p>
                    )}
                    {selectedItem.targetAudience && (
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.audience')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.targetAudience}</span>
                  </p>
                    )}
                    {selectedItem.aiTech && (
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.aiAnalysis')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.aiTech}</span>
                  </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.viewCount ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.likeCount ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.commentCount ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.shareCount ?? 0).toLocaleString()}</span>
                  </div>
                </div>

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-sm font-medium rounded-full border border-border/20">
                      #{tag}
                    </span>
                  ))}
                </div>
                  )}

                <div className="flex gap-3">
                    {selectedItem.sourceUrl && (
                    <a 
                        href={selectedItem.sourceUrl}
                      download
                        className="flex-1 py-3 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                      {t('library.downloadVideo')}
                    </a>
                    )}
                    <button className="flex-1 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 relative group">
                      <Sparkles className="w-5 h-5" />
                      {t('library.replicate')}
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium text-foreground">{t('library.comingSoon')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : ('audioUrl' in selectedItem) ? (
              // Audio 详情
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                  <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                    <img src={selectedItem.thumbnail} alt={selectedItem.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Volume2 className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4">{selectedItem.title}</h2>

                  <div className="space-y-2 mb-5">
                    <p className="text-sm md:text-base">
                      <span className="text-muted-foreground">{t('library.publisher')}: </span>
                      <span className="text-foreground font-medium">{selectedItem.publisher || t('library.unknown')}</span>
                    </p>
                    {selectedItem.style && (
                      <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.style')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.style}</span>
                      </p>
                    )}
                    {selectedItem.duration && (
                      <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.duration')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.duration}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.plays ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.likes ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {selectedItem.audioUrl && (
                      <a
                        href={selectedItem.audioUrl}
                        download
                        className="flex-1 py-3 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        {t('library.downloadAudio')}
                    </a>
                  )}
                    <button className="flex-1 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 relative group">
                      <Sparkles className="w-5 h-5" />
                    {t('library.replicate')}
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium text-foreground">{t('library.comingSoon')}</span>
                      </div>
                  </button>
                </div>
              </div>
            </div>
            ) : (
              // Model 详情
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                  <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                    <img src={selectedItem.thumbnail} alt={selectedItem.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4">{selectedItem.name}</h2>

                  <div className="space-y-2 mb-5">
                    {selectedItem.style && (
                      <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.style')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.style}</span>
                      </p>
                    )}
                    {selectedItem.gender && (
                      <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.gender')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.gender}</span>
                      </p>
                    )}
                    {selectedItem.ethnicity && (
                      <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.ethnicity')}: </span>
                        <span className="text-foreground font-medium">{selectedItem.ethnicity}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.downloads ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{(selectedItem.likes ?? 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 relative group">
                      <Sparkles className="w-5 h-5" />
                      {t('library.replicate')}
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium text-foreground">{t('library.comingSoon')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
