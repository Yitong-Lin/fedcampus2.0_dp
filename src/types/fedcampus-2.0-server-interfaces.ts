// 服务器到客户端响应接口  
interface ServerResponse {  
  timestamp: bigint;        // <long> 请求时间  
  pubkey: string;           // <UID> 用户公钥标识  
  data: string;             // <RSA block> RSA加密的统计数据JSON字符串  
}  
  
// RSA解密后的统计数据结构  
interface DecryptedStatisticalData {  
  [dataType: string]: {  
    timestamp: bigint;      // <long>  
    data: GroupStatistics[];  
  };  
}  
  
// 分组统计数据  
interface GroupStatistics {  
  group: GroupType;  
  percent: number;          // <float>  
  samples: number[];        // [<int>, <int>, ...] 根据数据类型可能是int或float  
}  
  
// 分组类型定义  
type GroupType =   
  | 'all'                    // 全部成员  
  | 'male' | 'female'        // 性别分组  
  | 'ug-2025' | 'g-2025' | 'staff' | 'faculty';     // 具体分组  
  
