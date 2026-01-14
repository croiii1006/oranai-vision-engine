/**
 * 模型API服务
 */

import { config } from "../config";
import { logger } from "../logger";
import { handleError } from "../utils/error-handler";

/**
 * 供应商信息
 */
export interface Vendor {
  id: number;
  name: string;
  icon: string;
}

/**
 * 模型数据
 */
export interface ModelData {
  model_name: string;
  vendor_id?: number;
  quota_type: number; // 0: 按量计费, 1: 按次计费
  model_ratio: number;
  model_price: number;
  owner_by: string;
  completion_ratio: number;
  enable_groups: string[];
  supported_endpoint_types: string[];
}

/**
 * 定价API响应
 */
export interface PricingResponse {
  auto_groups: string[];
  data: ModelData[];
  group_ratio: Record<string, number>;
  success: boolean;
  supported_endpoint: Record<string, { path: string; method: string }>;
  usable_group: Record<string, string>;
  vendors: Vendor[];
}

/**
 * 获取模型定价数据
 */
export async function fetchPricingData(): Promise<PricingResponse> {
  // 统一拼接路径，无论是完整 URL 还是代理路径
  const apiUrl = `${config.api.modelsBaseUrl}/api/pricing`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PricingResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data;
  } catch (error) {
    logger.error("Failed to fetch pricing data", error as Error);
    throw handleError(error, { context: "fetchPricingData" });
  }
}

