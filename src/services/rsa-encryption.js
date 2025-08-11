// src/services/rsa-encryption.js
import { RSA } from 'react-native-rsa-native';

// 只在 DEBUG_FEDCAMPUS=1 时打印
const log = (...args) => {
  if (process.env.DEBUG_FEDCAMPUS === '1') console.log(...args);
};

class RSAEncryption {
  static async encrypt(data, publicKey) {
    log('\n[RSAEncryption] 加密开始');
    log('📥 明文:', typeof data === 'string' ? data : JSON.stringify(data));
    log('🔑 公钥(省略显示):', publicKey?.slice(0, 30) + '...');

    try {
      const encrypted = await RSA.encrypt(data, publicKey);
      log('🔒 加密结果:', encrypted);
      return encrypted;
    } catch (error) {
      console.error('❌ RSA加密失败:', error);
      throw new Error(`RSA加密失败: ${error.message}`);
    }
  }

  static async decrypt(encryptedData, privateKey) {
    log('\n[RSAEncryption] 解密开始');
    log('📥 密文:', String(encryptedData).slice(0, 60) + '...');
    log('🔑 私钥(省略显示):', privateKey?.slice(0, 30) + '...');

    try {
      const decrypted = await RSA.decrypt(encryptedData, privateKey);
      log('🔓 解密结果:', decrypted);
      return decrypted;
    } catch (error) {
      console.error('❌ RSA解密失败:', error);
      throw new Error(`RSA解密失败: ${error.message}`);
    }
  }

  static async generateKeyPair(keySize = 2048) {
    log('\n[RSAEncryption] 生成密钥对:', keySize);
    try {
      const keys = await RSA.generateKeys(keySize);
      log('✅ 密钥对生成成功(省略显示)');
      return { publicKey: keys.public, privateKey: keys.private };
    } catch (error) {
      console.error('❌ 生成RSA密钥对失败:', error);
      throw new Error(`生成RSA密钥对失败: ${error.message}`);
    }
  }
}

export default RSAEncryption;
