import React, { useState } from 'react';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X } from 'lucide-react';
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
    duration: '02:36',
    views: 12482,
    likes: 328,
    comments: 42,
    shares: 19,
    tags: ['MarketInsight', 'BeautyTrends', 'AIAnalytics'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
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
    duration: '05:12',
    views: 8934,
    likes: 256,
    comments: 31,
    shares: 14,
    tags: ['ConsumerBehavior', 'AIInsights', 'DataAnalysis'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Real-time Dashboard Demo: Market Signals',
    type: 'video',
    publisher: 'ORANAI Product Team',
    publisherRole: 'Product Demo',
    publishDate: '2 weeks ago',
    publishDateFull: 'Jan 2, 2025',
    description: 'A walkthrough of our real-time market signal dashboard, showcasing trend detection, competitor monitoring, and sentiment analysis features.',
    duration: '03:48',
    views: 6721,
    likes: 189,
    comments: 28,
    shares: 11,
    tags: ['ProductDemo', 'Dashboard', 'MarketSignals'],
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
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
    duration: '04:15',
    views: 5432,
    likes: 167,
    comments: 23,
    shares: 8,
    tags: ['BrandHealth', 'Metrics', 'Analytics'],
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
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
    duration: '06:22',
    views: 4218,
    likes: 134,
    comments: 19,
    shares: 7,
    tags: ['CompetitiveIntel', 'Strategy', 'MarketAnalysis'],
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'Content Generation Workflow Tutorial',
    type: 'video',
    publisher: 'ORANAI Product Team',
    publisherRole: 'Creative Tools',
    publishDate: '1 month ago',
    publishDateFull: 'Dec 10, 2024',
    description: 'Step-by-step guide to using ORANAI content generation tools for creating on-brand marketing materials across multiple formats.',
    duration: '07:45',
    views: 3156,
    likes: 98,
    comments: 15,
    shares: 5,
    tags: ['ContentGen', 'Tutorial', 'CreativeAI'],
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
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
    { id: 'all', label: t('library.all') },
    { id: 'image', label: t('library.image') },
    { id: 'video', label: t('library.video') },
    { id: 'audio', label: t('library.audio') },
    { id: 'template', label: t('library.template') },
  ];

  const filteredItems = mockLibraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-muted/20 rounded-2xl overflow-hidden cursor-pointer hover:bg-muted/30 transition-all border border-border/10"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.type === 'video' && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-foreground ml-1" />
                      </div>
                    </div>
                    {item.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 text-foreground text-xs font-medium rounded">
                        {item.duration}
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{item.publisher}</span>
                  <span>{item.publishDate}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(item.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {formatNumber(item.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {item.comments}
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
              {/* Media Preview */}
              <div className="flex-1 relative">
                <div className="relative aspect-video bg-muted/30 rounded-2xl overflow-hidden">
                  <img 
                    src={selectedItem.thumbnail} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center cursor-pointer hover:bg-background transition-colors">
                      <Play className="w-7 h-7 text-foreground ml-1" />
                    </div>
                  </div>
                  {selectedItem.duration && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-background/80 text-foreground text-sm font-medium rounded">
                      {selectedItem.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{selectedItem.title}</h2>
                
                {/* Publisher Info */}
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">Publisher: </span>
                    {selectedItem.publisher}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">Role: </span>
                    {selectedItem.publisherRole}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Published on {selectedItem.publishDateFull}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 py-4 border-y border-border/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{selectedItem.views.toLocaleString()}</span>
                    <span className="text-muted-foreground">Views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{selectedItem.likes}</span>
                    <span className="text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{selectedItem.comments}</span>
                    <span className="text-muted-foreground">Comments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{selectedItem.shares}</span>
                    <span className="text-muted-foreground">Shares</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-xs font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button className="mt-auto w-full py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  {t('library.download')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
