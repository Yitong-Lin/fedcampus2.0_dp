// src/services/health-data-collector.ts
import { NativeModules, Platform } from 'react-native';
import type { PlatformDataMapping } from '../types/fedcampus-2.0-client-interfaces';
import { platformDataMapping } from './platform-data-mapping'; //

const { HealthDataModule } = NativeModules;
const log = (...args: any[]) => {
  if (process.env.DEBUG_FEDCAMPUS === '1') console.log(...args);
};

class HealthDataCollector {
  static async getHealthData(dataTypes: string[], date: number): Promise<Record<string, any>> {
    log('\n[HealthDataCollector] 开始收集');
    log('📥 dataTypes:', dataTypes, ' date:', date);

    const healthData: Record<string, any> = {};

    for (const dataType of dataTypes) {
      try {
        const platformDataType = this.getPlatformDataType(dataType);
        log(`🔹 ${dataType} -> 平台类型: ${platformDataType}`);

        const fromTs = this.dateToTimestamp(date);
        const toTs = this.dateToTimestamp(date + 1);
        const rawData = await HealthDataModule.getData(platformDataType, fromTs, toTs);
        log(`📥 原生 rawData(${dataType}):`, rawData);

        healthData[dataType] = this.convertToStandardFormat(rawData, dataType);
        log(`✅ 标准化(${dataType}):`, healthData[dataType]);
      } catch (e) {
        console.error(`❌ 获取 ${dataType} 失败:`, e);
        healthData[dataType] = [];
      }
    }

    log('[HealthDataCollector] 结束收集\n');
    return healthData;
  }

  /**
   * 获取平台特定的数据类型标识符（只是“标识符字符串”，不是数值类型）
   */
  static getPlatformDataType(dataType: string): string {
    const mapping: PlatformDataMapping =
        (Platform.OS === 'android' ? platformDataMapping.android : platformDataMapping.ios) as any;
    return (mapping as any)[dataType] || dataType;
  }

  static convertToStandardFormat(rawData: any, dataType: string): any[] {
    if (!Array.isArray(rawData)) return [];
    return rawData.map((item: any) => {
      const timestamp = BigInt(item.timestamp ?? Date.now());
      if (dataType === 'sleep_duration') {
        return { timestamp, data: { value: BigInt(item.value ?? 0) } };
      } else if (dataType === 'blood_pressure') {
        return {
          timestamp,
          data: { systolic: item.systolic ?? 0, diastolic: item.diastolic ?? 0 },
        };
      } else if (['steps', 'flight_climbed'].includes(dataType)) {
        return { timestamp, data: { value: Math.round(item.value ?? 0) } };
      } else {
        return { timestamp, data: { value: parseFloat(item.value ?? 0) } };
      }
    });
  }

  static dateToTimestamp(date: number): number {
    const s = String(date);
    const year = parseInt(s.slice(0, 4));
    const month = parseInt(s.slice(4, 6)) - 1;
    const day = parseInt(s.slice(6, 8));
    return new Date(year, month, day).getTime();
  }

  static async requestPermissions(dataTypes: string[]): Promise<boolean> {
    try {
      const permissions = dataTypes.map((t) => this.getPlatformDataType(t));
      const granted = await HealthDataModule.requestPermissions(permissions);
      log('[HealthDataCollector] 权限结果:', granted);
      return granted;
    } catch (e) {
      console.error('❌ 请求权限失败:', e);
      return false;
    }
  }
}

export default HealthDataCollector;
