import React, { useState } from 'react';
import { ArrowUp, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  url?: string; // URL to navigate to when clicked
}
interface TabConfig {
  id: string;
  labelKey: string;
  subTabs?: SubTab[];
}
const ProductsPage: React.FC = () => {
  const {
    t
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('material');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSearchSource, setSelectedSearchSource] = useState<string | null>(null);
  const searchSources = [{
    id: 'redbook',
    labelKey: 'products.redbook',
    enabled: true
  }, {
    id: 'youtube',
    labelKey: 'products.youtube',
    enabled: false
  }, {
    id: 'tiktok',
    labelKey: 'products.tiktok',
    enabled: false
  }, {
    id: 'amazon',
    labelKey: 'products.amazon',
    enabled: false
  }, {
    id: 'semrush',
    labelKey: 'products.semrush',
    enabled: false
  }];
  const tabsConfig: TabConfig[] = [{
    id: 'insight',
    labelKey: 'products.insight',
    subTabs: [{
      id: 'geoMonitor',
      labelKey: 'products.geoMonitor',
      image: geoMonitorThumb,
      url: 'https://geo.photog.art/ai'
    }, {
      id: 'brandHealth',
      labelKey: 'products.brandHealth',
      image: brandHealthThumb,
      url: '' // TODO: Add Brand Health URL
    }]
  }, {
    id: 'strategy',
    labelKey: 'products.strategy',
    subTabs: [{
      id: 'brandStrategy',
      labelKey: 'products.brandStrategy',
      image: brandStrategyThumb,
      url: '' // TODO: Add Brand Strategy URL
    }]
  }, {
    id: 'material',
    labelKey: 'products.material',
    subTabs: [{
      id: 'imageGen',
      labelKey: 'products.imageGen',
      image: imageGenThumb,
      url: 'https://tools.photog.art/'
    }, {
      id: 'videoGen',
      labelKey: 'products.videoGen',
      image: videoGenThumb,
      url: 'https://tools.photog.art/'
    }, {
      id: 'digitalHuman',
      labelKey: 'products.digitalHuman',
      image: digitalHumanThumb,
      url: '' // TODO: Add Digital Human URL
    }]
  }, {
    id: 'operation',
    labelKey: 'products.operation'
  }];
  const currentTabConfig = tabsConfig.find(tab => tab.id === activeTab);
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = tabsConfig.find(t => t.id === tabId);
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
  return <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-[61px]">
        {/* Product Title */}
        <h1 className="text-3xl tracking-tight mb-12 md:text-base py-0 font-extralight">
          {t('products.title')}
        </h1>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl mb-3 font-medium font-sans text-current md:text-3xl">
            {t('products.headline')}
          </h2>
          <p className="text-lg text-foreground font-extralight md:text-2xl">
            {t('products.subheadline')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {tabsConfig.map(tab => <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`px-6 py-2 rounded-full text-base font-medium transition-all ${activeTab === tab.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
              {t(tab.labelKey)}
            </button>)}
        </div>

        {/* Search Dialog Box */}
        <div className="max-w-2xl mx-auto mb-6 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm p-3">
          {/* Input Area */}
          <div className="mb-3">
            <input type="text" placeholder={t('products.chatPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base" />
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Web Search Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSearchSource ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Globe className="w-3.5 h-3.5" />
                    <span>{selectedSearchSource ? t(searchSources.find(s => s.id === selectedSearchSource)?.labelKey || '') : t('products.webSearch')}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  {searchSources.map(source => (
                    <DropdownMenuItem 
                      key={source.id} 
                      onClick={() => source.enabled && setSelectedSearchSource(selectedSearchSource === source.id ? null : source.id)}
                      disabled={!source.enabled}
                      className={`${selectedSearchSource === source.id ? 'bg-primary/10 text-primary' : ''} ${!source.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {t(source.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Thinking Button */}
              <button onClick={() => setIsThinking(!isThinking)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isThinking ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <Sparkles className={`w-3.5 h-3.5 ${isThinking ? 'animate-pulse' : ''}`} />
                <span>{t('products.thinking')}</span>
              </button>
            </div>

            {/* Send Button */}
            <button 
              onClick={() => window.open('https://photog.art/', '_blank')}
              className="p-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Tab Navigation with Images */}
        {currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && <div className="mb-10 items-center justify-center flex flex-row gap-[35px] border-transparent">
            {currentTabConfig.subTabs.map(subTab => {
              const isComingSoon = ['brandHealth', 'brandStrategy', 'digitalHuman'].includes(subTab.id);
              return (
                <button key={subTab.id} onClick={() => {
                    setActiveSubTab(subTab.id);
                    if (subTab.url && !isComingSoon) {
                      window.open(subTab.url, '_blank');
                    }
                  }} className={`group relative flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden min-w-[170px] bg-foreground/10 dark:bg-foreground/20 text-foreground hover:shadow-md ${isComingSoon ? 'cursor-default' : ''}`}>
                    {/* Coming Soon Overlay */}
                    {isComingSoon && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium text-foreground">Coming Soon</span>
                      </div>
                    )}
                    {/* Text content */}
                    <span className="relative z-10 flex-shrink-0">{t(subTab.labelKey)}</span>
                    
                    {/* Tilted thumbnail image */}
                    <div className="relative w-14 h-14 flex-shrink-0 ml-auto">
                      <div className="absolute inset-0 transform rotate-6 group-hover:rotate-12 transition-transform duration-300 rounded-lg overflow-hidden shadow-lg">
                        <img src={subTab.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </button>
              );
            })}
          </div>}
      </div>
    </div>;
};
export default ProductsPage;