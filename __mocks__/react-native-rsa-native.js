// __mocks__/react-native-rsa-native.js
module.exports = {
  __esModule: true,
  // 关键：导出 { RSA: { ... } }，以匹配 import { RSA } from 'react-native-rsa-native'
  RSA: {
    generateKeys: jest.fn(async (bits = 2048) => ({
      public: '-----BEGIN PUBLIC KEY-----MOCK-----END PUBLIC KEY-----',
      private: '-----BEGIN PRIVATE KEY-----MOCK-----END PRIVATE KEY-----',
    })),
    encrypt: jest.fn(async (plain /*, publicKey */) => `enc(${plain})`),
    decrypt: jest.fn(async (cipher /*, privateKey */) =>
        String(cipher).replace(/^enc\(/, '').replace(/\)$/, '')
    ),
  },
};
