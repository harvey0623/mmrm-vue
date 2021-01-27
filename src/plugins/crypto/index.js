import CryptoJS from 'crypto-js';
const aes_key = process.env.VUE_APP_AESKEY;

export const crypto = {
   wm_aes(input) {
      let keyHash = CryptoJS.SHA384(aes_key);
      let key = CryptoJS.enc.Hex.parse(keyHash.toString().substring(0, 64));
      let iv = CryptoJS.enc.Hex.parse(keyHash.toString().substring(64, 96));
      let encrypted = CryptoJS.AES.encrypt(input, key, { iv: iv });
      return encrypted.toString();
   }
}