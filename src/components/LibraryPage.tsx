import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X, Sparkles, ChevronLeft, ChevronRight, Video, Music, User, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LibraryItem {
  id: number;
  titleKey: string;
  type: 'video' | 'image' | 'audio' | 'template';
  publisher: string;
  publishDate: string;
  publishDateFull: string;
  videoTypeKey: string;
  purposeKey: string;
  audienceKey: string;
  aiAnalysisKey: string;
  videoUrl: string;
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  thumbnail: string;
  category: string;
}

interface VoiceItem {
  id: number;
  titleKey: string;
  publisher: string;
  duration: string;
  style: string;
  audioUrl: string;
  plays: number;
  likes: number;
  thumbnail: string;
}

interface ModelItem {
  id: number;
  name: string;
  style: string;
  gender: string;
  ethnicity: string;
  thumbnail: string;
  downloads: number;
  likes: number;
}

const mockVoiceItems: VoiceItem[] = [
  { id: 1, titleKey: 'library.voice.corporate', publisher: 'OranAI', duration: '0:30', style: 'Corporate', audioUrl: '#', plays: 12500, likes: 890, thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400' },
  { id: 2, titleKey: 'library.voice.emotional', publisher: 'OranAI', duration: '0:45', style: 'Emotional', audioUrl: '#', plays: 8900, likes: 720, thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' },
  { id: 3, titleKey: 'library.voice.energetic', publisher: 'OranAI', duration: '0:25', style: 'Energetic', audioUrl: '#', plays: 15600, likes: 1200, thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { id: 4, titleKey: 'library.voice.calm', publisher: 'OranAI', duration: '1:00', style: 'Calm', audioUrl: '#', plays: 6700, likes: 540, thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { id: 5, titleKey: 'library.voice.cinematic', publisher: 'OranAI', duration: '0:50', style: 'Cinematic', audioUrl: '#', plays: 11200, likes: 980, thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
  { id: 6, titleKey: 'library.voice.upbeat', publisher: 'OranAI', duration: '0:35', style: 'Upbeat', audioUrl: '#', plays: 9400, likes: 810, thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400' },
];

const mockModelItems: ModelItem[] = [
  { id: 1, name: 'Emma Chen', style: 'Fashion', gender: 'Female', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', downloads: 8900, likes: 1200 },
  { id: 2, name: 'Marcus Johnson', style: 'Corporate', gender: 'Male', ethnicity: 'African', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', downloads: 6500, likes: 890 },
  { id: 3, name: 'Sofia Martinez', style: 'Lifestyle', gender: 'Female', ethnicity: 'Hispanic', thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', downloads: 12400, likes: 1580 },
  { id: 4, name: 'Alex Kim', style: 'Sports', gender: 'Male', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', downloads: 7200, likes: 920 },
  { id: 5, name: 'Isabella Brown', style: 'Beauty', gender: 'Female', ethnicity: 'Caucasian', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', downloads: 15600, likes: 2100 },
  { id: 6, name: 'David Lee', style: 'Tech', gender: 'Male', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', downloads: 5400, likes: 680 },
];

const mockLibraryItems: LibraryItem[] = [
  {
    id: 1,
    titleKey: 'library.cocacola.title',
    type: 'video',
    publisher: 'Coca-Cola',
    publishDate: 'Nov 2024',
    publishDateFull: 'Nov 19, 2024',
    videoTypeKey: 'library.cocacola.type',
    purposeKey: 'library.cocacola.purpose',
    audienceKey: 'library.cocacola.audience',
    aiAnalysisKey: 'library.cocacola.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/BVCOGW.mp4',
    duration: '01:00',
    views: 2850000,
    likes: 48200,
    comments: 3150,
    shares: 12400,
    tags: ['Christmas', 'Holiday', 'AI', 'Animation'],
    thumbnail: 'https://img.youtube.com/vi/4RSTupbfGog/maxresdefault.jpg',
    category: 'food',
  },
  {
    id: 2,
    titleKey: 'library.mcdonalds.title',
    type: 'video',
    publisher: "McDonald's",
    publishDate: '2024',
    publishDateFull: '2024',
    videoTypeKey: 'library.mcdonalds.type',
    purposeKey: 'library.mcdonalds.purpose',
    audienceKey: 'library.mcdonalds.audience',
    aiAnalysisKey: 'library.mcdonalds.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ov76u.mp4',
    duration: '00:40',
    views: 1420000,
    likes: 25600,
    comments: 1820,
    shares: 6340,
    tags: ['Future', 'Tech', 'AI', 'Innovation'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 3,
    titleKey: 'library.nike.title',
    type: 'video',
    publisher: 'Audiovisual con IA',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 28, 2025',
    videoTypeKey: 'library.nike.type',
    purposeKey: 'library.nike.purpose',
    audienceKey: 'library.nike.audience',
    aiAnalysisKey: 'library.nike.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/8XDY2f.mp4',
    duration: '00:30',
    views: 980000,
    likes: 18400,
    comments: 920,
    shares: 4100,
    tags: ['Nike', 'AI Sports', 'Slow Motion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 4,
    titleKey: 'library.jeremyRazors.title',
    type: 'video',
    publisher: "Jeremy's Razors",
    publishDate: 'Feb 2025',
    publishDateFull: 'Feb 7, 2025',
    videoTypeKey: 'library.jeremyRazors.type',
    purposeKey: 'library.jeremyRazors.purpose',
    audienceKey: 'library.jeremyRazors.audience',
    aiAnalysisKey: 'library.jeremyRazors.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/IKqMZ0.mp4',
    duration: '00:35',
    views: 520000,
    likes: 12800,
    comments: 740,
    shares: 2900,
    tags: ['Razor', 'Metal', 'AI Render'],
    thumbnail: '',
    category: 'personal',
  },
  {
    id: 5,
    titleKey: 'library.zaraDor.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 5, 2024',
    videoTypeKey: 'library.zaraDor.type',
    purposeKey: 'library.zaraDor.purpose',
    audienceKey: 'library.zaraDor.audience',
    aiAnalysisKey: 'library.zaraDor.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/NWfxHT.mp4',
    duration: '00:32',
    views: 610000,
    likes: 14300,
    comments: 820,
    shares: 3100,
    tags: ['Zara', 'Concept', 'AI Fashion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 6,
    titleKey: 'library.hiamiHooch.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 31, 2024',
    videoTypeKey: 'library.hiamiHooch.type',
    purposeKey: 'library.hiamiHooch.purpose',
    audienceKey: 'library.hiamiHooch.audience',
    aiAnalysisKey: 'library.hiamiHooch.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ABq2l.mp4',
    duration: '00:28',
    views: 455000,
    likes: 11200,
    comments: 580,
    shares: 2400,
    tags: ['Beverage', 'Concept', 'Liquid FX'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 7,
    titleKey: 'library.dorSoda.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 15, 2024',
    videoTypeKey: 'library.dorSoda.type',
    purposeKey: 'library.dorSoda.purpose',
    audienceKey: 'library.dorSoda.audience',
    aiAnalysisKey: 'library.dorSoda.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/ENHpkU.mp4',
    duration: '00:33',
    views: 388000,
    likes: 9300,
    comments: 520,
    shares: 1800,
    tags: ['Soda', 'Concept', 'Motion'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 8,
    titleKey: 'library.roguePerfume.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 30, 2024',
    videoTypeKey: 'library.roguePerfume.type',
    purposeKey: 'library.roguePerfume.purpose',
    audienceKey: 'library.roguePerfume.audience',
    aiAnalysisKey: 'library.roguePerfume.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/adMqvZ.mp4',
    duration: '00:31',
    views: 442000,
    likes: 10100,
    comments: 610,
    shares: 2100,
    tags: ['Perfume', 'Luxury', 'Stylized'],
    thumbnail: '',
    category: 'fashion',
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

type TabType = 'video' | 'voice' | 'model';

const LibraryPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for animation (0 to 1)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Transition happens within first screen height
      const progress = Math.min(Math.max(scrollY / (windowHeight * 0.5), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'video' as TabType, labelKey: 'library.tab.video', icon: Video, sectionKey: 'library.section.video' },
    { id: 'voice' as TabType, labelKey: 'library.tab.voice', icon: Music, sectionKey: 'library.section.voice' },
    { id: 'model' as TabType, labelKey: 'library.tab.model', icon: User, sectionKey: 'library.section.model' },
  ];

  const previewVideoItems = mockLibraryItems.slice(0, 6);
  const previewVoiceItems = mockVoiceItems.slice(0, 6);
  const previewModelItems = mockModelItems.slice(0, 6);

  // Animation values based on scroll progress
  const isExpanded = scrollProgress > 0.5;
  
  // Title animation
  const titleScale = 1 - scrollProgress * 0.6; // 1 -> 0.4
  const titleX = scrollProgress * -40; // 0 -> -40%
  const titleY = scrollProgress * -35; // 0 -> -35%

  // Get current section subtitle
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const subtitleKey = currentTab?.sectionKey || 'library.section.video';

  return (
    <div ref={containerRef} className="min-h-[200vh]">
      {/* Fixed Container for Animations */}
      <div className="fixed inset-0 pt-20 overflow-hidden pointer-events-none">
        {/* Title - Animates from center to top-left */}
        <div 
          className="absolute transition-all duration-300 ease-out pointer-events-auto"
          style={{
            left: `calc(50% + ${titleX}%)`,
            top: `calc(20% + ${titleY}%)`,
            transform: `translate(-50%, -50%) scale(${titleScale})`,
          }}
        >
          <div className="flex items-baseline gap-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight whitespace-nowrap">
              {t('library.title')}
            </h1>
            {/* Subtitle - Fades in */}
            <span 
              className="text-3xl md:text-4xl font-light text-muted-foreground whitespace-nowrap transition-opacity duration-500"
              style={{ opacity: scrollProgress }}
            >
              {t(subtitleKey)}
            </span>
          </div>
        </div>

        {/* Description - Fades out */}
        <div 
          className="absolute left-1/2 top-[32%] -translate-x-1/2 max-w-3xl text-center px-6 transition-opacity duration-300"
          style={{ opacity: 1 - scrollProgress * 2 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('library.heroDesc')}
          </p>
        </div>

        {/* Tab Selector - Fades out as we scroll */}
        <div 
          className="absolute left-1/2 top-[45%] -translate-x-1/2 transition-opacity duration-300 pointer-events-auto"
          style={{ opacity: 1 - scrollProgress * 2 }}
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

        {/* Cards Container */}
        <div 
          className="absolute left-0 right-0 transition-all duration-500 ease-out pointer-events-auto"
          style={{
            top: isExpanded ? '25%' : '55%',
            height: isExpanded ? '70%' : '45%',
          }}
        >
          {/* Video Cards */}
          {activeTab === 'video' && (
            <div className="relative w-full h-full flex items-center justify-center px-6">
              {previewVideoItems.map((item, index) => {
                const totalCards = previewVideoItems.length;
                const centerIndex = (totalCards - 1) / 2;
                const distanceFromCenter = index - centerIndex;
                
                // Fan layout (initial state)
                const fanRotation = distanceFromCenter * 12;
                const arcRadius = 400;
                const angleRad = (fanRotation * Math.PI) / 180;
                const fanX = Math.sin(angleRad) * arcRadius;
                const fanY = -Math.cos(angleRad) * arcRadius + arcRadius;
                
                // Linear layout (expanded state)
                const cardWidth = 180;
                const gap = 16;
                const totalWidth = totalCards * cardWidth + (totalCards - 1) * gap;
                const startX = -totalWidth / 2 + cardWidth / 2;
                const linearX = startX + index * (cardWidth + gap);
                const linearY = 0;
                
                // Interpolate between states
                const currentX = fanX + (linearX - fanX) * scrollProgress;
                const currentY = fanY + (linearY - fanY) * scrollProgress;
                const currentRotation = fanRotation * (1 - scrollProgress);
                const currentHeight = 280 + scrollProgress * 120; // Taller when expanded
                
                const zIndex = totalCards - Math.abs(Math.round(distanceFromCenter));
                
                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      top: '50%',
                      marginLeft: `-${cardWidth / 2}px`,
                      marginTop: `-${currentHeight / 2}px`,
                      transformOrigin: 'center center',
                      transform: `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`,
                      zIndex: isExpanded ? index : zIndex,
                    }}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={(e) => {
                      if (isExpanded) {
                        e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY - 20}px) rotate(0deg) scale(1.05)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`;
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-muted">
                      <video
                        src={item.videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {item.duration && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded">
                          {item.duration}
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        {isExpanded && (
                          <div className="flex items-center gap-3 text-white mb-2">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm font-medium">{formatNumber(item.likes)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-medium">{formatNumber(item.views)}</span>
                            </span>
                          </div>
                        )}
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg line-clamp-2">{t(item.titleKey)}</p>
                        {isExpanded && (
                          <p className="text-white/70 text-xs mt-1">@{item.publisher.replace(/\s+/g, '').toLowerCase()}</p>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Voice Cards */}
          {activeTab === 'voice' && (
            <div className="relative w-full h-full flex items-center justify-center px-6">
              {previewVoiceItems.map((item, index) => {
                const totalCards = previewVoiceItems.length;
                const centerIndex = (totalCards - 1) / 2;
                const distanceFromCenter = index - centerIndex;
                
                const fanRotation = distanceFromCenter * 12;
                const arcRadius = 350;
                const angleRad = (fanRotation * Math.PI) / 180;
                const fanX = Math.sin(angleRad) * arcRadius;
                const fanY = -Math.cos(angleRad) * arcRadius + arcRadius;
                
                const cardWidth = 180;
                const gap = 16;
                const totalWidth = totalCards * cardWidth + (totalCards - 1) * gap;
                const startX = -totalWidth / 2 + cardWidth / 2;
                const linearX = startX + index * (cardWidth + gap);
                const linearY = 0;
                
                const currentX = fanX + (linearX - fanX) * scrollProgress;
                const currentY = fanY + (linearY - fanY) * scrollProgress;
                const currentRotation = fanRotation * (1 - scrollProgress);
                const currentHeight = 220 + scrollProgress * 80;
                
                const zIndex = totalCards - Math.abs(Math.round(distanceFromCenter));
                
                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      top: '50%',
                      marginLeft: `-${cardWidth / 2}px`,
                      marginTop: `-${currentHeight / 2}px`,
                      transformOrigin: 'center center',
                      transform: `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`,
                      zIndex: isExpanded ? index : zIndex,
                    }}
                    onMouseEnter={(e) => {
                      if (isExpanded) {
                        e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY - 20}px) rotate(0deg) scale(1.05)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`;
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-muted">
                      <img src={item.thumbnail} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Volume2 className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 right-3">
                        <p className="text-white/60 text-xs font-medium">{item.style} • {item.duration}</p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        {isExpanded && (
                          <div className="flex items-center gap-3 text-white mb-2">
                            <span className="flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              <span className="text-xs">{formatNumber(item.plays)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{formatNumber(item.likes)}</span>
                            </span>
                          </div>
                        )}
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{t(item.titleKey)}</p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Model Cards */}
          {activeTab === 'model' && (
            <div className="relative w-full h-full flex items-center justify-center px-6">
              {previewModelItems.map((item, index) => {
                const totalCards = previewModelItems.length;
                const centerIndex = (totalCards - 1) / 2;
                const distanceFromCenter = index - centerIndex;
                
                const fanRotation = distanceFromCenter * 12;
                const arcRadius = 380;
                const angleRad = (fanRotation * Math.PI) / 180;
                const fanX = Math.sin(angleRad) * arcRadius;
                const fanY = -Math.cos(angleRad) * arcRadius + arcRadius;
                
                const cardWidth = 180;
                const gap = 16;
                const totalWidth = totalCards * cardWidth + (totalCards - 1) * gap;
                const startX = -totalWidth / 2 + cardWidth / 2;
                const linearX = startX + index * (cardWidth + gap);
                const linearY = 0;
                
                const currentX = fanX + (linearX - fanX) * scrollProgress;
                const currentY = fanY + (linearY - fanY) * scrollProgress;
                const currentRotation = fanRotation * (1 - scrollProgress);
                const currentHeight = 260 + scrollProgress * 100;
                
                const zIndex = totalCards - Math.abs(Math.round(distanceFromCenter));
                
                return (
                  <div
                    key={item.id}
                    className="absolute cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${currentHeight}px`,
                      left: '50%',
                      top: '50%',
                      marginLeft: `-${cardWidth / 2}px`,
                      marginTop: `-${currentHeight / 2}px`,
                      transformOrigin: 'center center',
                      transform: `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`,
                      zIndex: isExpanded ? index : zIndex,
                    }}
                    onMouseEnter={(e) => {
                      if (isExpanded) {
                        e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY - 20}px) rotate(0deg) scale(1.05)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${currentRotation}deg)`;
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-muted">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 right-3">
                        <p className="text-white/60 text-xs font-medium">{item.style} • {item.gender}</p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        {isExpanded && (
                          <div className="flex items-center gap-3 text-white mb-2">
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span className="text-xs">{formatNumber(item.downloads)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{formatNumber(item.likes)}</span>
                            </span>
                          </div>
                        )}
                        <p className="text-white text-sm font-bold leading-tight drop-shadow-lg">{item.name}</p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scroll Indicator - Fades out */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300"
          style={{ opacity: 1 - scrollProgress * 3 }}
        >
          <span className="text-sm">{t('library.scrollToExplore')}</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1 animate-bounce">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                  <video 
                    src={selectedItem.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    poster={selectedItem.thumbnail}
                  />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-w-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4">{t(selectedItem.titleKey)}</h2>
                
                <div className="space-y-2 mb-5">
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">Publisher: </span>
                    <span className="text-foreground font-medium">{selectedItem.publisher}</span>
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
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-sm font-medium rounded-full border border-border/20"
                    >
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
