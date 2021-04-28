const CryptoJS = require("crypto-js");
const { v4: uuid } = require("uuid");
const IV_LENGTH = 16;

class Crypto {
  static PW;
  static IV = Crypto.generateIV();

  static decrypt(encryptedText, pw, iv) {
    if (!pw || pw.length == 0) {
      throw new Error("Please supply a password!");
    } else if (!iv || iv.length == 0) {
      iv = Crypto.generateIV();
    }

    console.log("Original: " + encryptedText);

    const key = CryptoJS.enc.Utf8.parse(pw);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
    if (decrypted.sigBytes === 0) {
      throw new Error("Decryption failed.");
    } else {
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      console.log("Decrypted: " + originalText);
      return originalText;
    }
  }

  static encrypt(clearText, pw, iv) {
    if (!pw || pw.length == 0) {
      throw new Error("Please supply a password!");
    } else if (!iv || iv.length == 0) {
      throw new Error("Please supply an initialization vector!");
    }

    console.log("Original: " + clearText);

    const key = CryptoJS.enc.Utf8.parse(pw);
    const encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: iv });
    const encryptedText = encrypted.toString();
    console.log("Encrypted: " + encryptedText);
    return encryptedText;
  }

  static generateIV() {
    let iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
    console.log("Generated iv: " + iv);
    return iv;
  }

  static appendIV(data) {
    return Crypto.IV.toString() + data;
  }

  static extractIV(data) {
    let ivEnd = Crypto.IV_LENGTH * 2;
    Crypto.IV = Crypto.parseIV(data.slice(0, ivEnd));
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
