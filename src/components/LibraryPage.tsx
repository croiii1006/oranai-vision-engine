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

// Voice/Audio mock data
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

// Model mock data
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
  const heroRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for animation
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'video' as TabType, labelKey: 'library.tab.video', icon: Video },
    { id: 'voice' as TabType, labelKey: 'library.tab.voice', icon: Music },
    { id: 'model' as TabType, labelKey: 'library.tab.model', icon: User },
  ];

  // Get 6 items for stacked preview
  const previewVideoItems = mockLibraryItems.slice(0, 6);
  const previewVoiceItems = mockVoiceItems.slice(0, 6);
  const previewModelItems = mockModelItems.slice(0, 6);

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section - First Screen */}
      <div ref={heroRef} className="min-h-screen flex flex-col pt-24">
        {/* Top Half - Title and Description */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
            {t('library.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {t('library.heroDesc')}
          </p>
        </div>

        {/* Bottom Half - Tabs and Stacked Cards */}
        <div className="flex-1 flex flex-col items-center px-6 pb-12">
          {/* Tab Selector */}
          <div className="flex items-center gap-3 mb-12">
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

          {/* Stacked Cards Preview */}
          <div className="relative w-full max-w-4xl h-[300px] flex items-center justify-center">
            {activeTab === 'video' && (
              <div className="relative w-full h-full flex items-end justify-center">
                {previewVideoItems.map((item, index) => {
                  const offset = (index - 2.5) * 60;
                  const zIndex = 6 - Math.abs(index - 2.5);
                  const scale = 1 - Math.abs(index - 2.5) * 0.05;
                  const opacity = 1 - Math.abs(index - 2.5) * 0.15;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute w-36 h-52 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer hover:scale-110"
                      style={{
                        transform: `translateX(${offset}px) scale(${scale}) translateY(${Math.abs(index - 2.5) * 10}px)`,
                        zIndex: Math.round(zIndex),
                        opacity,
                      }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <video
                        src={item.videoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">{t(item.titleKey)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="relative w-full h-full flex items-end justify-center">
                {previewVoiceItems.map((item, index) => {
                  const offset = (index - 2.5) * 60;
                  const zIndex = 6 - Math.abs(index - 2.5);
                  const scale = 1 - Math.abs(index - 2.5) * 0.05;
                  const opacity = 1 - Math.abs(index - 2.5) * 0.15;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute w-36 h-36 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer hover:scale-110"
                      style={{
                        transform: `translateX(${offset}px) scale(${scale}) translateY(${Math.abs(index - 2.5) * 10}px)`,
                        zIndex: Math.round(zIndex),
                        opacity,
                      }}
                    >
                      <img src={item.thumbnail} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">{t(item.titleKey)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'model' && (
              <div className="relative w-full h-full flex items-end justify-center">
                {previewModelItems.map((item, index) => {
                  const offset = (index - 2.5) * 60;
                  const zIndex = 6 - Math.abs(index - 2.5);
                  const scale = 1 - Math.abs(index - 2.5) * 0.05;
                  const opacity = 1 - Math.abs(index - 2.5) * 0.15;
                  
                  return (
                    <div
                      key={item.id}
                      className="absolute w-36 h-48 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer hover:scale-110"
                      style={{
                        transform: `translateX(${offset}px) scale(${scale}) translateY(${Math.abs(index - 2.5) * 10}px)`,
                        zIndex: Math.round(zIndex),
                        opacity,
                      }}
                    >
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                        <p className="text-white/70 text-[10px]">{item.style}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-sm">{t('library.scrollToExplore')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: AI Video */}
      <div className="min-h-screen py-24 px-6 sm:px-10 lg:px-16">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{t('library.title')}</h2>
          <span className="text-3xl md:text-4xl font-light text-muted-foreground">{t('library.section.video')}</span>
        </div>
        
        {/* Horizontal Scrolling Video Grid */}
        <div className="relative">
          <div 
            className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mockLibraryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative flex-shrink-0 w-[240px] aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
              >
                <video 
                  src={item.videoUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                {item.duration && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded">
                    {item.duration}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
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
                  <h3 className="text-white text-sm font-bold line-clamp-2">{t(item.titleKey)}</h3>
                  <p className="text-white/70 text-xs mt-1">@{item.publisher.replace(/\s+/g, '').toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: AI Voice/Music */}
      <div className="min-h-screen py-24 px-6 sm:px-10 lg:px-16 bg-muted/20">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{t('library.title')}</h2>
          <span className="text-3xl md:text-4xl font-light text-muted-foreground">{t('library.section.voice')}</span>
        </div>
        
        {/* Voice/Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVoiceItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-background rounded-2xl p-6 border border-border/30 hover:border-foreground/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.thumbnail} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-1 truncate">{t(item.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.style} • {item.duration}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {formatNumber(item.plays)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(item.likes)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Audio Waveform Visual */}
              <div className="mt-4 h-12 flex items-center justify-center gap-0.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-foreground/20 group-hover:bg-primary/50 rounded-full transition-all duration-300"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: AI Model */}
      <div className="min-h-screen py-24 px-6 sm:px-10 lg:px-16">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">{t('library.title')}</h2>
          <span className="text-3xl md:text-4xl font-light text-muted-foreground">{t('library.section.model')}</span>
        </div>
        
        {/* Model Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockModelItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={item.thumbnail} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Always visible name badge */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                <p className="text-white/70 text-sm">{item.style} • {item.gender}</p>
              </div>
              
              {/* Hover stats */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex items-center gap-1 text-white text-sm bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Download className="w-3 h-3" />
                  {formatNumber(item.downloads)}
                </span>
                <span className="flex items-center gap-1 text-white text-sm bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Heart className="w-3 h-3" />
                  {formatNumber(item.likes)}
                </span>
              </div>
            </div>
          ))}
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
              {/* Media Preview */}
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
              
              {/* Details */}
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
