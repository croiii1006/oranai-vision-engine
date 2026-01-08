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
    'solution.consumerInsightDesc': 'Deep mining based on user behavior and feedback — demand pain point identification, user persona profiling, consumption preference prediction',
    'solution.healthInsightDesc': 'Brand health monitoring — reputation analysis, sentiment tracking, crisis early warning',
    'solution.brandPositioning': 'Brand Positioning',
    'solution.brandStory': 'Brand Story',
    'solution.contentGeneration': 'Content Generation',
    'solution.brandPositioningDesc': 'AI-powered brand positioning strategy — market analysis, differentiation, value proposition',
    'solution.brandStoryDesc': 'Compelling brand narrative creation — storytelling, emotional connection, brand voice',
    'solution.contentGenerationDesc': 'Multi-format content generation — text, images, videos, creative assets',
    'solution.socialMedia': 'Social Media',
    'solution.community': 'Community',
    'solution.dam': 'Digital Assets',
    'solution.sentiment': 'Sentiment Analysis',
    'solution.compliance': 'Compliance',
    'solution.customerService': 'Customer Service',
    'solution.socialMediaDesc': 'Unified social media management — content scheduling, performance analytics, engagement',
    'solution.damDesc': 'Digital asset management — content library, version control, brand consistency',
    'solution.sentimentDesc': 'Real-time sentiment monitoring — public opinion analysis, crisis response',
    'solution.seo': 'GEO / SEO',
    'solution.ads': 'Ads',
    'solution.predictiveGrowth': 'Predictive Growth',
    'solution.seoDesc': 'Search optimization strategy — keyword analysis, content optimization, ranking improvement',
    'solution.adsDesc': 'Intelligent advertising — audience targeting, creative optimization, ROI maximization',
    'solution.predictiveGrowthDesc': 'Data-driven growth prediction — market trends, user behavior, business forecasting',
    'solution.knowDesc': 'Market, Consumer & Competitive Intelligence',
    'solution.buildDesc': 'AI-generated Content & Storytelling',
    'solution.manageDesc': 'Assets, Campaigns & Performance Control',
    'solution.scaleDesc': 'GEO / SEO / Ads / Predictive Growth',
    
    // Models Page
    'models.title': 'MODELS',
    'models.filter': 'Filter',
    'models.reset': 'Reset',
    'models.nlp': 'NLP',
    'models.multimodal': 'Multimodal',
    'models.generation': 'Generation',
    'models.vision': 'Vision',
    'models.audio': 'Audio',
    'models.enterprise': 'Enterprise',
    'models.supplier': 'Supplier',
    'models.allSuppliers': 'All Suppliers',
    'models.billingType': 'Billing Type',
    'models.allTypes': 'All Types',
    'models.usageBilling': 'Usage-based',
    'models.timesBilling': 'Per-call',
    'models.endpointType': 'Endpoint Type',
    'models.allEndpoints': 'All Endpoints',
    'models.expand': 'Show more',
    'models.collapse': 'Collapse',
    'models.unknownSupplier': 'Unknown',
    
    // Products Page
    'products.title': 'PHOTOG',
    'products.headline': 'Your Smartest AI-Marketing Team',
    'products.subheadline': 'Always online, Always professional',
    'products.insight': 'Insight',
    'products.strategy': 'Strategy',
    'products.material': 'Content',
    'products.operation': 'Operation',
    'products.imageGen': 'Image Generation',
    'products.videoGen': 'Video Generation',
    'products.digitalHuman': 'Digital Human',
    'products.requestDemo': 'Request Demo',
    'products.geoMonitor': 'GEO Monitor',
    'products.brandHealth': 'Brand Health',
    'products.brandStrategy': 'Brand Strategy',
    'products.chatPlaceholder': 'Assign a task or ask any question',
    'products.webSearch': 'Web Search',
    'products.thinking': 'Thinking',
    
    // Library Page
    'library.title': 'LIBRARY',
    'library.all': 'All',
    'library.food': 'Food & Beverage',
    'library.auto': 'Automotive',
    'library.fashion': 'Fashion & Beauty',
    'library.digital': '3C Digital',
    'library.finance': 'Financial Services',
    'library.personal': 'Personal Care',
    'library.culture': 'Culture & Creative',
    'library.platform': 'Platform Marketing',
    'library.diy': 'Handmade DIY',
    'library.image': 'Image',
    'library.video': 'Video',
    'library.audio': 'Audio',
    'library.template': 'Template',
    'library.download': 'Download',
    'library.replicate': 'Replicate Viral',
    
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
    'solution.know': 'KNOW',
    'solution.build': 'BUILD',
    'solution.manage': 'MANAGE',
    'solution.scale': 'SCALE',
    'solution.yourBrand': 'your brand',
    'solution.marketInsight': '市场洞察',
    'solution.consumerInsight': '消费者洞察',
    'solution.healthInsight': '健康洞察',
    'solution.marketInsightDesc': '基于社媒全域内容的实时洞察——热点追踪，趋势分析，竞品监测',
    'solution.consumerInsightDesc': '基于用户行为与反馈的深度挖掘——需求痛点识别，用户画像描摹，消费偏好预测',
    'solution.healthInsightDesc': '品牌健康监测——口碑分析，情感追踪，危机预警',
    'solution.brandPositioning': '品牌定位',
    'solution.brandStory': '品牌故事',
    'solution.contentGeneration': '内容生成',
    'solution.brandPositioningDesc': 'AI驱动的品牌定位策略——市场分析，差异化，价值主张',
    'solution.brandStoryDesc': '引人入胜的品牌叙事创作——故事讲述，情感连接，品牌声音',
    'solution.contentGenerationDesc': '多格式内容生成——文本，图片，视频，创意素材',
    'solution.socialMedia': '社交媒体',
    'solution.community': '社区管理',
    'solution.dam': '数字资产',
    'solution.sentiment': '舆情分析',
    'solution.compliance': '合规管理',
    'solution.customerService': '客户服务',
    'solution.socialMediaDesc': '统一社交媒体管理——内容排期，绩效分析，互动管理',
    'solution.damDesc': '数字资产管理——内容库，版本控制，品牌一致性',
    'solution.sentimentDesc': '实时舆情监测——公众舆论分析，危机响应',
    'solution.seo': 'GEO / SEO',
    'solution.ads': '广告投放',
    'solution.predictiveGrowth': '预测增长',
    'solution.seoDesc': '搜索优化策略——关键词分析，内容优化，排名提升',
    'solution.adsDesc': '智能广告投放——受众定向，创意优化，ROI最大化',
    'solution.predictiveGrowthDesc': '数据驱动的增长预测——市场趋势，用户行为，业务预测',
    'solution.knowDesc': '市场、消费者与竞争情报',
    'solution.buildDesc': 'AI生成内容与品牌故事',
    'solution.manageDesc': '资产、营销活动与绩效控制',
    'solution.scaleDesc': 'GEO / SEO / 广告 / 预测增长',
    
    // Models Page
    'models.title': '模型',
    'models.filter': '筛选',
    'models.reset': '重置',
    'models.nlp': '自然语言',
    'models.multimodal': '多模态',
    'models.generation': '生成',
    'models.vision': '视觉',
    'models.audio': '音频',
    'models.enterprise': '企业级',
    'models.supplier': '供应商',
    'models.allSuppliers': '全部供应商',
    'models.billingType': '计费类型',
    'models.allTypes': '全部类型',
    'models.usageBilling': '按量计费',
    'models.timesBilling': '按次计费',
    'models.endpointType': '端点类型',
    'models.allEndpoints': '全部端点',
    'models.expand': '展开更多',
    'models.collapse': '收起',
    'models.unknownSupplier': '未知供应商',
    
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
    'products.geoMonitor': 'GEO监控平台',
    'products.brandHealth': '品牌健康度',
    'products.brandStrategy': '品牌策略',
    'products.chatPlaceholder': '分配一个任务或提问任何问题',
    'products.webSearch': '联网搜索',
    'products.thinking': '深度思考',
    
    // Library Page
    'library.title': '素材广场',
    'library.all': '全部',
    'library.food': '食品饮料',
    'library.auto': '汽车交通',
    'library.fashion': '时尚美妆',
    'library.digital': '3C数码',
    'library.finance': '金融服务',
    'library.personal': '个人护理',
    'library.culture': '文化创意',
    'library.platform': '平台推广',
    'library.diy': '手工DIY',
    'library.image': '图片',
    'library.video': '视频',
    'library.audio': '音频',
    'library.template': '模板',
    'library.download': '下载',
    'library.replicate': '复刻爆款',
    
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
