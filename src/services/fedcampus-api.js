// src/services/fedcampus-api.js
import DifferentialPrivacy from './differential-privacy.js';
import RSAEncryption from './rsa-encryption.js';
import { Platform } from 'react-native';
import Config from './config.js'; // 如路径不同请改

const { ENDPOINTS, BASE_URL } = Config.API;
const API_BASE_URL = BASE_URL || 'http://localhost:8000';

// 小工具：只在需要时打印（设置环境变量 DEBUG_FEDCAMPUS=1）
const log = (...args) => {
  if (process.env.DEBUG_FEDCAMPUS === '1') console.log(...args);
};

class FedCampusAPI {
  /**
   * 发送健康数据到服务器（包含差分隐私处理）
   */
  static async sendHealthData(healthData, userInfo) {
    try {
      log('\n====== [FedCampusAPI] 开始发送健康数据 ======');
      log('📥 输入 healthData:', JSON.stringify(healthData, null, 2));
      log('📥 输入 userInfo:', JSON.stringify(userInfo, null, 2));

      // 1) 差分隐私
      const fuzzedData = DifferentialPrivacy.fuzzHealthData(healthData);
      log('🔹 差分隐私后 fuzzedData:', JSON.stringify(fuzzedData, null, 2));

      // 2) RSA 加密
      const encryptedOriginal = await RSAEncryption.encrypt(
          JSON.stringify(healthData),
          userInfo.publicKey
      );
      log('🔒 原始数据加密 encryptedOriginal:', encryptedOriginal);

      const encryptedFuzzed = await RSAEncryption.encrypt(
          JSON.stringify(fuzzedData),
          userInfo.publicKey
      );
      log('🔒 模糊数据加密 encryptedFuzzed:', encryptedFuzzed);

      // 3) 构造请求（注意：不要用 BigInt 直接 JSON.stringify）
      const nowTs = Date.now();
      const apiType = this.getApiType();
      const originalRequest = {
        timestamp: nowTs,
        'api-type': apiType,
        pubkey: userInfo.userId,
        data: encryptedOriginal,
      };
      const fuzzedRequest = {
        timestamp: nowTs,
        'api-type': apiType,
        pubkey: userInfo.userId,
        data: encryptedFuzzed,
      };
      log('📤 originalRequest:', originalRequest);
      log('📤 fuzzedRequest:', fuzzedRequest);

      // 4) 并行发送
      const responses = await Promise.all([
        this.sendDataToEndpoint(ENDPOINTS.DATA, originalRequest),
        this.sendDataToEndpoint(ENDPOINTS.DATA_DP, fuzzedRequest),
      ]);
      log('✅ 服务器响应 responses:', responses);
      log('====== [FedCampusAPI] 结束发送健康数据 ======\n');

      return responses;
    } catch (error) {
      console.error('❌ 发送健康数据失败:', error);
      throw error;
    }
  }

  static async sendDataToEndpoint(endpoint, requestData) {
    log(`[FedCampusAPI] fetch -> ${API_BASE_URL}${endpoint}`, requestData);
    const resp = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    log(`[FedCampusAPI] fetch <- status: ${resp?.status}`);
    return resp;
  }

  static getApiType() {
    return Platform.OS === 'android' ? 3 : 2; // 3: Android, 2: iOS
  }
}

export default FedCampusAPI;
