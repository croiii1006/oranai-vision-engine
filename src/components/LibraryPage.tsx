import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LibraryItem {
  id: number;
  title: string;
  type: 'video' | 'image' | 'audio' | 'template';
  publisher: string;
  publisherRole: string;
  publishDate: string;
  publishDateFull: string;
  description: string;
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  thumbnail: string;
}

const mockLibraryItems: LibraryItem[] = [
  {
    id: 1,
    title: 'Social Trend Monitoring for Beauty Brands',
    type: 'video',
    publisher: 'ORANAI Research',
    publisherRole: 'Market Intelligence',
    publishDate: '3 days ago',
    publishDateFull: 'Jan 12, 2025',
    description: 'This video demonstrates how ORANAI analyzes real-time social media signals to identify emerging market trends, competitive movements, and consumer sentiment shifts in the beauty industry.',
    duration: '00:36',
    views: 12482,
    likes: 328,
    comments: 42,
    shares: 19,
    tags: ['MarketInsight', 'BeautyTrends', 'AIAnalytics'],
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=700&fit=crop',
  },
  {
    id: 2,
    title: 'AI-driven Consumer Insight Overview',
    type: 'video',
    publisher: 'ORANAI Insight Lab',
    publisherRole: 'Consumer Research',
    publishDate: '1 week ago',
    publishDateFull: 'Jan 8, 2025',
    description: 'Explore how our AI models process consumer feedback data to generate actionable insights for brand positioning and product development strategies.',
    duration: '00:58',
    views: 8934,
    likes: 256,
    comments: 31,
    shares: 14,
    tags: ['ConsumerBehavior', 'AIInsights', 'DataAnalysis'],
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=700&fit=crop',
  },
  {
    id: 3,
    title: 'Real-time Dashboard Demo',
    type: 'video',
    publisher: 'ORANAI Product',
    publisherRole: 'Product Demo',
    publishDate: '2 weeks ago',
    publishDateFull: 'Jan 2, 2025',
    description: 'A walkthrough of our real-time market signal dashboard, showcasing trend detection, competitor monitoring, and sentiment analysis features.',
    duration: '01:24',
    views: 6721,
    likes: 189,
    comments: 28,
    shares: 11,
    tags: ['ProductDemo', 'Dashboard', 'MarketSignals'],
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=700&fit=crop',
  },
  {
    id: 4,
    title: 'Brand Health Metrics Explained',
    type: 'video',
    publisher: 'ORANAI Research',
    publisherRole: 'Brand Analytics',
    publishDate: '3 weeks ago',
    publishDateFull: 'Dec 26, 2024',
    description: 'Understanding the key metrics that define brand health: reputation score, sentiment trends, share of voice, and crisis early warning indicators.',
    duration: '00:45',
    views: 5432,
    likes: 167,
    comments: 23,
    shares: 8,
    tags: ['BrandHealth', 'Metrics', 'Analytics'],
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=700&fit=crop',
  },
  {
    id: 5,
    title: 'Competitive Intelligence Framework',
    type: 'video',
    publisher: 'ORANAI Insight Lab',
    publisherRole: 'Strategy Research',
    publishDate: '1 month ago',
    publishDateFull: 'Dec 15, 2024',
    description: 'Learn how to leverage AI-powered competitive intelligence to stay ahead of market movements and identify strategic opportunities.',
    duration: '01:02',
    views: 4218,
    likes: 134,
    comments: 19,
    shares: 7,
    tags: ['CompetitiveIntel', 'Strategy', 'MarketAnalysis'],
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=700&fit=crop',
  },
  {
    id: 6,
    title: 'Content Generation Tutorial',
    type: 'video',
    publisher: 'ORANAI Product',
    publisherRole: 'Creative Tools',
    publishDate: '1 month ago',
    publishDateFull: 'Dec 10, 2024',
    description: 'Step-by-step guide to using ORANAI content generation tools for creating on-brand marketing materials across multiple formats.',
    duration: '01:15',
    views: 3156,
    likes: 98,
    comments: 15,
    shares: 5,
    tags: ['ContentGen', 'Tutorial', 'CreativeAI'],
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop',
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
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
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
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Thumbnail */}
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Play button */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Duration badge */}
              {item.duration && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded">
                  {item.duration}
                </span>
              )}
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
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
                  {item.title}
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
            className="bg-background rounded-3xl p-6 md:p-8 max-w-5xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Media Preview - Phone style */}
              <div className="lg:w-[280px] flex-shrink-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30">
                  <img 
                    src={selectedItem.thumbnail} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  {selectedItem.duration && (
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 text-white text-sm font-medium rounded">
                      {selectedItem.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col">
                {/* Primary: Title */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">{selectedItem.title}</h2>
                
                {/* Secondary: Publisher Info */}
                <div className="space-y-1.5 mb-5">
                  <p className="text-base">
                    <span className="text-muted-foreground">Publisher: </span>
                    <span className="text-foreground font-medium">{selectedItem.publisher}</span>
                  </p>
                  <p className="text-base">
                    <span className="text-muted-foreground">Role: </span>
                    <span className="text-foreground font-medium">{selectedItem.publisherRole}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Published on {selectedItem.publishDateFull}
                  </p>
                </div>

                {/* Tertiary: Description */}
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  {selectedItem.description}
                </p>

                {/* Stats - Large numbers with labels */}
                <div className="flex items-center gap-8 mb-8 py-5 border-y border-border/30">
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xl font-bold text-foreground">{selectedItem.views.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">Views</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xl font-bold text-foreground">{selectedItem.likes}</span>
                    <span className="text-sm text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xl font-bold text-foreground">{selectedItem.comments}</span>
                    <span className="text-sm text-muted-foreground">Comments</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xl font-bold text-foreground">{selectedItem.shares}</span>
                    <span className="text-sm text-muted-foreground">Shares</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {selectedItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-muted/30 text-muted-foreground text-sm font-medium rounded-full border border-border/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    {t('library.download')}
                  </button>
                  <button className="flex-1 py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
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
