import { Sign } from './OXO'
import {
  DefaultHost,
  Epoch,
  GenesisHash,
  ActionCode,
  DefaultDivision,
  GroupRequestActionCode,
  GroupManageActionCode,
  GroupMemberShip,
  ObjectType,
  SessionType
} from './Const'

export default class MessageGenerator {

  constructor(public_key, private_key) {
    this.PublicKey = public_key
    this.PrivateKey = private_key
  }

  signJson(json) {
    let sig = Sign(JSON.stringify(json), this.PrivateKey)
    json.Signature = sig
    return json
  }

  genQrcode(server) {
    let json = {
      "Relay": server,
      "Timestamp": new Date().getTime(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genDeclare() {
    let json = {
      "Action": ActionCode.Declare,
      "Timestamp": new Date().getTime(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinRandom() {
    let json = {
      "Action": ActionCode.BulletinRandom,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinRequest(address, sequence, to) {
    let json = {
      "Action": ActionCode.BulletinRequest,
      "Address": address,
      "Sequence": sequence,
      "To": to,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genObjectResponse(object, to) {
    let json = {
      "Action": ActionCode.ObjectResponse,
      "Object": object,
      "To": to,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey,
    }
    return JSON.stringify(this.signJson(json))
  }

  // not a message
  genBulletinJson(sequence, pre_hash, quote, content, timestamp) {
    let json = {
      "ObjectType": ObjectType.Bulletin,
      "Sequence": sequence,
      "PreHash": pre_hash,
      "Quote": quote,
      "Content": content,
      "Timestamp": timestamp,
      "PublicKey": this.PublicKey
    }
    return this.signJson(json)
  }

  //Chat
  genFriendECDHRequest(division, sequence, ecdh_pk, pair, address, timestamp) {
    let json = {
      "Action": ActionCode.ChatDH,
      "Division": division,
      "Sequence": sequence,
      "DHPublicKey": ecdh_pk,
      "Pair": pair,
      "To": address,
      "Timestamp": timestamp,
      "PublicKey": this.PublicKey
    }
    console.log(json)
    return JSON.stringify(this.signJson(json))
  }

  genFriendSync(current_sequence, sour_address) {
    let json = {
      "Action": ActionCode.ChatSync,
      "CurrentSequence": current_sequence,
      "To": sour_address,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey,
    }
    console.log(json)
    return JSON.stringify(this.signJson(json))
  }

  genFriendMessage(sequence, pre_hash, pair_hash, content, dest_address, timestamp) {
    let json = {
      "Action": ActionCode.ChatMessage,
      "Sequence": sequence,
      "PreHash": pre_hash,
      "PairHash": pair_hash,
      "Content": content,
      "To": dest_address,
      "Timestamp": timestamp,
      "PublicKey": this.PublicKey,
    }
    console.log(json)
    return JSON.stringify(this.signJson(json))
  }

}