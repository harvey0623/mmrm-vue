import CryptoJS from 'crypto-js';
const Utf8 = CryptoJS.enc.Utf8;
const Base64 = CryptoJS.enc.Base64;
const Md5 = CryptoJS.MD5;
const Aes = CryptoJS.AES;

export const crypto = {
   encodeMd5(text) {
      return Md5(text).toString();
   },
   encodeUtf8(text) {
      return Utf8.parse(text);
   },
   decodeUft8(text) {
      return Utf8.stringify(text);
   },
   encodeBase64(text) {
      let words = this.encodeUtf8(text);
      return Base64.stringify(words);
   },
   decodeBase64(text) {
      let words = Base64.parse(text);
      return this.decodeUft8(words);
   },
   encodeAes(text) {
      return Aes.encrypt(text, process.env.VUE_APP_AESKEY).toString();
   },
   decodeAes(text) {
      let bytes = Aes.decrypt(text, process.env.VUE_APP_AESKEY);
      return bytes.toString(Utf8);
   },
   encodeAesJson(data) {
      return this.encodeAes(JSON.stringify(data));
   },
   decodeAesJson(text) {
      return JSON.parse(this.decodeAes(text));
   }
}