import { logger } from '@/lib/logger';

/**
 * IP地理位置信息接口
 */
export interface IPLocationInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_name: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

/**
 * 使用ipapi.co服务检测IP地址是否来自中国
 * @returns Promise<boolean> - true表示是中国IP，false表示不是中国IP
 */
export async function isChinaIP(): Promise<boolean> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IPLocationInfo = await response.json();
    
    // 检查国家代码是否为CN（中国）
    const isChina = data.country_code === 'CN';
    
    logger.info('IP location detected', { 
      country: data.country_name, 
      countryCode: data.country_code,
      isChina 
    });
    
    return isChina;
  } catch (error) {
    logger.error('Failed to detect IP location', error as Error);
    // 出错时默认返回false，显示所有模型
    return false;
  }
}

/**
 * 获取IP地理位置信息
 * @returns Promise<IPLocationInfo | null> - 地理位置信息，失败返回null
 */
export async function getIPLocation(): Promise<IPLocationInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: IPLocationInfo = await response.json();
    
    logger.info('IP location fetched', { 
      country: data.country_name, 
      countryCode: data.country_code 
    });
    
    return data;
  } catch (error) {
    logger.error('Failed to get IP location', error as Error);
    return null;
  }
}

