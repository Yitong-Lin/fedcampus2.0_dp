// jest.setup.js

// Mock react-native-rsa-native（匹配：import { RSA } from 'react-native-rsa-native'）
jest.mock('react-native-rsa-native', () => ({
    __esModule: true,
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
}));

// Mock react-native 的 Platform 和 NativeModules
jest.mock('react-native', () => {
    return {
        Platform: { OS: 'ios' }, // 需要改成 android 时，改这里
        NativeModules: {
            HealthDataModule: {
                getData: jest.fn(async () => []),
                requestPermissions: jest.fn(async () => true),
            },
        },
    };
});

global.fetch = jest.fn(async (url, options) => ({
    ok: true,
    status: 200,
    json: async () => ({ ok: true, url, options }),
}));
