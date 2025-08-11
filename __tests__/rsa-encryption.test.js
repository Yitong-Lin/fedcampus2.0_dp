jest.mock('react-native-rsa-native');
import RSAEncryption from '../src/services/rsa-encryption.js';


describe('RSAEncryption', () => {  
  let keyPair;  
    
  beforeAll(async () => {  
    keyPair = await RSAEncryption.generateKeyPair();  
  });  
  
  test('应该正确加密和解密数据', async () => {  
    const testData = JSON.stringify({  
      steps: [{ timestamp: Date.now(), data: { value: 5000 } }]  
    });  
      
    const encrypted = await RSAEncryption.encrypt(testData, keyPair.publicKey);  
    const decrypted = await RSAEncryption.decrypt(encrypted, keyPair.privateKey);  
      
    expect(decrypted).toBe(testData);  
  });  
});
