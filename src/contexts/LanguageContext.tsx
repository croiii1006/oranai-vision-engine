import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.solution': 'Solution',
    'nav.models': 'Models',
    'nav.products': 'Products',
    'nav.library': 'Library',
    'nav.signIn': 'Sign In',
    'nav.contactUs': 'Contact Us',
    
    // Sidebar
    'sidebar.resources': 'Resources',
    'sidebar.aboutUs': 'About Us',
    'sidebar.blog': 'Blog',
    'sidebar.careers': 'Careers',
    'sidebar.docs': 'Docs',
    'sidebar.privacy': 'Privacy & Terms',
    
    // Hero
    'hero.title': 'OranAI',
    'hero.subtitle': 'AI for Integrated Marketing Intelligence',
    'hero.description': 'From brand insight to global execution, powered by multimodal AI',
    'hero.exploreSolution': 'Explore Solution',
    'hero.viewModels': 'View Models',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.submit': 'Submit',
    
    // Solution Page
    'solution.know': 'KNOW',
    'solution.build': 'BUILD',
    'solution.manage': 'MANAGE',
    'solution.scale': 'SCALE',
    'solution.yourBrand': 'your brand',
    'solution.marketInsight': 'Market Insight',
    'solution.consumerInsight': 'Consumer Insight',
    'solution.healthInsight': 'Health Insight',
    'solution.marketInsightDesc': 'Real-time social media insights — trend tracking, analysis, competitor monitoring',
    'solution.brandPositioning': 'Brand Positioning',
    'solution.brandStory': 'Brand Story',
    'solution.contentGeneration': 'Content Generation',
    'solution.socialMedia': 'Social Media',
    'solution.community': 'Community',
    'solution.dam': 'Digital Assets',
    'solution.sentiment': 'Sentiment Analysis',
    'solution.compliance': 'Compliance',
    'solution.customerService': 'Customer Service',
    'solution.seo': 'GEO / SEO',
    'solution.ads': 'Ads',
    'solution.predictiveGrowth': 'Predictive Growth',
    'solution.knowDesc': 'Market, Consumer & Competitive Intelligence',
    'solution.buildDesc': 'AI-generated Content & Storytelling',
    'solution.manageDesc': 'Assets, Campaigns & Performance Control',
    'solution.scaleDesc': 'GEO / SEO / Ads / Predictive Growth',
    
    // Models Page
    'models.title': 'MODELS',
    'models.filter': 'Filter',
    'models.nlp': 'NLP',
    'models.multimodal': 'Multimodal',
    'models.generation': 'Generation',
    'models.vision': 'Vision',
    'models.audio': 'Audio',
    'models.enterprise': 'Enterprise',
    
    // Products Page
    'products.title': 'PHOTOG',
    'products.headline': 'Your Smartest AI-Marketing Team',
    'products.subheadline': 'Always online, Always professional',
    'products.insight': 'Insight',
    'products.strategy': 'Strategy',
    'products.material': 'Material',
    'products.operation': 'Operation',
    'products.imageGen': 'Image Generation',
    'products.videoGen': 'Video Generation',
    'products.digitalHuman': 'Digital Human',
    'products.requestDemo': 'Request Demo',
    
    // Library Page
    'library.title': 'LIBRARY',
    'library.all': 'All',
    'library.image': 'Image',
    'library.video': 'Video',
    'library.audio': 'Audio',
    'library.template': 'Template',
    'library.download': 'Download',
    
    // Footer
    'footer.copyright': '© 2024 OranAI. All rights reserved.',
  },
  zh: {
    // Navigation
    'nav.solution': '解决方案',
    'nav.models': '模型',
    'nav.products': '产品',
    'nav.library': '素材广场',
    'nav.signIn': '登录',
    'nav.contactUs': '联系我们',
    
    // Sidebar
    'sidebar.resources': '资源中心',
    'sidebar.aboutUs': '关于我们',
    'sidebar.blog': '博客',
    'sidebar.careers': '招贤纳士',
    'sidebar.docs': '文档',
    'sidebar.privacy': '隐私与条款',
    
    // Hero
    'hero.title': 'OranAI',
    'hero.subtitle': '整合营销智能AI',
    'hero.description': '从品牌洞察到全球执行，由多模态AI驱动',
    'hero.exploreSolution': '探索解决方案',
    'hero.viewModels': '查看模型',
    
    // Common
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.all': '全部',
    'common.submit': '提交',
    
    // Solution Page
    'solution.know': '洞察',
    'solution.build': '建设',
    'solution.manage': '管理',
    'solution.scale': '扩展',
    'solution.yourBrand': '你的品牌',
    'solution.marketInsight': '市场洞察',
    'solution.consumerInsight': '消费者洞察',
    'solution.healthInsight': '健康洞察',
    'solution.marketInsightDesc': '基于社媒全域内容的实时洞察——热点追踪，趋势分析，竞品监测',
    'solution.brandPositioning': '品牌定位',
    'solution.brandStory': '品牌故事',
    'solution.contentGeneration': '内容生成',
    'solution.socialMedia': '社交媒体',
    'solution.community': '社区管理',
    'solution.dam': '数字资产',
    'solution.sentiment': '舆情分析',
    'solution.compliance': '合规管理',
    'solution.customerService': '客户服务',
    'solution.seo': 'GEO / SEO',
    'solution.ads': '广告投放',
    'solution.predictiveGrowth': '预测增长',
    'solution.knowDesc': '市场、消费者与竞争情报',
    'solution.buildDesc': 'AI生成内容与品牌故事',
    'solution.manageDesc': '资产、营销活动与绩效控制',
    'solution.scaleDesc': 'GEO / SEO / 广告 / 预测增长',
    
    // Models Page
    'models.title': '模型',
    'models.filter': '筛选',
    'models.nlp': '自然语言',
    'models.multimodal': '多模态',
    'models.generation': '生成',
    'models.vision': '视觉',
    'models.audio': '音频',
    'models.enterprise': '企业级',
    
    // Products Page
    'products.title': 'PHOTOG',
    'products.headline': '你最聪明的AI营销团队',
    'products.subheadline': '全天在线，始终专业',
    'products.insight': '洞察',
    'products.strategy': '策略',
    'products.material': '素材',
    'products.operation': '运营',
    'products.imageGen': '图片生成',
    'products.videoGen': '视频生成',
    'products.digitalHuman': '数字人',
    'products.requestDemo': '申请演示',
    
    // Library Page
    'library.title': '素材广场',
    'library.all': '全部',
    'library.image': '图片',
    'library.video': '视频',
    'library.audio': '音频',
    'library.template': '模板',
    'library.download': '下载',
    
    // Footer
    'footer.copyright': '© 2024 OranAI. 保留所有权利。',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
