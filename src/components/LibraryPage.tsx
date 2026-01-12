import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Play, Download, Eye, Heart, MessageCircle, Share2, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchMaterialSquareList, 
  fetchMaterialSquareDetail,
  MaterialSquareItem,
  MaterialSquareDetail as MaterialSquareDetailType
} from '@/lib/api/library';

// 使用API返回的接口类型
type LibraryItem = MaterialSquareItem;

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

// 视频卡片组件 - 自动播放视频
interface VideoCardProps {
  src: string;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 使用 IntersectionObserver 检测视频是否在视口中，自动播放/暂停
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当视频进入视口时自动播放
            video.play().catch(() => {
              // 如果自动播放失败（例如浏览器策略限制），静默处理
            });
          } else {
            // 当视频离开视口时暂停
            video.pause();
          }
        });
      },
      {
        threshold: 0.3, // 当30%的视频可见时触发
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      className={className}
      onMouseEnter={(e) => {
        const video = e.currentTarget;
        // 鼠标悬停时重置并播放
        video.currentTime = 0;
        video.play().catch(() => {});
      }}
    />
  );
};

const LibraryPage: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  // 搜索输入值（立即更新，用于显示）
  const [searchInput, setSearchInput] = useState('');
  // 实际用于查询的搜索关键词（防抖后更新）
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 分页状态 - 使用累加方式存储所有已加载的数据
  const [allLoadedItems, setAllLoadedItems] = useState<MaterialSquareItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // 固定的筛选器列表（初始化后不再变化）
  const [fixedFilters, setFixedFilters] = useState<Array<{ id: string; label: string }>>([
    { id: 'all', label: t('library.all') || 'All' }
  ]);

  // 组件挂载时，重置所有状态并重新获取数据
  useEffect(() => {
    // 重置状态
    setCurrentPage(1);
    setAllLoadedItems([]);
    setTotalCount(0);
    setSearchInput('');
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedItemId(null);
    // 重置筛选器列表
    setFixedFilters([{ id: 'all', label: t('library.all') || 'All' }]);
    
    // 清除防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // 清除查询缓存并重新获取数据
    queryClient.invalidateQueries({ queryKey: ['materialSquareList'] });
  }, []); // 空依赖数组，只在组件挂载时执行

  // 搜索防抖：用户停止输入500ms后才更新searchQuery
  useEffect(() => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 设置新的防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500); // 500ms防抖延迟
    
    // 清理函数：组件卸载或searchInput变化时清除定时器
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [searchInput]);
  
  // 组件卸载时清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  // 响应式列数（根据屏幕大小）
  const getColumnCount = (): number => {
    if (typeof window === 'undefined') return 5;
    const width = window.innerWidth;
    if (width >= 1280) return 5; // xl
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 3; // md
    return 2; // sm
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取列表数据
  const { data: listData, isLoading: listLoading, error: listError } = useQuery({
    queryKey: ['materialSquareList', searchQuery, activeFilter, currentPage],
    queryFn: () => {
      const params: Parameters<typeof fetchMaterialSquareList>[0] = {
        page: currentPage,
        size: pageSize,
      };
      
      // 只有当搜索关键词存在时才添加title参数
      if (searchQuery) {
        params.title = searchQuery;
      }
      
      // 只有当筛选不是'all'时才添加type参数
      if (activeFilter && activeFilter !== 'all') {
        params.type = activeFilter;
      }
      
      return fetchMaterialSquareList(params);
    },
  });

  // 当列表数据更新时，累加到allLoadedItems
  useEffect(() => {
    if (listData?.data?.list) {
      if (currentPage === 1) {
        // 第一页，直接替换
        setAllLoadedItems(listData.data.list);
        setTotalCount(listData.data.total);
        
        // 只在初始化时（activeFilter为'all'且筛选器列表还未初始化）提取筛选类型
        if (activeFilter === 'all') {
          setFixedFilters(prev => {
            // 如果筛选器列表已经初始化（长度大于1），不再更新
            if (prev.length > 1) {
              return prev;
            }
            
            // 从第一页数据中提取所有唯一的category
            const categories = new Set<string>();
            listData.data.list.forEach(item => {
              if (item.category && item.category.trim()) {
                categories.add(item.category);
              }
            });
            
            const categoryFilters = Array.from(categories)
              .sort()
              .map(cat => ({
                id: cat,
                label: cat,
              }));
            
            return [
              { id: 'all', label: t('library.all') || 'All' },
              ...categoryFilters,
            ];
          });
        }
      } else {
        // 后续页，累加
        setAllLoadedItems(prev => [...prev, ...listData.data.list]);
        // 更新总数（如果后端返回的总数有变化）
        if (listData.data.total !== totalCount) {
          setTotalCount(listData.data.total);
        }
      }
    }
  }, [listData, currentPage, activeFilter, t, totalCount]);

  // 当搜索或筛选条件改变时，重置数据
  useEffect(() => {
    setCurrentPage(1);
    setAllLoadedItems([]);
    setTotalCount(0);
    // 清除相关查询缓存
    queryClient.invalidateQueries({ queryKey: ['materialSquareList'] });
  }, [searchQuery, activeFilter, queryClient]);

  // 获取详情数据
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ['materialSquareDetail', selectedItemId],
    queryFn: () => fetchMaterialSquareDetail(selectedItemId!),
    enabled: selectedItemId !== null,
  });

  // 筛选项目（客户端筛选，因为API可能不支持所有筛选）
  const filteredItems = useMemo(() => {
    return allLoadedItems.filter(item => {
      const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });
  }, [allLoadedItems, searchQuery, activeFilter]);

  // 使用固定的筛选器列表（初始化后不再变化）
  const filters = useMemo(() => {
    return fixedFilters;
  }, [fixedFilters]);

  // 是否还有更多数据 - 基于已加载的数据量和总数判断
  const hasMore = useMemo(() => {
    if (!totalCount || totalCount === 0) {
      // 如果还没有总数，检查当前查询结果
      return listData?.data ? (currentPage * pageSize < listData.data.total) : false;
    }
    // 基于已加载的数据量和总数判断
    return allLoadedItems.length < totalCount;
  }, [allLoadedItems.length, totalCount, listData, currentPage, pageSize]);

  // 滚动加载更多
  useEffect(() => {
    if (!hasMore || listLoading) return;

    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !listLoading) {
          // 确保还有更多数据且不在加载中时才加载下一页
          setCurrentPage((prev) => {
            // 计算应该加载的下一页
            const nextPage = prev + 1;
            // 检查是否超过总数
            const maxPage = totalCount > 0 ? Math.ceil(totalCount / pageSize) : nextPage;
            return nextPage <= maxPage ? nextPage : prev;
          });
        }
      },
      {
        rootMargin: '200px', // 提前200px开始加载
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, listLoading, totalCount, pageSize]);

  // 判断是否为视频
  const isVideo = (url: string, mediaType: string): boolean => {
    return mediaType === 'video' || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                  {filter.label}
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

        {/* Loading State */}
        {listLoading && filteredItems.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">{t('library.loading')}</div>
          </div>
        )}

        {/* Error State */}
        {listError && (
          <div className="flex justify-center items-center py-20">
            <div className="text-destructive">{t('library.loadFailed')}</div>
          </div>
        )}

        {/* Library Grid - TikTok style vertical cards */}
        {filteredItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item, index) => {
              const isVideoItem = isVideo(item.sourceUrl, item.mediaType);
              // 计算列索引（瀑布流式：不同列有不同的延迟）
              const columnIndex = index % columnCount;
              // 计算行索引
              const rowIndex = Math.floor(index / columnCount);
              // 瀑布流式延迟：列索引决定基础延迟，行索引增加额外延迟
              const delay = columnIndex * 0.1 + rowIndex * 0.05;
              
            return (
                <motion.div
                key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedItemId(item.id)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
              >
                  {/* Video element for video - auto plays when visible */}
                  {isVideoItem ? (
                  <VideoCard
                    src={item.sourceUrl}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  ) : (
                  <img 
                      src={item.sourceUrl} 
                      alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // 如果图片加载失败，显示占位符
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />
                
                  {/* Play button - hide for video on hover since video plays */}
                  {isVideoItem && (
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity z-20 pointer-events-none opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                  {/* Stats - prominent display at top */}
                  <div className="flex items-center gap-4 text-white mb-3">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5" />
                        <span className="text-base font-bold">{formatNumber(item.likeCount)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5" />
                        <span className="text-base font-bold">{item.commentCount}</span>
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white text-base font-bold mb-1.5 line-clamp-2 drop-shadow-lg leading-tight">
                      {item.title}
                  </h3>
                  
                  {/* Publisher & Views */}
                  <div className="flex items-center justify-between text-white/80">
                      <span className="text-sm">@{item.publisher?.replace(/\s+/g, '').toLowerCase() || t('library.unknown').toLowerCase()}</span>
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" />
                        {formatNumber(item.viewCount)}
                    </span>
                  </div>
                </div>
                </motion.div>
            );
          })}
        </div>
        )}

        {/* 加载更多触发器 */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-8">
            <div className="text-sm text-muted-foreground">{t('library.loadingMore')}</div>
          </div>
        )}

        {/* 空状态 */}
        {!listLoading && filteredItems.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground">{t('library.noData')}</div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItemId && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItemId(null)}
        >
          <div 
            className="bg-background rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-border/20 max-h-[90vh] overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItemId(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/30 transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {detailLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-muted-foreground">{t('library.loading')}</div>
              </div>
            ) : detailData?.data ? (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Media Preview - Phone style */}
              <div className="lg:w-[240px] flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden border-4 border-muted/30 max-w-[200px] lg:max-w-none mx-auto">
                    {isVideo(detailData.data.sourceUrl, detailData.data.mediaType) ? (
                    <video 
                        src={detailData.data.sourceUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                      <img 
                        src={detailData.data.sourceUrl} 
                        alt={detailData.data.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Primary: Title */}
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-4 break-words">
                    {detailData.data.title}
                  </h2>
                
                {/* Secondary: Publisher Info */}
                <div className="space-y-2 mb-5">
                  <p className="text-sm md:text-base">
                      <span className="text-muted-foreground">{t('library.publisher')}: </span>
                      <span className="text-foreground font-medium">{detailData.data.publisher || t('library.unknown')}</span>
                  </p>
                  <p className="text-sm md:text-base">
                      <span className="text-muted-foreground">{t('library.category')}: </span>
                      <span className="text-foreground font-medium">{detailData.data.category || t('library.unknown')}</span>
                  </p>
                    {detailData.data.purpose && (
                  <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.purposeLabel')}: </span>
                        <span className="text-foreground font-medium break-words">{detailData.data.purpose}</span>
                  </p>
                    )}
                    {detailData.data.targetAudience && (
                  <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.targetAudienceLabel')}: </span>
                        <span className="text-foreground font-medium break-words">{detailData.data.targetAudience}</span>
                  </p>
                    )}
                    {detailData.data.aiTech && (
                  <p className="text-sm md:text-base">
                        <span className="text-muted-foreground">{t('library.aiTechLabel')}: </span>
                        <span className="text-foreground font-medium break-words">{detailData.data.aiTech}</span>
                  </p>
                    )}
                  <p className="text-xs md:text-sm text-muted-foreground">
                      {t('library.publishTime')}: {formatDate(detailData.data.publishTime)}
                  </p>
                </div>

                {/* Stats - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-border/30">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-base md:text-lg font-bold text-foreground">{detailData.data.viewCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{t('library.views')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-base md:text-lg font-bold text-foreground">{detailData.data.likeCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{t('library.likes')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-base md:text-lg font-bold text-foreground">{detailData.data.commentCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{t('library.comments')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-base md:text-lg font-bold text-foreground">{detailData.data.shareCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{t('library.shares')}</span>
                  </div>
                    {detailData.data.collectCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-base md:text-lg font-bold text-foreground">{detailData.data.collectCount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{t('library.collects')}</span>
                      </div>
                    )}
                </div>

                {/* Tags */}
                  {detailData.data.tags && detailData.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                      {detailData.data.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-muted/30 text-muted-foreground text-xs md:text-sm font-medium rounded-full border border-border/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                  )}

                <div className="flex gap-3">
                    {isVideo(detailData.data.sourceUrl, detailData.data.mediaType) ? (
                    <a 
                        href={detailData.data.sourceUrl}
                      download
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      {t('library.downloadVideo')}
                    </a>
                  ) : (
                    <a 
                        href={detailData.data.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 md:py-4 rounded-xl border border-border/50 text-foreground font-medium hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                        {t('library.watchResource')}
                    </a>
                  )}
                  <button 
                    className="group relative flex-1 py-3 md:py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-default"
                    disabled
                  >
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    {t('library.replicate')}
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium text-foreground">{t('library.comingSoon')}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            ) : (
              <div className="flex justify-center items-center py-20">
                <div className="text-destructive">{t('library.loadDetailFailed')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
