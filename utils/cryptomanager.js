const CryptoJS = require("crypto-js");

var password = "";

function decrypt(ciphertext, password) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function encrypt(text, password) {
  return CryptoJS.AES.encrypt(text, password).toString();
}

module.exports = {
  decrypt,
  encrypt,
  password,
};
