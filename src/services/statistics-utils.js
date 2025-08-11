/**  
 * 生成截断正态分布样本  
 * @param {number} count - 样本数量  
 * @param {number} min - 最小值  
 * @param {number} max - 最大值    
 * @param {number} mean - 均值  
 * @param {number} std - 标准差  
 * @returns {Array<number>} 噪声样本数组  
 */  
export function truncatedNormalSample(count, min, max, mean, std) {  
  const samples = [];  
    
  for (let i = 0; i < count; i++) {  
    let sample;  
    do {  
      // Box-Muller变换生成正态分布  
      const u1 = Math.random();  
      const u2 = Math.random();  
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);  
      sample = mean + std * z0;  
    } while (sample < min || sample > max);  
      
    samples.push(sample);  
  }  
    
  return samples;  
}
