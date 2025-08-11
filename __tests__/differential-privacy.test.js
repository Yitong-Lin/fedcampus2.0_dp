import DifferentialPrivacy from '../src/services/differential-privacy';
  
describe('DifferentialPrivacy', () => {  
  test('应该正确对步数数据添加噪声', () => {  
    const testData = {  
      steps: [{  
        timestamp: BigInt(Date.now()),  
        data: { value: 10000 }  
      }]  
    };  
      
    const fuzzedData = DifferentialPrivacy.fuzzHealthData(testData);  
      
    // 验证噪声已添加  
    expect(fuzzedData.steps[0].data.value).not.toBe(10000);  
    expect(typeof fuzzedData.steps[0].data.value).toBe('number');  
      
    // 验证数据结构完整  
    expect(fuzzedData.steps[0]).toHaveProperty('timestamp');  
    expect(fuzzedData.steps[0]).toHaveProperty('data');  
  });  
  
  test('应该正确处理睡眠数据的特殊噪声', () => {  
    const testData = {  
      sleep_duration: [{  
        timestamp: BigInt(Date.now()),  
        data: { value: BigInt(28800000) } // 8小时  
      }]  
    };  
      
    const fuzzedData = DifferentialPrivacy.fuzzHealthData(testData);  
      
    expect(typeof fuzzedData.sleep_duration[0].data.value).toBe('bigint');  
    expect(fuzzedData.sleep_duration[0].data.value).not.toBe(BigInt(28800000));  
  });  
});
