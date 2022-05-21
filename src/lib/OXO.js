import '../../shim.js'
import crypto from 'crypto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { set } from 'immutable'
import { Epoch } from './Const'

const oxoKeyPairs = require("oxo-keypairs")

function strToHex(str) {
  let arr = []
  let length = str.length
  for (let i = 0; i < length; i++) {
    arr[i] = (str.charCodeAt(i).toString(16))
  }
  return arr.join('').toUpperCase()
}

//input encode:'utf-8', 'ascii', 'binary'
//output encode:'hex', 'binary', 'base64'
var encrypt = function (key, iv, data) {
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  var crypted = cipher.update(data, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

var decrypt = function (key, iv, crypted) {
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  var decoded = decipher.update(crypted, 'base64', 'utf8')
  decoded += decipher.final('utf8')
  return decoded
}

function hasherSHA512(str) {
  let sha512 = crypto.createHash("sha512")
  sha512.update(str)
  return sha512.digest('hex')
}

function halfSHA512(str) {
  return hasherSHA512(str).toUpperCase().substr(0, 64)
}

function quarterSHA512(str) {
  return hasherSHA512(str).toUpperCase().substr(0, 32)
}

function AesEncrypt(content, aes_key) {
  let key = aes_key.slice(0, 32)
  let iv = aes_key.slice(32, 48)

  let str = encrypt(key, iv, content)
  return str
}

function AesDecrypt(str, aes_key) {
  let key = aes_key.slice(0, 32)
  let iv = aes_key.slice(32, 48)
  let content = decrypt(key, iv, str)
  return content
}

async function MasterKeySet(masterKey) {
  let salt = crypto.randomBytes(16).toString('hex')
  let key = halfSHA512(salt + masterKey).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let info = { "MasterKey": masterKey }
  let crypted = encrypt(key, iv, JSON.stringify(info))
  let save = { "salt": salt, "iv": iv, "ct": crypted }
  try {
    await AsyncStorage.setItem('<#MasterKey#>', JSON.stringify(save))
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function MasterKeyDerive(masterKey) {
  try {
    const result = await AsyncStorage.getItem('<#MasterKey#>')
    let json = JSON.parse(result)
    let key = halfSHA512(json.salt + masterKey).toString('hex').slice(0, 32)
    let mk = decrypt(key, json.iv, json.ct)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function AvatarCreateNew(name, password) {
  let seed = oxoKeyPairs.generateSeed(password, 'secp256k1')
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = halfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
    }
    avatarList.push({ Name: name, Address: address, save: JSON.stringify(save) })
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function AvatarCreateWithSeed(name, seed, password) {
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = halfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
    }
    avatarList.push({ Name: name, Address: address, save: JSON.stringify(save) })
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function AvatarNameEdit(name, seed, password) {
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = halfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
      let tmp = []
      avatarList.forEach(avatar => {
        if (avatar.Address != address) {
          tmp.push(avatar)
        }
      })
      avatarList = tmp
    }
    avatarList.push({ Name: name, Address: address, save: JSON.stringify(save) })
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function AvatarDerive(strSave, masterKey) {
  try {
    let jsonSave = JSON.parse(strSave)
    let key = halfSHA512(jsonSave.salt + masterKey).toString('hex').slice(0, 32)
    strSave = decrypt(key, jsonSave.iv, jsonSave.ct)
    let seed = JSON.parse(strSave).seed
    return seed
  } catch (e) {
    console.log(e)
    return false
  }
}

function ParseQrcodeAddress(qrcode) {
  try {
    let json = JSON.parse(qrcode)
    let address = oxoKeyPairs.deriveAddress(json.PublicKey)
    return { Relay: json.Relay, Address: address }
  } catch (e) {
    console.log(e)
    return false
  }
}

function ParseQrcodeSeed(qrcode) {
  try {
    let json = JSON.parse(qrcode)
    let keypair = oxoKeyPairs.deriveKeypair(json.Seed)
    return { Name: json.Name, Seed: json.Seed }
  } catch (e) {
    console.log(e)
    return false
  }
}

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

function Sign(msg, sk) {
  let msgHexStr = strToHex(msg)
  let sig = oxoKeyPairs.sign(msgHexStr, sk)
  return sig
}

function verifySignature(msg, sig, pk) {
  let hexStrMsg = strToHex(msg)
  try {
    return oxoKeyPairs.verify(hexStrMsg, sig, pk)
  } catch (e) {
    return false
  }
}

function VerifyJsonSignature(json) {
  let sig = json["Signature"]
  delete json["Signature"]
  let tmpMsg = JSON.stringify(json)
  if (verifySignature(tmpMsg, sig, json.PublicKey)) {
    json["Signature"] = sig
    return true
  } else {
    console.log('signature invalid...')
    return false
  }
}

function DeriveAddress(publicKey) {
  return oxoKeyPairs.deriveAddress(publicKey)
}

function DeriveKeypair(seed) {
  return oxoKeyPairs.deriveKeypair(seed)
}

export {
  strToHex,
  halfSHA512,
  quarterSHA512,
  encrypt,
  decrypt,
  DeriveAddress,
  DeriveKeypair,
  Sign,
  VerifyJsonSignature,
  AesEncrypt,
  AesDecrypt,
  MasterKeySet,
  MasterKeyDerive,
  AvatarCreateNew,
  AvatarCreateWithSeed,
  AvatarDerive,
  AvatarNameEdit,
  ParseQrcodeAddress,
  ParseQrcodeSeed,
  DHSequence
}