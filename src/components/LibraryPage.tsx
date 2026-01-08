import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
    videoUrl: 'https://www.youtube.com/watch?v=cO_-H9_MdAA',
    duration: '00:30',
    views: 1420000,
    likes: 25600,
    comments: 1820,
    shares: 6340,
    tags: ['Future', 'Tech', 'AI', 'Innovation'],
    thumbnail: 'https://img.youtube.com/vi/cO_-H9_MdAA/maxresdefault.jpg',
    category: 'food',
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const LibraryPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filters = [
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

  const filteredItems = mockLibraryItems.filter(item => {
    const title = t(item.titleKey);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('library.title')}
          </h1>
          
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>
            <button className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs with horizontal scroll */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('filter-scroll');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="flex-shrink-0 p-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Filter Container */}
            <div 
              id="filter-scroll"
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    activeFilter === filter.id
                      ? 'bg-foreground text-background'
                      : 'border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {t(filter.labelKey)}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('filter-scroll');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="flex-shrink-0 p-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Library Grid - TikTok style vertical cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isMp4 = item.videoUrl.endsWith('.mp4');
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Video element for mp4 - shows first frame as thumbnail, plays on hover */}
                {isMp4 ? (
                  <video 
                    src={item.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget;
                      video.currentTime = 0;
                      video.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : null}
                
                {/* Thumbnail - only for non-mp4 */}
                {!isMp4 && (
                  <img 
                    src={item.thumbnail} 
                    alt={t(item.titleKey)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                
                {/* Play button - hide for mp4 on hover since video plays */}
                {item.type === 'video' && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity z-20 pointer-events-none ${isMp4 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                {item.duration && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded z-20">
                    {item.duration}
                  </span>
                )}
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                  {/* Stats - prominent display at top */}
                  <div className="flex items-center gap-4 text-white mb-3">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5" />
                      <span className="text-base font-bold">{formatNumber(item.likes)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-base font-bold">{item.comments}</span>
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white text-base font-bold mb-1.5 line-clamp-2 drop-shadow-lg leading-tight">
                    {t(item.titleKey)}
                  </h3>
                  
                  {/* Publisher & Views */}
                  <div className="flex items-center justify-between text-white/80">
                    <span className="text-sm">@{item.publisher.replace(/\s+/g, '').toLowerCase()}</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" />
                      {formatNumber(item.views)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Media Preview - Phone style */}
              <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                  {selectedItem.videoUrl.endsWith('.mp4') ? (
                    <video 
                      src={selectedItem.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      poster={selectedItem.thumbnail}
                    />
                  ) : (
                    <>
                      <img 
                        src={selectedItem.thumbnail} 
                        alt={t(selectedItem.titleKey)}
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={selectedItem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </a>
                    </>
                  )}
                  {selectedItem.duration && !selectedItem.videoUrl.endsWith('.mp4') && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 text-white text-xs font-medium rounded">
                      {selectedItem.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Primary: Title */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4 break-words">{t(selectedItem.titleKey)}</h2>
                
                {/* Secondary: Publisher Info */}
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
                    <span className="text-foreground font-medium break-words">{t(selectedItem.purposeKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.audience')}: </span>
                    <span className="text-foreground font-medium break-words">{t(selectedItem.audienceKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.aiAnalysis')}: </span>
                    <span className="text-foreground font-medium break-words">{t(selectedItem.aiAnalysisKey)}</span>
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Published: {selectedItem.publishDateFull}
                  </p>
                </div>

                {/* Stats - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.views.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.likes.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.comments.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.shares.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Shares</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-xs md:text-sm font-medium rounded-full border border-border/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {selectedItem.videoUrl.endsWith('.mp4') ? (
                    <a 
                      href={selectedItem.videoUrl}
                      download
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      {t('library.downloadVideo')}
                    </a>
                  ) : (
                    <a 
                      href={selectedItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                      {t('library.watchVideo')}
                    </a>
                  )}
                  <button className="flex-1 py-3 md:py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
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
