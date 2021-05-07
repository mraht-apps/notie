const CryptoJS = require("crypto-js");
const { v4: uuid } = require("uuid");

class Crypto {
  static IV_LENGTH = 16;
  static IV;

  static decrypt(encryptedText, pw, iv) {
    if (!pw || pw.length == 0) {
      throw new Error("Please supply a password!");
    } else if (!iv || iv.length == 0) {
      throw new Error("IV hasn't been extracted: Possibly invalid encrypted file!");
    }

    const key = CryptoJS.enc.Utf8.parse(pw);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
    if (decrypted.sigBytes === 0) {
      throw new Error("Decryption failed.");
    } else {
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      return originalText;
    }
  }

  static encrypt(clearText, pw) {
    if (!pw || pw.length == 0) {
      throw new Error("Please supply a password!");
    }

    Crypto.IV = Crypto.generateIV();

    const key = CryptoJS.enc.Utf8.parse(pw);
    const encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: Crypto.IV });
    const encryptedText = encrypted.toString();
    return encryptedText;
  }

  static generateIV() {
    let iv = CryptoJS.lib.WordArray.random(Crypto.IV_LENGTH);
    console.log("Generated IV: " + iv);
    return iv;
  }

  static appendIV(data) {
    return Crypto.IV.toString() + data;
  }

  static extractIV(data) {
    let ivEnd = Crypto.IV_LENGTH * 2;
    Crypto.IV = Crypto.parseIV(data.slice(0, ivEnd));
    console.log("Extracted IV: " + Crypto.IV);
    return data.slice(ivEnd, data.length);
  }

  static generateUUID(length) {
    return length && length > 0 ? uuid().slice(-length) : uuid();
  }

  static parseIV(iv) {
    let parsedIV = CryptoJS.enc.Hex.parse(iv);
    return parsedIV;
  }
}

module.exports = Crypto;
