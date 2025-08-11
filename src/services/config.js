import { Platform } from 'react-native';

const Config = {
  // API 配置
  API: {
    BASE_URL: 'http://10.201.8.66:8000', // 开发环境
    ENDPOINTS: {
      DATA: '/api/data',
      DATA_DP: '/api/data_dp',
      LOGIN: '/api/login',
      REGISTER: '/api/register',
      LOGOUT: '/auth/token/logout/',
      STATISTICS: '/api/avg',
      RANK: '/api/rank',
      STATUS: '/api/status'
    },
    TIMEOUT: 5000
  },

  // 健康数据类型配置
  HEALTH_DATA_TYPES: {
    INTEGER_TYPES: ['steps', 'flight_climbed'],
    LONG_TYPES: ['sleep_duration'],
    FLOAT_TYPES: [
      'distances',
      'active_calories',
      'exercises',
      'heart_rate',
      'stress_level',
      'irregular_rhythm',
      'respiratory_rate'
    ],
    MULTI_VALUE_TYPES: ['blood_pressure']
  },

  // 平台相关配置
  PLATFORM: Platform.OS
};

export default Config;
