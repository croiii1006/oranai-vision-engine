import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import thumbnail images
import imageGenThumb from '@/assets/products/image-gen-thumb.png';
import videoGenThumb from '@/assets/products/video-gen-thumb.png';
import digitalHumanThumb from '@/assets/products/digital-human-thumb.png';
import geoMonitorThumb from '@/assets/products/geo-monitor-thumb.png';
import brandHealthThumb from '@/assets/products/brand-health-thumb.png';
import brandStrategyThumb from '@/assets/products/brand-strategy-thumb.png';

interface SubTab {
  id: string;
  labelKey: string;
  image: string;
}

interface TabConfig {
  id: string;
  labelKey: string;
  subTabs?: SubTab[];
}

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('material');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);

  const tabsConfig: TabConfig[] = [
    {
      id: 'insight',
      labelKey: 'products.insight',
      subTabs: [
        { id: 'geoMonitor', labelKey: 'products.geoMonitor', image: geoMonitorThumb },
        { id: 'brandHealth', labelKey: 'products.brandHealth', image: brandHealthThumb },
      ],
    },
    {
      id: 'strategy',
      labelKey: 'products.strategy',
      subTabs: [
        { id: 'brandStrategy', labelKey: 'products.brandStrategy', image: brandStrategyThumb },
      ],
    },
    {
      id: 'material',
      labelKey: 'products.material',
      subTabs: [
        { id: 'imageGen', labelKey: 'products.imageGen', image: imageGenThumb },
        { id: 'videoGen', labelKey: 'products.videoGen', image: videoGenThumb },
        { id: 'digitalHuman', labelKey: 'products.digitalHuman', image: digitalHumanThumb },
      ],
    },
    {
      id: 'operation',
      labelKey: 'products.operation',
    },
  ];

  const currentTabConfig = tabsConfig.find((tab) => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabsConfig.find((t) => t.id === tabId);
    if (tab?.subTabs && tab.subTabs.length > 0) {
      setActiveSubTab(tab.subTabs[0].id);
    } else {
      setActiveSubTab(null);
    }
  };

  // Initialize activeSubTab on mount
  React.useEffect(() => {
    if (currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && !activeSubTab) {
      setActiveSubTab(currentTabConfig.subTabs[0].id);
    }
  }, [currentTabConfig, activeSubTab]);

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
        <div className="flex items-center justify-center gap-4 mb-8">
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 max-w-3xl mx-auto mb-8">
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

        {/* Sub Tab Navigation with Images */}
        {currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && (
          <div className="flex items-center justify-center gap-6 mb-12">
            {currentTabConfig.subTabs.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`group relative flex items-center gap-3 pl-6 pr-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 overflow-hidden min-w-[180px] ${
                  activeSubTab === subTab.id
                    ? 'glass-tab-active shadow-lg'
                    : 'glass-tab text-muted-foreground hover:text-foreground hover:shadow-md'
                }`}
              >
                {/* Text content */}
                <span className="relative z-10 flex-shrink-0">{t(subTab.labelKey)}</span>
                
                {/* Tilted thumbnail image */}
                <div className="relative w-14 h-14 flex-shrink-0 ml-auto">
                  <div className="absolute inset-0 transform rotate-6 group-hover:rotate-12 transition-transform duration-300 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={subTab.image} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
