import FedCampusAPI from '../src/services/fedcampus-api.js';
import HealthDataCollector from '../src/services/health-data-collector.ts';
const mockUserInfo = {
  pubkey: '-----BEGIN PUBLIC KEY-----MOCK-----END PUBLIC KEY-----',
  uid: 'u-123',
  token: 'fake-token'
};

describe('完整数据流程测试', () => {  
  test('从数据获取到发送的完整流程', async () => {  
    // 模拟健康数据获取  
    const healthData = await HealthDataCollector.getHealthData(['steps'], 20241201);  
      
    // 测试数据发送  
    const response = await FedCampusAPI.sendHealthData(healthData, mockUserInfo);  
    expect(response).toBeDefined();  
  });  
});
