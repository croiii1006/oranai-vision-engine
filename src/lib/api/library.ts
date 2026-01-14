import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

// 列表项接口
export interface MaterialSquareItem {
  id: number;
  createUserString: string | null;
  createTime: string;
  title: string;
  mediaType: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  publisher: string;
  publishTime: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
}

// 详情接口
export interface MaterialSquareDetail extends MaterialSquareItem {
  purpose?: string;
  targetAudience?: string;
  aiTech?: string;
  status?: number;
}

// 列表响应接口
export interface MaterialSquareListResponse {
  success: boolean;
  code: number;
  msg: string;
  data: {
    list: MaterialSquareItem[];
    total: number;
  };
  timestamp?: number;
}

// 详情响应接口
export interface MaterialSquareDetailResponse {
  success: boolean;
  code: number;
  msg: string;
  data: MaterialSquareDetail;
  timestamp?: number;
}

// 列表查询参数
export interface MaterialSquareListParams {
  title?: string;
  type?: string;
  mediaType?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 获取素材广场分页列表
 */
export async function fetchMaterialSquareList(
  params: MaterialSquareListParams = {}
): Promise<MaterialSquareListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    // 只有当参数存在且不为空时才添加到查询参数中
    if (params.title && params.title.trim()) {
      queryParams.append('title', params.title.trim());
    }
    if (params.type && params.type.trim() && params.type !== 'all') {
      queryParams.append('type', params.type.trim());
    }
    if (params.mediaType && params.mediaType.trim()) {
      queryParams.append('mediaType', params.mediaType.trim());
    }
    if (params.status && params.status.trim()) {
      queryParams.append('status', params.status.trim());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.sort && params.sort.trim()) {
      queryParams.append('sort', params.sort.trim());
    }

    // 统一拼接路径，无论是完整 URL 还是代理路径
    const url = `${config.api.libraryBaseUrl}/api/app/material-square/page${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    logger.info('Fetching material square list', { url, params });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MaterialSquareListResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || 'Failed to fetch material square list');
    }

    logger.info('Material square list fetched successfully', { count: data.data.list.length });
    return data;
  } catch (error) {
    logger.error('Error fetching material square list', error);
    throw error;
  }
}

/**
 * 获取素材广场详情
 */
export async function fetchMaterialSquareDetail(id: number): Promise<MaterialSquareDetailResponse> {
  try {
    // 统一拼接路径，无论是完整 URL 还是代理路径
    const url = `${config.api.libraryBaseUrl}/api/app/material-square/${id}`;
    
    logger.info('Fetching material square detail', { url, id });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MaterialSquareDetailResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || 'Failed to fetch material square detail');
    }

    logger.info('Material square detail fetched successfully', { id });
    return data;
  } catch (error) {
    logger.error('Error fetching material square detail', error);
    throw error;
  }
}

