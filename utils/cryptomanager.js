const CryptoJS = require("crypto-js");

const IV_LENGTH = 16;
var PASSWORD;
var IV;

function decrypt(encryptedText, password, iv) {
  console.log("Original: " + encryptedText);

  const key = CryptoJS.enc.Utf8.parse(password);
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
  if (decrypted.sigBytes === 0) {
    console.log("Decryption failed.");
  } else {
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted: " + originalText);
    return originalText;
  }
}

function encrypt(clearText, password, iv) {
  console.log("Original: " + clearText);

  const key = CryptoJS.enc.Utf8.parse(password);
  const encrypted = CryptoJS.AES.encrypt(clearText, key, { iv: iv });
  const encryptedText = encrypted.toString();
  console.log("Encrypted: " + encryptedText);
  return encryptedText;
}

function generateIV() {
  let iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
  console.log("Generated iv: " + iv);
  return iv;
}

function parseIV(iv) {
  let parsedIV = CryptoJS.enc.Hex.parse(iv);
  console.log("Parsed iv: " + parsedIV.toString());
  return parsedIV;
}

module.exports = {
  decrypt,
  encrypt,
  generateIV,
  parseIV,
  IV,
  IV_LENGTH,
  PASSWORD,
};
