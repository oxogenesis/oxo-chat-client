var crypto = require('crypto');
var oxoKeyPairs = require("oxo-keypairs");

//input encode:'utf-8', 'ascii', 'binary'
//output encode:'hex', 'binary', 'base64'
var encrypt = function(key, iv, data) {
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  var crypted = cipher.update(data, 'utf8', 'base64');
  crypted += cipher.final('base64');
  return crypted;
};

var decrypt = function(key, iv, crypted) {
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  var decoded = decipher.update(crypted, 'base64', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
};

function hasherSHA512(str) {
  let sha512 = crypto.createHash("sha512");
  sha512.update(str);
  return sha512.digest('hex');
}

function halfSHA512(str) {
  return hasherSHA512(str).toUpperCase().substr(0, 64);
}

function strToHex(str) {
  let arr = [];
  let length = str.length;
  for (let i = 0; i < length; i++) {
    arr[i] = (str.charCodeAt(i).toString(16));
  }
  return arr.join('').toUpperCase();
}

function sign(msg, sk) {
  let msgHexStr = strToHex(msg);
  let sig = oxoKeyPairs.sign(msgHexStr, sk);
  return sig;
}

function verifySignature(msg, sig, pk) {
  let hexStrMsg = strToHex(msg);
  try {
    return oxoKeyPairs.verify(hexStrMsg, sig, pk);
  } catch (e) {
    return false;
  }
}

//1000*60*60*24=86400000
const Epoch = Date.parse('2011-11-11 11:11:11')

function DHSequence(division, timestamp, address1, address2) {
  let tmpStr = ''
  if (address1 > address2) {
    tmpStr = address1 + address2
  } else {
    tmpStr = address2 + address1
  }
  let tmpInt = parseInt(halfSHA512(tmpStr).substring(0, 5), 16)
  let cursor = (tmpInt % 86400) * 1000
  let seq = parseInt((timestamp - (Epoch + cursor)) / (86400000 / division))
  return seq
}

export {
  encrypt,
  decrypt,
  halfSHA512,
  sign,
  verifySignature,
  Epoch,
  DHSequence
}
