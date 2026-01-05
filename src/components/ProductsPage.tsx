import React, { useState } from 'react';
import { Search, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('material');

  const tabs = [
    { id: 'insight', label: t('products.insight') },
    { id: 'strategy', label: t('products.strategy') },
    { id: 'material', label: t('products.material') },
    { id: 'operation', label: t('products.operation') },
  ];

  const categories = [
    { id: 'imageGen', label: t('products.imageGen') },
    { id: 'videoGen', label: t('products.videoGen') },
    { id: 'digitalHuman', label: t('products.digitalHuman') },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
          {t('products.title')}
        </h1>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('products.headline')}
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            {t('products.subheadline')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 max-w-3xl mx-auto mb-12">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
            />
          </div>
          <button className="p-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tags */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-6 py-3 rounded-lg bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all text-sm"
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
