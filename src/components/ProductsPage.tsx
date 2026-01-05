import React, { useState } from 'react';
import { ArrowUp, Globe, HeartPulse, Target, Image, Video, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubTab {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
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
        { id: 'geoMonitor', labelKey: 'products.geoMonitor', icon: <Globe className="w-4 h-4" /> },
        { id: 'brandHealth', labelKey: 'products.brandHealth', icon: <HeartPulse className="w-4 h-4" /> },
      ],
    },
    {
      id: 'strategy',
      labelKey: 'products.strategy',
      subTabs: [
        { id: 'brandStrategy', labelKey: 'products.brandStrategy', icon: <Target className="w-4 h-4" /> },
      ],
    },
    {
      id: 'material',
      labelKey: 'products.material',
      subTabs: [
        { id: 'imageGen', labelKey: 'products.imageGen', icon: <Image className="w-4 h-4" /> },
        { id: 'videoGen', labelKey: 'products.videoGen', icon: <Video className="w-4 h-4" /> },
        { id: 'digitalHuman', labelKey: 'products.digitalHuman', icon: <User className="w-4 h-4" /> },
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

        {/* Sub Tab Navigation */}
        {currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-12">
            {currentTabConfig.subTabs.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeSubTab === subTab.id
                    ? 'border-foreground/50 bg-foreground/10 text-foreground'
                    : 'border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {subTab.icon}
                {t(subTab.labelKey)}
              </button>
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default ProductsPage;
