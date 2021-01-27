import { crypto } from './config.js';
export const webCrypto = {
   encodeUserInfo(payload) {
      let text = JSON.stringify(payload);
      let aes = crypto.encodeAes(text);
      return crypto.encodeBase64(aes);
   },
   decodeUserInfo(text) {
      let aes = crypto.decodeBase64(text);
      let decodeText = crypto.decodeAes(aes);
      return JSON.parse(decodeText);
   }
}