import { validateHealthData } from '../src/services/data-adapter.js';
  
describe('数据接口验证', () => {  
  test('应该验证正确的健康数据格式', () => {  
    const validData = {  
      steps: [{  
        timestamp: BigInt(Date.now()),  
        data: { value: 8000 }  
      }],  
      sleep_duration: [{  
        timestamp: BigInt(Date.now()),  
        data: { value: BigInt(28800000) }  
      }]  
    };  
      
    const result = validateHealthData(validData);  
    expect(result.isValid).toBe(true);  
    expect(result.errors).toHaveLength(0);  
  });  
  
  test('应该拒绝无效的睡眠数据', () => {  
    const invalidData = {  
      sleep_duration: [{  
        timestamp: BigInt(Date.now()),  
        data: { value: BigInt(60000) } // 只有1分钟，少于2小时  
      }]  
    };  
      
    const result = validateHealthData(invalidData);  
    expect(result.isValid).toBe(false);  
    expect(result.errors.length).toBeGreaterThan(0);  
  });  
});
