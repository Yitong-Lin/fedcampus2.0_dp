class DataAdapter {  
  /**  
   * 将平台原生数据转换为FedCampus 2.0格式  
   * @param {Object} nativeData - 原生平台数据  
   * @returns {Object} 转换后的数据  
   */  
  static convertNativeToFedCampus(nativeData) {  
    const convertedData = {};  
      
    Object.keys(nativeData).forEach(dataType => {  
      const dataPoints = nativeData[dataType];  
      if (!Array.isArray(dataPoints)) return;  
        
      convertedData[dataType] = dataPoints.map(point => {  
        return this.convertDataPoint(point, dataType);  
      });  
    });  
      
    return convertedData;  
  }  
  
  /**  
   * 转换单个数据点  
   */  
  static convertDataPoint(point, dataType) {  
    const timestamp = BigInt(point.timestamp || Date.now());  
      
    switch (dataType) {  
      case 'sleep_duration':  
        return {  
          timestamp,  
          data: {  
            value: this.calculateSleepDuration(point)  
          }  
        };  
        
      case 'blood_pressure':  
        return {  
          timestamp,  
          data: {  
            systolic: parseInt(point.systolic || 0),  
            diastolic: parseInt(point.diastolic || 0)  
          }  
        };
        
      case 'steps':  
      case 'flight_climbed':  
        return {  
          timestamp,  
          data: {  
            value: parseInt(point.value || 0)  
          }  
        };  
        
      default:  
        // 浮点数类型  
        return {  
          timestamp,  
          data: {  
            value: parseFloat(point.value || 0)  
          }  
        };  
    }  
  }  
  
  /**  
   * 计算睡眠时长  
   */  
  static calculateSleepDuration(sleepData) {  
    if (sleepData.startTime && sleepData.endTime) {  
      const duration = sleepData.endTime - sleepData.startTime;  
      return BigInt(duration);  
    } else if (sleepData.value) {  
      return BigInt(sleepData.value);  
    }  
    return BigInt(0);  
  }  
  
  /**  
   * 验证数据格式  
   */  
  static validateHealthData(healthData) {  
    const errors = [];  
      
    Object.keys(healthData).forEach(dataType => {  
      const dataPoints = healthData[dataType];  
        
      if (!Array.isArray(dataPoints)) {  
        errors.push(`${dataType}: 数据格式错误，应为数组`);  
        return;  
      }  
        
      dataPoints.forEach((point, index) => {  
        if (!point.timestamp || !point.data) {  
          errors.push(`${dataType}[${index}]: 缺少必要字段`);  
        }  
          
        if (dataType === 'sleep_duration' && point.data.value < 120000) {  
          errors.push(`${dataType}[${index}]: 睡眠时长过短（少于2小时）`);  
        }  
      });  
    });  
      
    return {  
      isValid: errors.length === 0,  
      errors  
    };  
  }  
}

export const validateHealthData = DataAdapter.validateHealthData;
export default DataAdapter;
