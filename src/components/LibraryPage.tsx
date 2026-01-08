import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LibraryItem {
  id: number;
  titleKey: string;
  type: 'video' | 'image' | 'audio' | 'template';
  publisher: string;
  publishDate: string;
  publishDateFull: string;
  videoTypeKey: string;
  purposeKey: string;
  audienceKey: string;
  aiAnalysisKey: string;
  videoUrl: string;
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  thumbnail: string;
  category: string;
}

const mockLibraryItems: LibraryItem[] = [
  {
    id: 1,
    titleKey: 'library.cocacola.title',
    type: 'video',
    publisher: 'Coca-Cola',
    publishDate: 'Nov 2024',
    publishDateFull: 'Nov 19, 2024',
    videoTypeKey: 'library.cocacola.type',
    purposeKey: 'library.cocacola.purpose',
    audienceKey: 'library.cocacola.audience',
    aiAnalysisKey: 'library.cocacola.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/BVCOGW.mp4',
    duration: '01:00',
    views: 2850000,
    likes: 48200,
    comments: 3150,
    shares: 12400,
    tags: ['Christmas', 'Holiday', 'AI', 'Animation'],
    thumbnail: 'https://img.youtube.com/vi/4RSTupbfGog/maxresdefault.jpg',
    category: 'food',
  },
  {
    id: 2,
    titleKey: 'library.mcdonalds.title',
    type: 'video',
    publisher: "McDonald's",
    publishDate: '2024',
    publishDateFull: '2024',
    videoTypeKey: 'library.mcdonalds.type',
    purposeKey: 'library.mcdonalds.purpose',
    audienceKey: 'library.mcdonalds.audience',
    aiAnalysisKey: 'library.mcdonalds.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ov76u.mp4',
    duration: '00:40',
    views: 1420000,
    likes: 25600,
    comments: 1820,
    shares: 6340,
    tags: ['Future', 'Tech', 'AI', 'Innovation'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 3,
    titleKey: 'library.nike.title',
    type: 'video',
    publisher: 'Audiovisual con IA',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 28, 2025',
    videoTypeKey: 'library.nike.type',
    purposeKey: 'library.nike.purpose',
    audienceKey: 'library.nike.audience',
    aiAnalysisKey: 'library.nike.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/8XDY2f.mp4',
    duration: '00:30',
    views: 980000,
    likes: 18400,
    comments: 920,
    shares: 4100,
    tags: ['Nike', 'AI Sports', 'Slow Motion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 4,
    titleKey: 'library.jeremyRazors.title',
    type: 'video',
    publisher: "Jeremy's Razors",
    publishDate: 'Feb 2025',
    publishDateFull: 'Feb 7, 2025',
    videoTypeKey: 'library.jeremyRazors.type',
    purposeKey: 'library.jeremyRazors.purpose',
    audienceKey: 'library.jeremyRazors.audience',
    aiAnalysisKey: 'library.jeremyRazors.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/IKqMZ0.mp4',
    duration: '00:35',
    views: 520000,
    likes: 12800,
    comments: 740,
    shares: 2900,
    tags: ['Razor', 'Metal', 'AI Render'],
    thumbnail: '',
    category: 'personal',
  },
  {
    id: 5,
    titleKey: 'library.zaraDor.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 5, 2024',
    videoTypeKey: 'library.zaraDor.type',
    purposeKey: 'library.zaraDor.purpose',
    audienceKey: 'library.zaraDor.audience',
    aiAnalysisKey: 'library.zaraDor.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/NWfxHT.mp4',
    duration: '00:32',
    views: 610000,
    likes: 14300,
    comments: 820,
    shares: 3100,
    tags: ['Zara', 'Concept', 'AI Fashion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 6,
    titleKey: 'library.hiamiHooch.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 31, 2024',
    videoTypeKey: 'library.hiamiHooch.type',
    purposeKey: 'library.hiamiHooch.purpose',
    audienceKey: 'library.hiamiHooch.audience',
    aiAnalysisKey: 'library.hiamiHooch.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ABq2l.mp4',
    duration: '00:28',
    views: 455000,
    likes: 11200,
    comments: 580,
    shares: 2400,
    tags: ['Beverage', 'Concept', 'Liquid FX'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 7,
    titleKey: 'library.dorSoda.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 15, 2024',
    videoTypeKey: 'library.dorSoda.type',
    purposeKey: 'library.dorSoda.purpose',
    audienceKey: 'library.dorSoda.audience',
    aiAnalysisKey: 'library.dorSoda.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/ENHpkU.mp4',
    duration: '00:33',
    views: 388000,
    likes: 9300,
    comments: 520,
    shares: 1800,
    tags: ['Soda', 'Concept', 'Motion'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 8,
    titleKey: 'library.roguePerfume.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 30, 2024',
    videoTypeKey: 'library.roguePerfume.type',
    purposeKey: 'library.roguePerfume.purpose',
    audienceKey: 'library.roguePerfume.audience',
    aiAnalysisKey: 'library.roguePerfume.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/adMqvZ.mp4',
    duration: '00:31',
    views: 442000,
    likes: 10100,
    comments: 610,
    shares: 2100,
    tags: ['Perfume', 'Luxury', 'Stylized'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 9,
    titleKey: 'library.kfcRemix.title',
    type: 'video',
    publisher: 'Krishna Pasi',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 1, 2025',
    videoTypeKey: 'library.kfcRemix.type',
    purposeKey: 'library.kfcRemix.purpose',
    audienceKey: 'library.kfcRemix.audience',
    aiAnalysisKey: 'library.kfcRemix.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/m9IZpK.mp4',
    duration: '00:29',
    views: 612000,
    likes: 13800,
    comments: 760,
    shares: 2500,
    tags: ['KFC', 'Food', 'AI Voice'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 10,
    titleKey: 'library.volvoLife.title',
    type: 'video',
    publisher: 'Laszlo Gaal',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 4, 2024',
    videoTypeKey: 'library.volvoLife.type',
    purposeKey: 'library.volvoLife.purpose',
    audienceKey: 'library.volvoLife.audience',
    aiAnalysisKey: 'library.volvoLife.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/5aurPq.mp4',
    duration: '00:45',
    views: 720000,
    likes: 15400,
    comments: 880,
    shares: 3300,
    tags: ['Volvo', 'Safety', 'Cinematic'],
    thumbnail: '',
    category: 'auto',
  },
  {
    id: 11,
    titleKey: 'library.adidasFloral.title',
    type: 'video',
    publisher: 'RabbitHole',
    publishDate: 'May 2025',
    publishDateFull: 'May 16, 2025',
    videoTypeKey: 'library.adidasFloral.type',
    purposeKey: 'library.adidasFloral.purpose',
    audienceKey: 'library.adidasFloral.audience',
    aiAnalysisKey: 'library.adidasFloral.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/HBj45Q.mp4',
    duration: '00:27',
    views: 540000,
    likes: 12000,
    comments: 640,
    shares: 2200,
    tags: ['Adidas', 'Floral', 'Style Transfer'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 12,
    titleKey: 'library.chinguCafe.title',
    type: 'video',
    publisher: 'RabbitHole',
    publishDate: 'Jun 2025',
    publishDateFull: 'Jun 4, 2025',
    videoTypeKey: 'library.chinguCafe.type',
    purposeKey: 'library.chinguCafe.purpose',
    audienceKey: 'library.chinguCafe.audience',
    aiAnalysisKey: 'library.chinguCafe.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4VIf72.mp4',
    duration: '00:34',
    views: 402000,
    likes: 9500,
    comments: 520,
    shares: 1800,
    tags: ['Coffee', 'Emotive', 'Face Animation'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 13,
    titleKey: 'library.invideoSpark.title',
    type: 'video',
    publisher: 'RabbitHole',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 27, 2025',
    videoTypeKey: 'library.invideoSpark.type',
    purposeKey: 'library.invideoSpark.purpose',
    audienceKey: 'library.invideoSpark.audience',
    aiAnalysisKey: 'library.invideoSpark.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/TDAP1m.mp4',
    duration: '00:33',
    views: 368000,
    likes: 8700,
    comments: 480,
    shares: 1700,
    tags: ['InVideo', 'Creative', 'Polish'],
    thumbnail: '',
    category: 'platform',
  },
  {
    id: 14,
    titleKey: 'library.netflixBite.title',
    type: 'video',
    publisher: 'RabbitHole',
    publishDate: 'Nov 2024',
    publishDateFull: 'Nov 17, 2024',
    videoTypeKey: 'library.netflixBite.type',
    purposeKey: 'library.netflixBite.purpose',
    audienceKey: 'library.netflixBite.audience',
    aiAnalysisKey: 'library.netflixBite.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/UljSPp.mp4',
    duration: '00:36',
    views: 810000,
    likes: 17600,
    comments: 940,
    shares: 3200,
    tags: ['Netflix', 'Promo', 'Color Grade'],
    thumbnail: '',
    category: 'platform',
  },
  {
    id: 15,
    titleKey: 'library.gotMilk.title',
    type: 'video',
    publisher: 'Niccyan',
    publishDate: 'May 2023',
    publishDateFull: 'May 30, 2023',
    videoTypeKey: 'library.gotMilk.type',
    purposeKey: 'library.gotMilk.purpose',
    audienceKey: 'library.gotMilk.audience',
    aiAnalysisKey: 'library.gotMilk.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/YEhJ98.mp4',
    duration: '00:26',
    views: 295000,
    likes: 7200,
    comments: 310,
    shares: 1400,
    tags: ['Milk', 'Family', 'AI Render'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 16,
    titleKey: 'library.durex.title',
    type: 'video',
    publisher: 'Haggar shoval',
    publishDate: 'Jun 2025',
    publishDateFull: 'Jun 30, 2025',
    videoTypeKey: 'library.durex.type',
    purposeKey: 'library.durex.purpose',
    audienceKey: 'library.durex.audience',
    aiAnalysisKey: 'library.durex.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/vw8t8O.mp4',
    duration: '00:30',
    views: 250000,
    likes: 6800,
    comments: 290,
    shares: 1200,
    tags: ['Durex', 'Low Saturation', 'Runway'],
    thumbnail: '',
    category: 'personal',
  },
  {
    id: 17,
    titleKey: 'library.adidasBlue.title',
    type: 'video',
    publisher: 'Billy Boman AI Productions',
    publishDate: 'Jan 2024',
    publishDateFull: 'Jan 10, 2024',
    videoTypeKey: 'library.adidasBlue.type',
    purposeKey: 'library.adidasBlue.purpose',
    audienceKey: 'library.adidasBlue.audience',
    aiAnalysisKey: 'library.adidasBlue.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/CoufwK.mp4',
    duration: '00:38',
    views: 630000,
    likes: 15200,
    comments: 780,
    shares: 2600,
    tags: ['Adidas', 'Runway', 'Topaz'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 18,
    titleKey: 'library.porscheDream.title',
    type: 'video',
    publisher: 'Laszlo Gaal',
    publishDate: 'Jan 2025',
    publishDateFull: 'Jan 21, 2025',
    videoTypeKey: 'library.porscheDream.type',
    purposeKey: 'library.porscheDream.purpose',
    audienceKey: 'library.porscheDream.audience',
    aiAnalysisKey: 'library.porscheDream.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/Q0RMhR.mp4',
    duration: '00:42',
    views: 905000,
    likes: 19800,
    comments: 1030,
    shares: 3600,
    tags: ['Porsche', 'Luxury', 'Veo2'],
    thumbnail: '',
    category: 'auto',
  },
  {
    id: 19,
    titleKey: 'library.lincoln.title',
    type: 'video',
    publisher: 'Jeremy Haccoun',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 31, 2024',
    videoTypeKey: 'library.lincoln.type',
    purposeKey: 'library.lincoln.purpose',
    audienceKey: 'library.lincoln.audience',
    aiAnalysisKey: 'library.lincoln.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/KQuIPR.mp4',
    duration: '00:37',
    views: 488000,
    likes: 10900,
    comments: 590,
    shares: 1900,
    tags: ['Lincoln', 'Luxury', 'Gen-3'],
    thumbnail: '',
    category: 'auto',
  },
  {
    id: 20,
    titleKey: 'library.realThing.title',
    type: 'video',
    publisher: 'Anima Studios TV',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 4, 2024',
    videoTypeKey: 'library.realThing.type',
    purposeKey: 'library.realThing.purpose',
    audienceKey: 'library.realThing.audience',
    aiAnalysisKey: 'library.realThing.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/M0V4cZ.mp4',
    duration: '00:30',
    views: 720000,
    likes: 16000,
    comments: 840,
    shares: 3000,
    tags: ['Coca-Cola', 'Classic', 'AI Color'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 21,
    titleKey: 'library.flowerTea.title',
    type: 'video',
    publisher: '比尧',
    publishDate: 'May 2025',
    publishDateFull: 'May 27, 2025',
    videoTypeKey: 'library.flowerTea.type',
    purposeKey: 'library.flowerTea.purpose',
    audienceKey: 'library.flowerTea.audience',
    aiAnalysisKey: 'library.flowerTea.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/AKq5SY.mp4',
    duration: '00:40',
    views: 268000,
    likes: 7400,
    comments: 360,
    shares: 1500,
    tags: ['Tea', 'Culture', 'Ink Style'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 22,
    titleKey: 'library.warmFurball.title',
    type: 'video',
    publisher: '王天王-',
    publishDate: 'Nov 2024',
    publishDateFull: 'Nov 9, 2024',
    videoTypeKey: 'library.warmFurball.type',
    purposeKey: 'library.warmFurball.purpose',
    audienceKey: 'library.warmFurball.audience',
    aiAnalysisKey: 'library.warmFurball.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/C7jwEF.mp4',
    duration: '00:25',
    views: 182000,
    likes: 5200,
    comments: 280,
    shares: 1100,
    tags: ['DIY', 'Seasonal', 'AIGC'],
    thumbnail: '',
    category: 'diy',
  },
  {
    id: 23,
    titleKey: 'library.lenovoYouth.title',
    type: 'video',
    publisher: 'N_S600',
    publishDate: 'Oct 2025',
    publishDateFull: 'Oct 10, 2025',
    videoTypeKey: 'library.lenovoYouth.type',
    purposeKey: 'library.lenovoYouth.purpose',
    audienceKey: 'library.lenovoYouth.audience',
    aiAnalysisKey: 'library.lenovoYouth.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/qnxNPp.mp4',
    duration: '00:38',
    views: 350000,
    likes: 9100,
    comments: 520,
    shares: 1750,
    tags: ['Lenovo', 'Youth Day', 'Runway'],
    thumbnail: '',
    category: 'digital',
  },
  {
    id: 24,
    titleKey: 'library.pocari.title',
    type: 'video',
    publisher: '鹿柒乐',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 26, 2025',
    videoTypeKey: 'library.pocari.type',
    purposeKey: 'library.pocari.purpose',
    audienceKey: 'library.pocari.audience',
    aiAnalysisKey: 'library.pocari.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/9FTwsP.mp4',
    duration: '00:34',
    views: 410000,
    likes: 9600,
    comments: 540,
    shares: 1800,
    tags: ['Sports Drink', 'AI MV', 'Workflow'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 25,
    titleKey: 'library.xiaomiBuds.title',
    type: 'video',
    publisher: '红日映画AIGC',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 6, 2025',
    videoTypeKey: 'library.xiaomiBuds.type',
    purposeKey: 'library.xiaomiBuds.purpose',
    audienceKey: 'library.xiaomiBuds.audience',
    aiAnalysisKey: 'library.xiaomiBuds.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/U4Qvh1.mp4',
    duration: '00:29',
    views: 322000,
    likes: 8500,
    comments: 410,
    shares: 1600,
    tags: ['Xiaomi', 'Earbuds', 'Fantasy'],
    thumbnail: '',
    category: 'digital',
  },
  {
    id: 26,
    titleKey: 'library.ysl.title',
    type: 'video',
    publisher: '马尚AIGC',
    publishDate: 'Jul 2025',
    publishDateFull: 'Jul 19, 2025',
    videoTypeKey: 'library.ysl.type',
    purposeKey: 'library.ysl.purpose',
    audienceKey: 'library.ysl.audience',
    aiAnalysisKey: 'library.ysl.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/pWjX0j.mp4',
    duration: '00:31',
    views: 287000,
    likes: 7900,
    comments: 360,
    shares: 1400,
    tags: ['YSL', 'Fashion', 'Style Transfer'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 27,
    titleKey: 'library.heytea.title',
    type: 'video',
    publisher: '马尚AIGC',
    publishDate: 'Jul 2025',
    publishDateFull: 'Jul 8, 2025',
    videoTypeKey: 'library.heytea.type',
    purposeKey: 'library.heytea.purpose',
    audienceKey: 'library.heytea.audience',
    aiAnalysisKey: 'library.heytea.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/VjPtWE.mp4',
    duration: '00:26',
    views: 300000,
    likes: 7800,
    comments: 340,
    shares: 1300,
    tags: ['Tea', 'Summer', 'Brand Match'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 28,
    titleKey: 'library.guming.title',
    type: 'video',
    publisher: '马尚AIGC',
    publishDate: 'Jul 2025',
    publishDateFull: 'Jul 5, 2025',
    videoTypeKey: 'library.guming.type',
    purposeKey: 'library.guming.purpose',
    audienceKey: 'library.guming.audience',
    aiAnalysisKey: 'library.guming.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/jbJJqO.mp4',
    duration: '00:27',
    views: 278000,
    likes: 7300,
    comments: 320,
    shares: 1250,
    tags: ['Milk Tea', 'Guochao', 'Character'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 29,
    titleKey: 'library.taobao.title',
    type: 'video',
    publisher: 'Taobao',
    publishDate: 'Apr 2023',
    publishDateFull: 'Apr 19, 2023',
    videoTypeKey: 'library.taobao.type',
    purposeKey: 'library.taobao.purpose',
    audienceKey: 'library.taobao.audience',
    aiAnalysisKey: 'library.taobao.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/15WMVc.mp4',
    duration: '00:35',
    views: 950000,
    likes: 18800,
    comments: 1040,
    shares: 3700,
    tags: ['Taobao', 'Interactive', 'Digital Human'],
    thumbnail: '',
    category: 'platform',
  },
  {
    id: 30,
    titleKey: 'library.oreoCosmos.title',
    type: 'video',
    publisher: 'Oreo',
    publishDate: 'Jun 2023',
    publishDateFull: 'Jun 30, 2023',
    videoTypeKey: 'library.oreoCosmos.type',
    purposeKey: 'library.oreoCosmos.purpose',
    audienceKey: 'library.oreoCosmos.audience',
    aiAnalysisKey: 'library.oreoCosmos.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/8x26RE.mp4',
    duration: '00:30',
    views: 520000,
    likes: 11800,
    comments: 610,
    shares: 2100,
    tags: ['Oreo', 'Space', 'Zero Gravity'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 31,
    titleKey: 'library.snickers.title',
    type: 'video',
    publisher: 'Billy Boman',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 18, 2025',
    videoTypeKey: 'library.snickers.type',
    purposeKey: 'library.snickers.purpose',
    audienceKey: 'library.snickers.audience',
    aiAnalysisKey: 'library.snickers.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/zzaJ70.mp4',
    duration: '00:28',
    views: 440000,
    likes: 10900,
    comments: 520,
    shares: 1900,
    tags: ['Snickers', 'Veo 3', 'Slo-mo'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 32,
    titleKey: 'library.felix.title',
    type: 'video',
    publisher: 'Billy Boman',
    publishDate: 'Oct 2025',
    publishDateFull: 'Oct 2, 2025',
    videoTypeKey: 'library.felix.type',
    purposeKey: 'library.felix.purpose',
    audienceKey: 'library.felix.audience',
    aiAnalysisKey: 'library.felix.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/dq5Ola.mp4',
    duration: '00:32',
    views: 305000,
    likes: 8200,
    comments: 390,
    shares: 1500,
    tags: ['Felix', 'Sora', 'Food Detail'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 33,
    titleKey: 'library.redbull.title',
    type: 'video',
    publisher: 'Billy Boman',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 28, 2025',
    videoTypeKey: 'library.redbull.type',
    purposeKey: 'library.redbull.purpose',
    audienceKey: 'library.redbull.audience',
    aiAnalysisKey: 'library.redbull.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/qU95N8.mp4',
    duration: '00:29',
    views: 670000,
    likes: 15000,
    comments: 760,
    shares: 2700,
    tags: ['Red Bull', 'Extreme', 'Flow'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 34,
    titleKey: 'library.benefit.title',
    type: 'video',
    publisher: 'Billy Boman',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 11, 2025',
    videoTypeKey: 'library.benefit.type',
    purposeKey: 'library.benefit.purpose',
    audienceKey: 'library.benefit.audience',
    aiAnalysisKey: 'library.benefit.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/kbLya2.mp4',
    duration: '00:27',
    views: 298000,
    likes: 8700,
    comments: 430,
    shares: 1500,
    tags: ['Benefit', 'Cosmetics', 'Luma'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 35,
    titleKey: 'library.kalshi.title',
    type: 'video',
    publisher: 'PJ Ace',
    publishDate: 'Jul 2025',
    publishDateFull: 'Jul 11, 2025',
    videoTypeKey: 'library.kalshi.type',
    purposeKey: 'library.kalshi.purpose',
    audienceKey: 'library.kalshi.audience',
    aiAnalysisKey: 'library.kalshi.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/ODHWX7.mp4',
    duration: '00:36',
    views: 210000,
    likes: 6200,
    comments: 310,
    shares: 1100,
    tags: ['Finance', 'Prediction', 'LoRA'],
    thumbnail: '',
    category: 'finance',
  },
  {
    id: 36,
    titleKey: 'library.im8.title',
    type: 'video',
    publisher: 'PJ Ace',
    publishDate: 'Aug 2025',
    publishDateFull: 'Aug 27, 2025',
    videoTypeKey: 'library.im8.type',
    purposeKey: 'library.im8.purpose',
    audienceKey: 'library.im8.audience',
    aiAnalysisKey: 'library.im8.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/6WJEf7.mp4',
    duration: '00:32',
    views: 240000,
    likes: 6800,
    comments: 330,
    shares: 1200,
    tags: ['IM8', 'Health Drink', 'Digital Human'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 37,
    titleKey: 'library.wistiaLenny.title',
    type: 'video',
    publisher: 'Billy Woodward',
    publishDate: 'Oct 2025',
    publishDateFull: 'Oct 1, 2025',
    videoTypeKey: 'library.wistiaLenny.type',
    purposeKey: 'library.wistiaLenny.purpose',
    audienceKey: 'library.wistiaLenny.audience',
    aiAnalysisKey: 'library.wistiaLenny.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/mock-lenny.mp4',
    duration: '00:30',
    views: 190000,
    likes: 5400,
    comments: 260,
    shares: 1000,
    tags: ['Wistia', 'Narrative', 'Mock'],
    thumbnail: '',
    category: 'platform',
  },
  {
    id: 38,
    titleKey: 'library.guerlain.title',
    type: 'video',
    publisher: 'Guerlain',
    publishDate: '2023',
    publishDateFull: '2023',
    videoTypeKey: 'library.guerlain.type',
    purposeKey: 'library.guerlain.purpose',
    audienceKey: 'library.guerlain.audience',
    aiAnalysisKey: 'library.guerlain.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/yIpmK5.mp4',
    duration: '00:40',
    views: 510000,
    likes: 12400,
    comments: 580,
    shares: 1900,
    tags: ['Luxury', 'Craft', '3D'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 39,
    titleKey: 'library.bosie.title',
    type: 'video',
    publisher: 'bosie',
    publishDate: 'Jun 2021',
    publishDateFull: 'Jun 20, 2021',
    videoTypeKey: 'library.bosie.type',
    purposeKey: 'library.bosie.purpose',
    audienceKey: 'library.bosie.audience',
    aiAnalysisKey: 'library.bosie.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/liq5Q5.mp4',
    duration: '00:44',
    views: 330000,
    likes: 8900,
    comments: 430,
    shares: 1500,
    tags: ['bosie', 'Sci-fi', 'Myth'],
    thumbnail: '',
    category: 'fashion',
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
    { id: 'all', labelKey: 'library.all' },
    { id: 'food', labelKey: 'library.food' },
    { id: 'auto', labelKey: 'library.auto' },
    { id: 'fashion', labelKey: 'library.fashion' },
    { id: 'digital', labelKey: 'library.digital' },
    { id: 'finance', labelKey: 'library.finance' },
    { id: 'personal', labelKey: 'library.personal' },
    { id: 'culture', labelKey: 'library.culture' },
    { id: 'platform', labelKey: 'library.platform' },
    { id: 'diy', labelKey: 'library.diy' },
  ];

  const filteredItems = mockLibraryItems.filter(item => {
    const title = t(item.titleKey);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
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

        {/* Filter Tabs with horizontal scroll */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('filter-scroll');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="flex-shrink-0 p-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Filter Container */}
            <div 
              id="filter-scroll"
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    activeFilter === filter.id
                      ? 'bg-foreground text-background'
                      : 'border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {t(filter.labelKey)}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('filter-scroll');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="flex-shrink-0 p-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Library Grid - TikTok style vertical cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isMp4 = item.videoUrl.endsWith('.mp4');
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Video element for mp4 - shows first frame as thumbnail, plays on hover */}
                {isMp4 ? (
                  <video 
                    src={item.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget;
                      video.currentTime = 0;
                      video.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : null}
                
                {/* Thumbnail - only for non-mp4 */}
                {!isMp4 && (
                  <img 
                    src={item.thumbnail} 
                    alt={t(item.titleKey)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                
                {/* Play button - hide for mp4 on hover since video plays */}
                {item.type === 'video' && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity z-20 pointer-events-none ${isMp4 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Duration badge */}
                {item.duration && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded z-20">
                    {item.duration}
                  </span>
                )}
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                  {/* Stats - prominent display at top */}
                  <div className="flex items-center gap-4 text-white mb-3">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5" />
                      <span className="text-base font-bold">{formatNumber(item.likes)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-base font-bold">{item.comments}</span>
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white text-base font-bold mb-1.5 line-clamp-2 drop-shadow-lg leading-tight">
                    {t(item.titleKey)}
                  </h3>
                  
                  {/* Publisher & Views */}
                  <div className="flex items-center justify-between text-white/80">
                    <span className="text-sm">@{item.publisher.replace(/\s+/g, '').toLowerCase()}</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" />
                      {formatNumber(item.views)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Media Preview - Phone style */}
              <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                  {selectedItem.videoUrl.endsWith('.mp4') ? (
                    <video 
                      src={selectedItem.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      poster={selectedItem.thumbnail}
                    />
                  ) : (
                    <>
                      <img 
                        src={selectedItem.thumbnail} 
                        alt={t(selectedItem.titleKey)}
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={selectedItem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </a>
                    </>
                  )}
                  {selectedItem.duration && !selectedItem.videoUrl.endsWith('.mp4') && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 text-white text-xs font-medium rounded">
                      {selectedItem.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Primary: Title */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4 break-words">{t(selectedItem.titleKey)}</h2>
                
                {/* Secondary: Publisher Info */}
                <div className="space-y-2 mb-5">
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">Publisher: </span>
                    <span className="text-foreground font-medium">{selectedItem.publisher}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.videoType')}: </span>
                    <span className="text-foreground font-medium">{t(selectedItem.videoTypeKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.purpose')}: </span>
                    <span className="text-foreground font-medium break-words">{t(selectedItem.purposeKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.audience')}: </span>
                    <span className="text-foreground font-medium break-words">{t(selectedItem.audienceKey)}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-muted-foreground">{t('library.aiAnalysis')}: </span>
                    <span className="text-foreground font-medium break-words">{t(selectedItem.aiAnalysisKey)}</span>
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Published: {selectedItem.publishDateFull}
                  </p>
                </div>

                {/* Stats - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.views.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.likes.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.comments.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-base md:text-lg font-bold text-foreground">{selectedItem.shares.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Shares</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-xs md:text-sm font-medium rounded-full border border-border/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {selectedItem.videoUrl.endsWith('.mp4') ? (
                    <a 
                      href={selectedItem.videoUrl}
                      download
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      {t('library.downloadVideo')}
                    </a>
                  ) : (
                    <a 
                      href={selectedItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                      {t('library.watchVideo')}
                    </a>
                  )}
                  <button className="flex-1 py-3 md:py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    {t('library.replicate')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
