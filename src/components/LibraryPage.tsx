import React, { useState } from 'react';
import { Search, ArrowUp, Play, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LibraryPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filters = [
    { id: 'all', label: t('library.all') },
    { id: 'image', label: t('library.image') },
    { id: 'video', label: t('library.video') },
    { id: 'audio', label: t('library.audio') },
    { id: 'template', label: t('library.template') },
  ];

  const libraryItems = [
    { id: 1, title: 'Video 01', type: 'video', category: 'marketing' },
    { id: 2, title: 'Image 01', type: 'image', category: 'product' },
    { id: 3, title: 'Template 01', type: 'template', category: 'social' },
    { id: 4, title: 'Audio 01', type: 'audio', category: 'podcast' },
    { id: 5, title: 'Video 02', type: 'video', category: 'tutorial' },
    { id: 6, title: 'Image 02', type: 'image', category: 'brand' },
  ];

  const filteredItems = libraryItems.filter(item => {
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
              onClick={() => setSelectedItem(item.id)}
              className="group relative aspect-[4/5] bg-muted/40 rounded-2xl overflow-hidden cursor-pointer hover:bg-muted/60 transition-all"
            >
              {/* Placeholder for media */}
              <div className="absolute inset-0 flex items-center justify-center">
                {item.type === 'video' && (
                  <Play className="w-12 h-12 text-muted-foreground/50" />
                )}
              </div>
              
              {/* Hover overlay with info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {t('library.title')}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs text-muted-foreground">TEXT</span>
                    <span className="text-xs text-muted-foreground">TEXT</span>
                  </div>
                  <span className="text-xs text-muted-foreground">TEXT</span>
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
            className="bg-background rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-border/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8">
              {/* Media Preview */}
              <div className="flex-1 aspect-[3/4] bg-muted/30 rounded-2xl" />
              
              {/* Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">VIDEO 01</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="h-16 bg-muted/20 rounded-lg" />
                  <div className="h-32 bg-muted/20 rounded-lg" />
                </div>

                <button className="w-full py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
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
