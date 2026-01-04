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
    
    // Business - Application
    'business.application': 'Application',
    'business.knowBrand': 'Know Your Brand',
    'business.knowBrandDesc': 'Deep brand analytics and market positioning insights',
    'business.buildBrand': 'Build Your Brand',
    'business.buildBrandDesc': 'Strategic brand development and creative direction',
    'business.manageBrand': 'Manage Your Brand',
    'business.manageBrandDesc': 'Unified brand governance across all touchpoints',
    'business.scaleBrand': 'Scale Your Brand',
    'business.scaleBrandDesc': 'Global expansion with localized intelligence',
    
    // Business - Services
    'business.services': 'Services',
    'business.marketInsight': 'Market Insight',
    'business.consumerInsight': 'Consumer Insight',
    'business.healthInsight': 'Health Insight',
    'business.brandPositioning': 'Brand Positioning',
    'business.brandStory': 'Brand Story',
    'business.contentGeneration': 'Content Generation',
    'business.socialMedia': 'Social Media Management',
    'business.community': 'Community Management',
    'business.dam': 'Digital Asset Management',
    'business.sentiment': 'Public Opinion & Sentiment',
    'business.compliance': 'Compliance Management',
    'business.customerService': 'Customer Service',
    'business.sales': 'Sales Management',
    'business.seo': 'Geo / SEO Optimization',
    'business.localization': 'Content Localization',
    'business.email': 'Email Acquisition',
    'business.advertising': 'Advertising',
    'business.trend': 'Trend Forecasting',
    
    // Business - Platform
    'business.platform': 'Platform',
    'business.voyaAI': 'Voya AI',
    'business.voyaAIDesc': 'Conversational AI for brand intelligence',
    'business.photoG': 'PhotoG',
    'business.photoGDesc': 'AI-powered visual content creation',
    'business.dataG': 'Data G',
    'business.dataGDesc': 'Unified data analytics platform',
    'business.apiServices': 'API Services',
    'business.apiServicesDesc': 'Enterprise-grade API infrastructure',
    'business.agency': 'Agency',
    'business.agencyDesc': 'Managed AI marketing services',
    
    // Models
    'models.title': 'Model Capabilities',
    'models.nlp': 'Natural Language Processing',
    'models.nlpModels': 'Oran-R1 28B / OranLM-127B',
    'models.semantic': 'Semantic Understanding',
    'models.sentiment': 'Sentiment Analysis',
    'models.translation': 'Machine Translation',
    'models.multimodal': 'Multimodal Processing',
    'models.multimodalModels': 'Oran-VL 7B',
    'models.crossModal': 'Cross-modal Search & Matching',
    'models.visualQA': 'Visual Q&A',
    'models.asrTts': 'ASR / TTS / OCR',
    'models.generation': 'Multimodal Generation',
    'models.generationModels': 'OranVideo-15B / Oran-MV2 354B',
    'models.t2i': 'Text-to-Image (T2I)',
    'models.t2v': 'Text-to-Video (T2V)',
    'models.i2t': 'Image-to-Text (I2T)',
    'models.voiceCloning': 'Voice Cloning',
    
    // Products
    'products.title': 'Enterprise Products',
    'products.dashboard': 'AI Brand Intelligence Dashboard',
    'products.dashboardDesc': 'Real-time brand health monitoring and competitive analysis',
    'products.studio': 'AI Content & Creative Studio',
    'products.studioDesc': 'End-to-end content creation with multimodal AI',
    'products.operations': 'AI Marketing Operations Manager',
    'products.operationsDesc': 'Automated campaign orchestration and optimization',
    'products.growth': 'AI Global Growth Engine',
    'products.growthDesc': 'Localized expansion with cultural AI intelligence',
    'products.requestDemo': 'Request Demo',
    
    // Footer
    'footer.copyright': '© 2024 OranAI. All rights reserved.',
  },
  zh: {
    // Navigation
    'nav.solution': '解决方案',
    'nav.models': '模型',
    'nav.products': '产品',
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
    
    // Business - Application
    'business.application': '应用场景',
    'business.knowBrand': '了解品牌',
    'business.knowBrandDesc': '深度品牌分析与市场定位洞察',
    'business.buildBrand': '建设品牌',
    'business.buildBrandDesc': '战略品牌发展与创意方向',
    'business.manageBrand': '管理品牌',
    'business.manageBrandDesc': '跨触点统一品牌治理',
    'business.scaleBrand': '扩展品牌',
    'business.scaleBrandDesc': '本地化智能全球扩张',
    
    // Business - Services
    'business.services': '服务',
    'business.marketInsight': '市场洞察',
    'business.consumerInsight': '消费者洞察',
    'business.healthInsight': '健康洞察',
    'business.brandPositioning': '品牌定位',
    'business.brandStory': '品牌故事',
    'business.contentGeneration': '内容生成',
    'business.socialMedia': '社交媒体管理',
    'business.community': '社区管理',
    'business.dam': '数字资产管理',
    'business.sentiment': '舆情与情感管理',
    'business.compliance': '合规管理',
    'business.customerService': '客户服务',
    'business.sales': '销售管理',
    'business.seo': '地理/SEO优化',
    'business.localization': '内容本地化',
    'business.email': '邮件获客',
    'business.advertising': '广告投放',
    'business.trend': '趋势预测',
    
    // Business - Platform
    'business.platform': '平台',
    'business.voyaAI': 'Voya AI',
    'business.voyaAIDesc': '品牌智能对话AI',
    'business.photoG': 'PhotoG',
    'business.photoGDesc': 'AI驱动的视觉内容创作',
    'business.dataG': 'Data G',
    'business.dataGDesc': '统一数据分析平台',
    'business.apiServices': 'API服务',
    'business.apiServicesDesc': '企业级API基础设施',
    'business.agency': '代理服务',
    'business.agencyDesc': '托管AI营销服务',
    
    // Models
    'models.title': '模型能力',
    'models.nlp': '自然语言处理',
    'models.nlpModels': 'Oran-R1 28B / OranLM-127B',
    'models.semantic': '语义理解',
    'models.sentiment': '情感分析',
    'models.translation': '机器翻译',
    'models.multimodal': '多模态处理',
    'models.multimodalModels': 'Oran-VL 7B',
    'models.crossModal': '跨模态搜索与匹配',
    'models.visualQA': '视觉问答',
    'models.asrTts': 'ASR / TTS / OCR',
    'models.generation': '多模态生成',
    'models.generationModels': 'OranVideo-15B / Oran-MV2 354B',
    'models.t2i': '文生图 (T2I)',
    'models.t2v': '文生视频 (T2V)',
    'models.i2t': '图生文 (I2T)',
    'models.voiceCloning': '语音克隆',
    
    // Products
    'products.title': '企业产品',
    'products.dashboard': 'AI品牌智能仪表盘',
    'products.dashboardDesc': '实时品牌健康监测与竞争分析',
    'products.studio': 'AI内容与创意工作室',
    'products.studioDesc': '多模态AI端到端内容创作',
    'products.operations': 'AI营销运营管理',
    'products.operationsDesc': '自动化营销活动编排与优化',
    'products.growth': 'AI全球增长引擎',
    'products.growthDesc': '文化AI智能本地化扩张',
    'products.requestDemo': '申请演示',
    
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
