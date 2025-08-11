// TypeScript接口定义  
interface FedCampusRequest {  
  timestamp: number;  
  apiType: number;  
  pubkey: string;  
  data: string; // RSA加密的JSON字符串  
}  
  
interface HealthDataPoint {  
  timestamp: number;  
  data: {  
    value: number | string;  
    [key: string]: any;  
  };  
}  
  
interface ServerResponse {  
  timestamp: number;  
  pubkey: string;  
  data: string; // RSA加密的统计数据  
}

// 服务器返回的统计数据结构  
interface StatisticalDataResponse {  
  [dataType: string]: {  
    timestamp: number;  
    data: GroupStatistics[];  
  };  
}  
  
interface GroupStatistics {  
  group: 'all' | 'male' | 'female' | 'ug-2025' | 'g-2025' | 'staff' | 'faculty';  
  percent: number;  
  samples: number[];  
}  
  
// RSA解密后的数据结构  
interface DecryptedHealthData {  
  [dataType: string]: HealthDataPoint[];  
}  
  
// 数据类型定义  
type HealthDataValue = number | string; // steps: int, sleep_duration: long, climb: int, 其余: float
