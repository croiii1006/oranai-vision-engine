import React, { useState } from 'react';
import { ArrowUp, Globe, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { oauth2Authorize } from '@/lib/api/auth';
import { getToken } from '@/lib/utils/auth-storage';
import { config } from '@/lib/config';

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
  const [activeTab, setActiveTab] = useState('insight');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedSearchSource, setSelectedSearchSource] = useState<string | null>(null);
  const [loadingSubTabId, setLoadingSubTabId] = useState<string | null>(null);
  
  const modelOptions = [
    { id: 'claude', labelKey: 'products.modelClaude' },
    { id: 'chatgpt', labelKey: 'products.modelChatGPT' },
    { id: 'deepseek', labelKey: 'products.modelDeepSeek' },
    { id: 'gemini', labelKey: 'products.modelGemini' },
    { id: 'doubao', labelKey: 'products.modelDoubao' },
  ];

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
      url: undefined // 动态获取，不在这里设置
    }, {
      id: 'videoGen',
      labelKey: 'products.videoGen',
      image: videoGenThumb,
      url: undefined // 动态获取，使用 OAuth2 授权
    }, {
      id: 'digitalHuman',
      labelKey: 'products.digitalHuman',
      image: digitalHumanThumb,
      url: '' // TODO: Add Digital Human URL
    }]
  }, {
    id: 'operation',
    labelKey: 'products.operation',
    subTabs: [{
      id: 'b2bLead',
      labelKey: 'products.b2bLead',
      image: brandStrategyThumb,
      url: ''
    }]
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

  /**
   * 公共方法：处理需要 OAuth2 授权的按钮点击
   * @param subTabId 子标签 ID（如 'imageGen', 'videoGen'）
   * @param targetUrl 目标跳转地址（可选，如果不提供则根据 subTabId 自动获取）
   */
  const handleOAuthButtonClick = async (subTabId: string, targetUrl?: string) => {
    const token = getToken();
    if (!token) {
      alert(t('products.pleaseLogin') || 'Please login first');
      return;
    }

    setLoadingSubTabId(subTabId);
    try {
      const oauth2Response = await oauth2Authorize(token);
      if (oauth2Response.data && oauth2Response.data.code) {
        const oauthCode = oauth2Response.data.code;
        // 如果没有提供 targetUrl，根据 subTabId 自动获取
        let finalUrl = targetUrl;
        if (!finalUrl) {
          if (subTabId === 'imageGen') {
            finalUrl = config.api.imageGenUrl;
          } else if (subTabId === 'videoGen') {
            finalUrl = config.api.videoGenUrl;
          } else {
            throw new Error(`Unknown subTabId: ${subTabId}`);
          }
        }
        window.location.href = `${finalUrl}/?oauth_code=${oauthCode}`;
      } else {
        alert(t('products.oauthFailed') || 'Failed to get OAuth code');
      }
    } catch (error) {
      console.error('OAuth2 authorize failed:', error);
      alert(t('products.oauthFailed') || 'Failed to get OAuth code');
    } finally {
      setLoadingSubTabId(null);
    }
  };
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

              {/* Thinking Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedModel ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    <Sparkles className={`w-3.5 h-3.5 ${selectedModel ? 'animate-pulse' : ''}`} />
                    <span>{selectedModel ? t(modelOptions.find(m => m.id === selectedModel)?.labelKey || '') : t('products.thinking')}</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  {modelOptions.map(model => (
                    <DropdownMenuItem 
                      key={model.id} 
                      onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                      className={selectedModel === model.id ? 'bg-primary/10 text-primary' : ''}
                    >
                      {t(model.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sub Tab Dropdown - Shows cards */}
              {currentTabConfig?.subTabs && currentTabConfig.subTabs.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeSubTab ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                      {activeSubTab && currentTabConfig.subTabs?.find(st => st.id === activeSubTab) && (
                        <img 
                          src={currentTabConfig.subTabs.find(st => st.id === activeSubTab)?.image} 
                          alt="" 
                          className="w-4 h-4 rounded object-cover"
                        />
                      )}
                      <span>
                        {activeSubTab 
                          ? t(currentTabConfig.subTabs?.find(st => st.id === activeSubTab)?.labelKey || '')
                          : 'Select Tool'
                        }
                      </span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px] max-h-[400px] overflow-y-auto">
                    {currentTabConfig.subTabs.map(subTab => {
                      const isComingSoon = ['brandHealth', 'brandStrategy', 'digitalHuman', 'b2bLead'].includes(subTab.id);
                      return (
                        <DropdownMenuItem 
                          key={subTab.id}
                          onClick={() => {
                            if (!isComingSoon) {
                              setActiveSubTab(subTab.id);
                            }
                          }}
                          disabled={isComingSoon || loadingSubTabId === subTab.id}
                          className={`flex items-center gap-2 ${activeSubTab === subTab.id ? 'bg-primary/10 text-primary' : ''} ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* <img 
                            src={subTab.image} 
                            alt="" 
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                          /> */}
                          <span className="flex-1">
                            {loadingSubTabId === subTab.id ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {t('products.loading') || 'Loading...'}
                              </span>
                            ) : (
                              <>
                                {t(subTab.labelKey)}
                                {isComingSoon && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({t('products.comingSoon')})
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Send Button */}
            <button 
              onClick={async () => {
                if (!activeSubTab || !currentTabConfig?.subTabs) {
                  // 如果没有选择工具，使用默认行为
                  window.open('https://photog.art/p/trend', '_blank');
                  return;
                }

                const subTab = currentTabConfig.subTabs.find(st => st.id === activeSubTab);
                if (!subTab) {
                  window.open('https://photog.art/p/trend', '_blank');
                  return;
                }

                const isComingSoon = ['brandHealth', 'brandStrategy', 'digitalHuman', 'b2bLead'].includes(subTab.id);
                if (isComingSoon) {
                  return;
                }

                // 需要 OAuth2 授权的按钮（imageGen, videoGen 等）
                const oauthRequiredSubTabs = ['imageGen', 'videoGen'];
                if (oauthRequiredSubTabs.includes(subTab.id)) {
                  await handleOAuthButtonClick(subTab.id);
                } else if (subTab.url) {
                  window.open(subTab.url, '_blank');
                } else {
                  // 默认行为
                  window.open('https://photog.art/p/trend', '_blank');
                }
              }}
              disabled={loadingSubTabId !== null}
              className="p-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {loadingSubTabId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>;
};
export default ProductsPage;