import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private publicKey: crypto.KeyObject;
  private privateKey: crypto.KeyObject;

  constructor(private configService: ConfigService) {
    //Load value from .env
    const rawPublicKey = this.configService.get<string>('PUBLIC_KEY');
    const rawPrivateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!rawPublicKey || !rawPrivateKey) {
      throw new Error('PUBLIC_KEY or PRIVATE_KEY is not defined in the .env file.');
    }

    try {
      this.publicKey = crypto.createPublicKey(rawPublicKey);
      this.privateKey = crypto.createPrivateKey(rawPrivateKey);
    } catch (error) {
      console.error('Failed to parse RSA keys. Please check the key format in .env file.', error);
      throw new InternalServerErrorException('Invalid key format');
    }
  }

  encrypt(payload: string): { data1: string; data2: string } {
    try {
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      let encryptedPayload = cipher.update(payload, 'utf8', 'base64');
      encryptedPayload += cipher.final('base64');

      const EncryptKey = crypto.privateEncrypt(
        {
          key: this.privateKey,
        },
        aesKey,
      ); // EncryptAES_Key with privateKey

      const data1 = EncryptKey.toString('base64');
      const data2 = Buffer.concat([iv, Buffer.from(encryptedPayload, 'base64')]).toString('base64');
      return { data1, data2 };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new InternalServerErrorException('Data encryption failed');
    }
  }

  decrypt(data1: string, data2: string): { payload: string } {
    try {
      const EncryptKey = Buffer.from(data1, 'base64');
      const aesKey = crypto.publicDecrypt(
        {
          key: this.publicKey,
        },
        EncryptKey,
      ); // DecryptAES_Key with publicKey

      const combinedData = Buffer.from(data2, 'base64');
      const iv = combinedData.subarray(0, 16);
      const encryptedPayload = combinedData.subarray(16);

      const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
      let decryptedPayload = decipher.update(encryptedPayload.toString('base64'), 'base64', 'utf8');
      decryptedPayload += decipher.final('utf8');
      return { payload: decryptedPayload };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new InternalServerErrorException('Data decryption failed');
    }
  }
}