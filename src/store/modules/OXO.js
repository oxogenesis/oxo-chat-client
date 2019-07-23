import { encrypt, decrypt, halfSHA512, sign, verifySignature, DHSequence, Epoch } from '../../utils/oxo.js'
import { checkJsonSchema, checkBulletinSchema } from '../../utils/json_schema.js'

const crypto = require("crypto")
const oxoKeyPairs = require("oxo-keypairs")
const fs = window.require('fs')
const sqlite3 = window.require('sqlite3')

//in memory of the creator of this project
const GenesisHash = halfSHA512('obeTvR9XDbUwquA6JPQhmbgaCCaiFa2rvf')
const SelfName = 'Me'

const DefaultHost = 'ws://127.0.0.1:8888'

const state = {
  //self
  Seed: '',
  Address: '',
  PublicKey: '',
  PrivateKey: '',
  Contacts: {},
  ContactsArray: [],
  Friends: [],
  Follows: [],

  //chat
  ChatSessions: [],
  CurrentChatSession: '',
  CurrentChatKeySequence: 0,
  CurrentChatKey: '',
  CurrentMessageSequence: 0,
  CurrentMessageHash: GenesisHash,
  Messages: [],

  //bulletin board => BB
  //all => *
  //me  => #
  BBSession: [],
  CurrentBBSession: '',
  CurrentBulletinSequence: 0,
  CurrentBulletinHash: GenesisHash,
  Bulletins: [],
  Quotes: [],
  DisplayQuotes: [],

  //constant
  ActionCode: {
    "Declare": 200,
    "Bulletin": 201,
    "BulletinRequest": 202,
    "BulletinResponse": 203,
    "DHPublicKey": 204,
    "ChatMessage": 205,
    "ChatSync": 206
  },
  DefaultDivision: 3,

  //util
  Init: true,
  DB: null,
  WSJob: null,
  WS: null,
  WSState: WebSocket.CLOSED,
  msgList: [],
  MessageQueue: [],

  //setting
  Hosts: [],
  CurrentHost: ''
}

function DelayExec(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

function Array2Str(array) {
  let tmpArray = []
  for (let i = array.length - 1; i >= 0; i--) {
    tmpArray.push(`'${array[i]}'`)
  }
  return tmpArray.join(',')
}

function GenBulletinRequest(address, sequence, to) {
  let json = {
    "Action": state.ActionCode.BulletinRequest,
    "Address": address,
    "Sequence": sequence,
    "To": to,
    "Timestamp": Date.now(),
    "PublicKey": state.PublicKey
  }
  let sig = sign(JSON.stringify(json), state.PrivateKey)
  json.Signature = sig
  let strJson = JSON.stringify(json)
  return strJson
}

function SyncFollowBulletin(follow) {
  let SQL = `SELECT * FROM BULLETINS WHERE address = "${follow}" ORDER BY sequence DESC`
  state.DB.get(SQL, (err, item) => {
    if (err) {
      console.log(err)
    } else {
      let sequence = 1
      if (item != null) {
        sequence = item.sequence + 1
      }
      let strJson = GenBulletinRequest(follow, sequence, follow)
      state.WS.send(strJson)
    }
  })
}

function SaveChatMessage(sour_address, json) {
  let division = state.DefaultDivision
  let sequence = DHSequence(division, json.Timestamp, state.Address, sour_address)

  //fetch chatkey(aeskey) to decrypt content
  let SQL = `SELECT * FROM ECDHS WHERE address = "${sour_address}" AND division = "${division}" AND sequence = ${sequence}`
  state.DB.get(SQL, (err, item) => {
    if (err) {
      console.log(err)
    } else {
      if (item == null && item.aes_key == null) {
        console.log('chatkey not exist...')
        return
      }

      //decrypt content
      let key = item.aes_key.slice(0, 32)
      let iv = item.aes_key.slice(32, 48)
      let content = decrypt(key, iv, json.Content)

      let strJson = JSON.stringify(json)
      let hash = halfSHA512(strJson)
      let created_at = Date.now()

      let readed = false
      if (sour_address == state.CurrentChatSession) {
        readed = true
      }
      //save message
      let SQL = `INSERT INTO MESSAGES (sour_address, sequence, pre_hash, content, timestamp, json, hash, created_at, readed)
                VALUES ('${sour_address}', ${json.Sequence}, '${json.PreHash}', '${content}', '${json.Timestamp}', '${strJson}', '${hash}', '${created_at}', ${readed})`

      state.DB.run(SQL, err => {
        if (err) {
          console.log(err)
        } else {
          if (state.CurrentChatSession == sour_address) {
            //CurrentChatSession: show message
            state.Messages.push({ "name": state.Contacts[sour_address], "timestamp": json.Timestamp, "sequence": json.Sequence, "created_at": created_at, "content": content, 'confirmed': false, 'hash': hash })
          } else {
            //not CurrentChatSession: update unread_count
            for (let i = state.ChatSessions.length - 1; i >= 0; i--) {
              if (state.ChatSessions[i].address == sour_address) {
                state.ChatSessions[i].unread_count += 1
              }
            }
          }

          //update db-message(confirmed)
          SQL = `UPDATE MESSAGES SET confirmed = true WHERE dest_address = '${sour_address}' AND hash IN (${Array2Str(json.PairHash)})`
          state.DB.run(SQL, err => {
            if (err) {
              console.log(err)
            } else {
              //update view-message(confirmed)
              for (let i = state.Messages.length - 1; i >= 0; i--) {
                if (state.Messages[i].confirmed == false && json.PairHash.includes(state.Messages[i].hash)) {
                  state.Messages[i].confirmed = true
                }
              }
            }
          })
        }
      })
    }
  })
}

const mutations = {
  InitAccount(state, seed) {
    try {
      state.Seed = seed
      let keypair = oxoKeyPairs.deriveKeypair(seed)
      state.Address = oxoKeyPairs.deriveAddress(keypair.publicKey)
      state.PublicKey = keypair.publicKey
      state.PrivateKey = keypair.privateKey
    } catch (e) {
      console.log(e)
    }
  },
  ResetAccount(state) {
    //setting
    state.Hosts = ''
    state.CurrentHost = ''

    //util
    state.Init = true
    state.DB.close()
    state.DB = null
    state.WS.close()
    state.WS = null
    if (state.WSJob != null) {
      clearInterval(state.WSJob)
    }
    state.WSJob = null

    //self
    state.Seed = ''
    state.Address = ''
    state.PublicKey = ''
    state.PrivateKey = ''
    state.Contacts = {}
    state.ContactsArray = []
    state.Friends = []
    state.Follows = []

    //chat
    state.ChatSessions = []
    state.CurrentChatSession = ''
    state.CurrentChatKeySequence = 0
    state.CurrentChatKey = ''
    state.CurrentMessageSequence = 0
    state.CurrentMessageHash = GenesisHash
    state.Messages = []

    //BB
    state.BBSession = []
    state.CurrentBBSession = ''
    state.CurrentBulletinSequence = 0
    state.CurrentBulletinHash = GenesisHash
    state.Bulletins = []
    state.Quotes = []
    state.DisplayQuotes = []
  },
  AddContact(state, payload) {
    let timestamp = Date.now()
    let address = payload.address
    let name = payload.name
    let SQL = `INSERT INTO CONTACTS (address, name, created_at, updated_at)
        VALUES ('${address}', '${name}', '${timestamp}', '${timestamp}')`
    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        state.Contacts[address] = name
        state.ContactsArray = []
        for (let address in state.Contacts) {
          state.ContactsArray.push({ "address": address, "name": state.Contacts[address] })
        }
      }
    })
  },
  RenameContact(state, payload) {
    let timestamp = Date.now()
    let address = payload.address
    let name = payload.name
    let SQL = `UPDATE CONTACTS SET name = '${name}', updated_at = '${timestamp}' WHERE address = "${address}"`
    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        state.Contacts[address] = name
        state.ContactsArray = []
        for (let address in state.Contacts) {
          state.ContactsArray.push({ "address": address, "name": state.Contacts[address] })
        }
      }
    })
  },
  RemoveContact(state, payload) {
    let address = payload.address
    let SQL = `SELECT * FROM FRIENDS WHERE address = "${address}"`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        if (item != null) {
          return false
        } else {
          SQL = `SELECT * FROM FOLLOWS WHERE address = "${address}"`
          state.DB.get(SQL, (err, item) => {
            if (err) {
              console.log(err)
            } else {
              if (item != null) {
                return false
              } else {
                SQL = `DELETE FROM CONTACTS WHERE address = "${address}"`
                state.DB.run(SQL, err => {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log(state.Contacts)
                    console.log(state.ContactsArray)
                    state.Contacts[address] = null
                    let i = state.ContactsArray.length - 1
                    for (; i >= 0; i--) {
                      if (state.ContactsArray[i].address == address) {
                        break
                      }
                    }
                    if (i != -1) {
                      state.ContactsArray.splice(i, 1)
                    }
                    console.log(state.Contacts)
                    console.log(state.ContactsArray)
                    return true
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  AddFriend(state, address) {
    let timestamp = Date.now()
    let SQL = `INSERT INTO FRIENDS (address, created_at, updated_at)
        VALUES ('${address}', '${timestamp}', '${timestamp}')`

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        state.Friends.push(address)
      }
    })
  },
  RemoveFriend(state, address) {
    let SQL = `DELETE FROM FRIENDS WHERE address = "${address}"`

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        let i = state.Friends.length - 1
        for (; i >= 0; i--) {
          if (state.Friends[i] == address) {
            break
          }
        }
        if (i != -1) {
          state.Friends.splice(i, 1)
        }
      }
    })
  },
  AddFollow(state, address) {
    let timestamp = Date.now()
    let SQL = `INSERT INTO FOLLOWS (address, created_at, updated_at)
        VALUES ('${address}', '${timestamp}', '${timestamp}')`

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        state.Follows.push(address)
      }
    })
  },
  RemoveFollow(state, address) {
    let SQL = `DELETE FROM FOLLOWS WHERE address = "${address}"`

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        let i = state.Follows.length - 1
        for (; i >= 0; i--) {
          if (state.Follows[i] == address) {
            break
          }
        }
        if (i != -1) {
          state.Follows.splice(i, 1)
        }
      }
    })
  },
  LoadDB(state, address) {
    state.DB = new sqlite3.Database(`./db/${address}.db`)
    state.DB.serialize(() => {
      //business
      state.DB.run(`CREATE TABLE IF NOT EXISTS CONTACTS(
        address VARCHAR(35) PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      state.DB.run(`CREATE TABLE IF NOT EXISTS FRIENDS(
        address VARCHAR(35) PRIMARY KEY,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      state.DB.run(`CREATE TABLE IF NOT EXISTS FOLLOWS(
        address VARCHAR(35) PRIMARY KEY,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      state.DB.run(`CREATE TABLE IF NOT EXISTS ECDHS(
        address VARCHAR(35) NOT NULL,
        division INTEGER NOT NULL,
        sequence INTEGER NOT NULL,
        aes_key TEXT,
        private_key TEXT,
        public_key TEXT,
        self_json TEXT,
        pair_json TEXT,
        PRIMARY KEY (address, division, sequence)
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      //timestamp: time that json is sign
      //created_at: time that insert into db
      //confirmed: pair has comfirmed "this message is received and readed"
      //readed: self has read "this message from pair"
      state.DB.run(`CREATE TABLE IF NOT EXISTS MESSAGES(
        hash VARCHAR(32) PRIMARY KEY,
        sour_address VARCHAR(35),
        dest_address VARCHAR(35),
        sequence INTEGER,
        pre_hash VARCHAR(32) NOT NULL,
        content TEXT,
        timestamp INTEGER,
        created_at INTEGER,
        json TEXT,
        confirmed BOOLEAN DEFAULT FALSE,
        readed BOOLEAN DEFAULT FALSE
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      state.DB.run(`CREATE TABLE IF NOT EXISTS BULLETINS(
        hash VARCHAR(32) PRIMARY KEY,
        address VARCHAR(35) NOT NULL,
        sequence INTEGER,
        pre_hash VARCHAR(32) NOT NULL,
        quote_size INTEGER,
        content TEXT,
        timestamp INTEGER,
        created_at INTEGER,
        json TEXT
        )`, err => {
        if (err) {
          console.log(err)
        }
      })

      //setting
      state.DB.run(`CREATE TABLE IF NOT EXISTS HOSTS(
        host TEXT PRIMARY KEY,
        updated_at INTEGER
        )`, err => {
        if (err) {
          console.log(err)
        }
      })
    })

    let SQL = 'SELECT * FROM CONTACTS'
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        for (const item of items) {
          state.Contacts[item.address] = item.name
          state.ContactsArray.push({ "address": item.address, "name": item.name })
        }
      }
    })

    SQL = 'SELECT * FROM FRIENDS'
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        for (const item of items) {
          state.Friends.push(item.address)
        }
      }
    })

    SQL = 'SELECT * FROM FOLLOWS'
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        for (const item of items) {
          state.Follows.push(item.address)
        }
      }
    })
  },
  LoadHost(state) {
    let SQL = 'SELECT * FROM HOSTS ORDER BY updated_at DESC'
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        state.Hosts = []
        if (items.length != 0) {
          state.CurrentHost = items[0].host
          for (let i = items.length - 1; i >= 0; i--) {
            state.Hosts.unshift(items[i].host)
          }
        } else {
          state.CurrentHost = DefaultHost
        }

        if (state.WS != null) {
          if (`${state.CurrentHost}/` == state.WS.url) {
            //do nothing
          } else {
            state.WS.close()
            state.WS = null
          }
        }
      }
    })

  },
  DoConn(state) {
    //ws state:
    //0 (CONNECTING)
    //1 (OPEN)
    //2 (CLOSING)
    //3 (CLOSED)
    if (state.WS == null || state.WS.readyState == WebSocket.CLOSED) {
      //console.log("Connecting...")
      state.WS = new WebSocket(state.CurrentHost)

      state.WS.addEventListener('open', function(event) {
        console.log(state.WS)
        state.WSState = WebSocket.OPEN

        //send declare to server
        let json = {
          "Action": state.ActionCode.Declare,
          "Timestamp": new Date().getTime(),
          "PublicKey": state.PublicKey
        }
        let sig = sign(JSON.stringify(json), state.PrivateKey)
        json.Signature = sig
        state.WS.send(JSON.stringify(json))
      })

      // wait for messages
      state.WS.addEventListener('message', function(event) {
        console.log('Received: ', event.data)
        let json = checkJsonSchema(event.data)
        if (json) {
          //check receiver is me
          if (json.To != state.Address) {
            console.log('receiver is not me...')
            return
          }

          //verify signature
          let sig = json["Signature"]
          delete json["Signature"]
          let tmpMsg = JSON.stringify(json)
          if (!verifySignature(tmpMsg, sig, json.PublicKey)) {
            console.log('signature invalid...')
            return
          }
          json["Signature"] = sig

          if (json.Action == state.ActionCode.DHPublicKey) {
            //check message from my friend
            let address = oxoKeyPairs.deriveAddress(json.PublicKey)
            if (!state.Friends.includes(address)) {
              console.log('message is not from my friend...')
              return
            }

            //check dh(my-sk-pk pair-pk aes-key)
            let SQL = `SELECT * FROM ECDHS WHERE address = "${address}" AND division = "${json.Division}" AND sequence = "${json.Sequence}"`
            state.DB.get(SQL, (err, item) => {
              if (err) {
                console.log(err)
              } else {
                let timestamp = Date.now()
                let aesKey = ''

                if (item == null) {
                  //self not ready, so pair could not be ready
                  //gen my-sk-pk and aes-key
                  let ecdh = crypto.createECDH('secp256k1')
                  let ecdh_pk = ecdh.generateKeys('hex')
                  let ecdh_sk = ecdh.getPrivateKey('hex')
                  aesKey = ecdh.computeSecret(json.DHPublicKey, 'hex', 'hex')

                  //gen message with my-pk, indicate self ready
                  let selfJson = {
                    "Action": state.ActionCode.DHPublicKey,
                    "Division": json.Division,
                    "Sequence": json.Sequence,
                    "DHPublicKey": ecdh_pk,
                    "Pair": json.DHPublicKey,
                    "To": address,
                    "Timestamp": timestamp,
                    "PublicKey": state.PublicKey
                  }
                  let sig = sign(JSON.stringify(selfJson), state.PrivateKey)
                  selfJson.Signature = sig
                  let strSelfJson = JSON.stringify(selfJson)

                  //save my-sk-pk, pair-pk, aes-key, self-not-ready-json
                  SQL = `INSERT INTO ECDHS (address, division, sequence, private_key, public_key, aes_key, self_json)
                  VALUES ('${address}', '${json.Division}', '${json.Sequence}', '${ecdh_sk}', '${json.DHPublicKey}', '${aesKey}', '${strSelfJson}')`

                  state.DB.run(SQL, err => {
                    if (err) {
                      console.log(err)
                    } else {
                      state.WS.send(strSelfJson)
                      //wait for pair to declare ready
                    }
                  })
                } else if (item.pair_json == null) {
                  //item not null => my-sk-pk, self-not-ready-json is exist
                  //gen aes
                  let ecdh = crypto.createECDH('secp256k1')
                  ecdh.setPrivateKey(item.private_key, 'hex')
                  let ecdh_pk = ecdh.getPublicKey('hex')
                  aesKey = ecdh.computeSecret(json.DHPublicKey, 'hex', 'hex')

                  //gen self-ready-json
                  let selfJson = {
                    "Action": state.ActionCode.DHPublicKey,
                    "Division": json.Division,
                    "Sequence": json.Sequence,
                    "DHPublicKey": ecdh_pk,
                    "Pair": json.DHPublicKey,
                    "To": address,
                    "Timestamp": timestamp,
                    "PublicKey": state.PublicKey
                  }
                  let sig = sign(JSON.stringify(selfJson), state.PrivateKey)
                  selfJson.Signature = sig
                  let strSelfJson = JSON.stringify(selfJson)

                  if (json.Pair == "") {
                    //pair not ready
                    //save pair-pk, aes-key, self-ready-json
                    SQL = `UPDATE ECDHS SET public_key = '${json.DHPublicKey}', aes_key = '${aesKey}', self_json = '${strSelfJson}' WHERE address = "${address}" AND division = "${json.Division}" AND sequence = "${json.Sequence}"`
                    state.DB.run(SQL, err => {
                      if (err) {
                        console.log(err)
                      } else {
                        state.WS.send(strSelfJson)
                      }
                    })
                  } else {
                    //pair ready
                    //save pair-pk, aes-key, self-ready-json, pair-ready-json
                    SQL = `UPDATE ECDHS SET public_key = '${json.DHPublicKey}', aes_key = '${aesKey}', self_json = '${strSelfJson}', pair_json = '${JSON.stringify(json)}' WHERE address = "${address}" AND division = "${json.Division}" AND sequence = "${json.Sequence}"`
                    state.DB.run(SQL, err => {
                      if (err) {
                        console.log(err)
                      } else {
                        //not responde
                        state.WS.send(strSelfJson)
                        if (address == state.CurrentChatSession) {
                          state.CurrentChatKeySequence = json.Sequence
                          state.CurrentChatKey = aesKey
                        }
                      }
                    })
                  }
                }
                //else: self and pair are ready, do nothing
                //both ready to talk
              }
            })
          } else if (json.Action == state.ActionCode.ChatMessage) {
            let sour_address = oxoKeyPairs.deriveAddress(json.PublicKey)
            //check message from my friend
            if (!state.Friends.includes(sour_address)) {
              console.log('message is not from my friend...')
              return
            }

            if (json.Sequence == 1) {
              SaveChatMessage(sour_address, json)
            } else {
              //check pre-message
              let SQL = `SELECT * FROM MESSAGES WHERE sour_address = "${sour_address}" AND hash = "${json.PreHash}" AND sequence = ${json.Sequence - 1}`
              state.DB.get(SQL, (err, item) => {
                if (err) {
                  console.log(err)
                } else {
                  if (item == null) {
                    //some message is missing
                    //get last message(biggest sequence)
                    SQL = `SELECT * FROM MESSAGES WHERE sour_address = "${sour_address}" ORDER BY sequence DESC`
                    state.DB.get(SQL, (err, item) => {
                      if (err) {
                        console.log(err)
                      } else {
                        //send ChatSync
                        let currentSequence = 0
                        if (item != null) {
                          currentSequence = item.sequence
                        }
                        let syncJson = {
                          "Action": state.ActionCode.ChatSync,
                          "CurrentSequence": currentSequence,
                          "To": sour_address,
                          "Timestamp": Date.now(),
                          "PublicKey": state.PublicKey,
                        }
                        let sig = sign(JSON.stringify(syncJson), state.PrivateKey)
                        syncJson.Signature = sig
                        let strSyncJson = JSON.stringify(syncJson)
                        state.WS.send(strSyncJson)
                      }
                    })
                  } else {
                    //pre-message exist
                    SaveChatMessage(sour_address, json)
                  }
                }
              })
            }
          } else if (json.Action == state.ActionCode.ChatSync) {
            let sour_address = oxoKeyPairs.deriveAddress(json.PublicKey)
            //check message from my friend
            if (!state.Friends.includes(sour_address)) {
              console.log('message is not from my friend...')
              return
            }

            let SQL = `SELECT * FROM MESSAGES WHERE dest_address = "${sour_address}" AND confirmed = false AND sequence > ${json.CurrentSequence}`
            state.DB.all(SQL, (err, items) => {
              if (err) {
                console.log(err)
              } else {
                let s = 0;
                for (const item of items) {
                  DelayExec(s * 1000).then(() => {
                    state.WS.send(item.json)
                  })
                  s = s + 1
                }
              }
            })
          } else if (json.Action == state.ActionCode.BulletinRequest) {
            console.log(`BulletinRequest`)
            let address = oxoKeyPairs.deriveAddress(json.PublicKey)
            let SQL = `SELECT * FROM BULLETINS WHERE address = "${json.Address}" AND sequence = ${json.Sequence} ORDER BY sequence DESC`
            state.DB.get(SQL, (err, item) => {
              if (err) {
                console.log(err)
              } else {
                let bulletin = {}
                console.log(`item`)
                if (item != null) {
                  console.log(item)
                  bulletin = JSON.parse(item.json)
                }
                let json = {
                  "Action": state.ActionCode.BulletinResponse,
                  "Bulletin": bulletin,
                  "To": address,
                  "Timestamp": Date.now(),
                  "PublicKey": state.PublicKey,
                }
                let sig = sign(JSON.stringify(json), state.PrivateKey)
                json.Signature = sig
                let strJson = JSON.stringify(json)
                state.WS.send(strJson)
              }
            })
          } else if (json.Action == state.ActionCode.BulletinResponse) {
            //console.log(json)
            json = json.Bulletin
            //console.log(json)
            if (checkBulletinSchema(json)) {
              let address = oxoKeyPairs.deriveAddress(json.PublicKey)
              let strJson = JSON.stringify(json)
              let hash = halfSHA512(strJson)

              sig = json["Signature"]
              delete json["Signature"]
              tmpMsg = JSON.stringify(json)
              if (!verifySignature(tmpMsg, sig, json.PublicKey)) {
                console.log('signature invalid...')
                return
              }

              if (state.Follows.includes(address)) {
                //bulletin from follow
                let timestamp = Date.now()
                //save bulletin
                let SQL = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size)
                  VALUES ('${address}', ${json.Sequence}, '${json.PreHash}', '${json.Content}', '${json.Timestamp}', '${strJson}', '${timestamp}', '${hash}', ${json.Quote.length})`
                state.DB.run(SQL, err => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (state.CurrentBBSession == "*" || state.CurrentBBSession == address) {
                      state.Bulletins.unshift({ "address": address, "name": state.Contacts[address], "timestamp": json.Timestamp, "created_at": timestamp, 'sequence': json.Sequence, "content": json.Content, 'hash': hash, 'quote_size': json.Quote.length })
                    }
                    let strJson = GenBulletinRequest(address, json.Sequence + 1, address)
                    state.WS.send(strJson)
                  }
                })
              } else if (state.DisplayQuotes.filter(q => q.hash === hash).length == 1) {
                //bulletin from quote
                let timestamp = Date.now()
                //save bulletin
                let SQL = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size)
                  VALUES ('${address}', ${json.Sequence}, '${json.PreHash}', '${json.Content}', '${json.Timestamp}', '${strJson}', '${timestamp}', '${hash}', ${json.Quote.length})`
                state.DB.run(SQL, err => {
                  if (err) {
                    console.log(err)
                  } else {
                    for (let i = state.DisplayQuotes.length - 1; i >= 0; i--) {
                      if (hash == state.DisplayQuotes[i].hash) {
                        state.DisplayQuotes[i].timestamp = json.Timestamp
                        state.DisplayQuotes[i].created_at = timestamp
                        state.DisplayQuotes[i].content = json.Content
                        state.DisplayQuotes[i].quote_size = json.Quote.length
                      }
                    }
                  }
                })
              }
            }
          }
        } else {
          console.log("json schema invalid...")
          return
        }
      })

      state.WS.addEventListener('close', function(event) {
        state.WSState = WebSocket.CLOSED
      })
    }
  },
  DoSend(state, message) {
    if (state.WS != null && state.WS.readyState == WebSocket.OPEN) {
      console.log("Send: " + message)
      state.WS.send(message)
    } else {
      state.MessageQueue.push(message)
    }
  },
  //chat
  LoadChatSession(state) {
    state.ChatSessions = []
    for (let i = state.Friends.length - 1; i >= 0; i--) {
      let address = state.Friends[i]
      let SQL = `SELECT * FROM MESSAGES WHERE sour_address = '${address}' AND readed = false`
      state.DB.all(SQL, (err, items) => {
        if (err) {
          console.log(err)
        } else {
          state.ChatSessions.push({ 'address': address, 'name': state.Contacts[address], 'unread_count': items.length })
        }
      })
    }
  },
  SwitchChatSession(state, address) {
    state.CurrentChatSession = address
    state.Messages = []
    // mark current session's pair_message(in) as read
    let SQL = `UPDATE MESSAGES SET readed = true WHERE sour_address = "${address}"`
    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        for (let i = state.ChatSessions.length - 1; i >= 0; i--) {
          if (state.ChatSessions[i].address == address) {
            state.ChatSessions[i].unread_count = 0
            break
          }
        }
      }
    })

    //get pre_message(out) squenece and hash
    state.CurrentMessageSequence = 0
    state.CurrentMessageHash = GenesisHash
    SQL = `SELECT * FROM MESSAGES WHERE dest_address = "${address}" ORDER BY sequence DESC`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        if (item != null) {
          state.CurrentMessageSequence = item.sequence
          state.CurrentMessageHash = item.hash
        }
      }
    })
  },
  Handshake(state, address) {
    state.CurrentChatKey = ''

    let timestamp = Date.now()
    let division = state.DefaultDivision
    let sequence = DHSequence(division, timestamp, state.Address, address)

    //fetch aes-Key according to (address+division+sequence)
    let SQL = `SELECT * FROM ECDHS WHERE address = "${address}" AND division = "${division}" AND sequence = ${sequence}`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        if (item != null) {
          //console.log(item)
          if (item.aes_key != null) {
            //aes ready
            console.log(`aes ready`)
            state.CurrentChatKeySequence = item.sequence
            state.CurrentChatKey = item.aes_key
            //handsake already done, ready to chat
          } else {
            //my-sk-pk exist, aes not ready
            //send self-not-ready-json
            state.WS.send(item.self_json)
          }
        } else {
          //my-sk-pk not exist
          //gen my-sk-pk
          let ecdh = crypto.createECDH('secp256k1')
          let ecdh_pk = ecdh.generateKeys('hex')
          let ecdh_sk = ecdh.getPrivateKey('hex')

          let json = {
            "Action": state.ActionCode.DHPublicKey,
            "Division": division,
            "Sequence": sequence,
            "DHPublicKey": ecdh_pk,
            "Pair": "",
            "To": address,
            "Timestamp": timestamp,
            "PublicKey": state.PublicKey
          }
          let sig = sign(JSON.stringify(json), state.PrivateKey)
          json.Signature = sig
          let strJson = JSON.stringify(json)

          //save my-sk-pk, self-not-ready-json
          SQL = `INSERT INTO ECDHS (address, division, sequence, private_key, self_json)
              VALUES ('${address}', '${division}', ${sequence}, '${ecdh_sk}', '${strJson}')`

          state.DB.run(SQL, err => {
            if (err) {
              console.log(err)
            } else {
              state.WS.send(strJson)
            }
          })
        }
      }
    })
  },
  LoadMoreMessage(state) {
    let firstMessage = state.Messages[0]
    if (firstMessage == null) {
      return
    }
    let SQL = `SELECT * FROM MESSAGES WHERE (sour_address = '${state.CurrentChatSession}' OR dest_address = '${state.CurrentChatSession}') AND created_at < ${firstMessage.created_at} ORDER BY created_at DESC LIMIT 20`
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        //console.log(items)
        for (const item of items) {
          let name = SelfName
          if (item.sour_address != null) {
            name = state.Contacts[item.sour_address]
          }
          state.Messages.unshift({ 'name': name, 'timestamp': item.timestamp, 'created_at': item.created_at, 'sequence': item.sequence, 'content': item.content, 'confirmed': item.confirmed, 'hash': item.hash })
        }
      }
    })
  },
  //bulletin board => BB
  LoadBBSession(state) {
    state.BBSessions = []
    state.BBSessions.push({ 'address': '*', 'name': 'ALL' })
    state.BBSessions.push({ 'address': '#', 'name': 'ME' })
    for (let i = state.Follows.length - 1; i >= 0; i--) {
      let address = state.Follows[i]
      state.BBSessions.push({ 'address': address, 'name': state.Contacts[address] })
    }
    state.CurrentBBSession = '*'
    //console.log(state.BBSessions)

    //get pre_bulletin squenece and hash
    state.CurrentBulletinSequence = 0
    state.CurrentBulletinHash = GenesisHash
    let SQL = `SELECT * FROM BULLETINS WHERE address = "${state.Address}" ORDER BY sequence DESC`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        if (item != null) {
          state.CurrentBulletinSequence = item.sequence
          state.CurrentBulletinHash = item.hash
        }
      }
    })
  },
  SwitchBBSession(state, address) {
    state.CurrentBBSession = address
    state.Bulletins = []
  },
  AddQuote(state, payload) {
    //console.log(`payload`)
    //console.log(payload)
    for (let i = state.Quotes.length - 1; i >= 0; i--) {
      if (state.Quotes[i].Hash == payload.hash) {
        return
      }
    }
    let newQuote = { "Name": payload.name, "Address": payload.address, "Sequence": payload.sequence, "Hash": payload.hash }
    state.Quotes.unshift(newQuote)
    while (state.Quotes.length > 8) {
      state.Quotes.pop
    }
    //console.log(state.Quotes)
  },
  RemoveQuote(state, payload) {
    let i = state.Quotes.length - 1
    for (; i >= 0; i--) {
      if (state.Quotes[i].Hash == payload.hash) {
        break
      }
    }
    if (i != -1) {
      state.Quotes.splice(i, 1)
    }
  },
  ClearQuotes(state) {
    state.Quotes = []
  },
  LoadQuote(state, payload) {
    console.log(`LoadQuote`)
    state.DisplayQuotes = []
    let SQL = `SELECT * FROM BULLETINS WHERE hash = '${payload.hash}'`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        //console.log(item)
        if (item != null) {
          let json = JSON.parse(item.json)
          for (let i = json.Quote.length - 1; i >= 0; i--) {
            let name = json.Quote[i].Address
            if (json.Quote[i].Address == state.Address) {
              name = SelfName
            } else if (state.Contacts[json.Quote[i].Address] != null) {
              name = state.Contacts[json.Quote[i].Address]
            }
            state.DisplayQuotes.push({ "address": json.Quote[i].Address, "name": name, "timestamp": Epoch, "created_at": Epoch, 'sequence': json.Quote[i].Sequence, "content": '未知', 'hash': json.Quote[i].Hash, 'quote_size': 0 })
          }
          for (let i = state.DisplayQuotes.length - 1; i >= 0; i--) {
            SQL = `SELECT * FROM BULLETINS WHERE hash = '${state.DisplayQuotes[i].hash}'`
            state.DB.get(SQL, (err, item) => {
              if (err) {
                console.log(err)
              } else {
                if (item != null) {
                  //load from local db
                  state.DisplayQuotes[i].timestamp = item.timestamp
                  state.DisplayQuotes[i].created_at = item.created_at
                  state.DisplayQuotes[i].content = item.content
                  state.DisplayQuotes[i].quote_size = item.quote_size
                } else {
                  //fetch from quoter(who shoud have the original bulletin)
                  let strJson = GenBulletinRequest(state.DisplayQuotes[i].address, state.DisplayQuotes[i].sequence, payload.address)
                  state.WS.send(strJson)
                }
              }
            })
          }
        }
      }
    })
  },
  HideQuote(state) {
    state.DisplayQuotes = []
  }
}

const actions = {
  InitDB({ commit }, address) {
    console.log("INIT DB: " + address)
    commit("LoadDB", address)
    commit("LoadHost")
  },
  SetHost({ commit }, payload) {
    let timestamp = Date.now()
    let SQL = `SELECT * FROM HOSTS WHERE host = '${payload.host}'`
    state.DB.get(SQL, (err, item) => {
      if (err) {
        console.log(err)
      } else {
        if (item != null) {
          SQL = `UPDATE HOSTS SET updated_at = '${timestamp}' WHERE host = "${payload.host}"`
          state.DB.run(SQL, err => {
            if (err) {
              console.log(err)
            } else {
              commit("LoadHost")
            }
          })
        } else {
          SQL = `INSERT INTO HOSTS (host, updated_at)
            VALUES ('${payload.host}', ${timestamp})`

          state.DB.run(SQL, err => {
            if (err) {
              console.log(err)
            } else {
              commit("LoadHost")
            }
          })
        }
      }
    })
  },
  RemoveHost({ commit }, payload) {
    let SQL = `DELETE FROM HOSTS WHERE host = "${payload.host}"`

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        commit("LoadHost")
      }
    })
  },
  ToConn({ commit }) {
    console.log("ToConn")
    if (state.WSJob == null) {
      state.WSJob = setInterval(() => {
        commit("DoConn")
      }, 3000)
    }
  },
  ToSend({ commit }, message) {
    commit("DoSend", message)
  },
  //chat
  SwitchChatSession({ commit }, payload) {
    //console.log("SwitchChatSession")
    //console.log(payload)
    commit('SwitchChatSession', payload)
    commit('Handshake', payload)
  },
  LoadChats({ commit }, payload) {
    commit('LoadChatSession')

    if (state.Friends.includes(payload.address)) {
      commit('SwitchChatSession', payload.address)
      commit('Handshake', payload.address)
    } else {
      let SQL = `SELECT * FROM MESSAGES WHERE sour_address != NULL AND readed = false ORDER BY created_at ASC`
      state.DB.get(SQL, (err, item) => {
        if (err) {
          console.log(err)
        } else {
          //console.log(item)
          if (item != null) {
            //oldest unread message => load this session
            commit('SwitchChatSession', item.sour_address)
            commit('Handshake', item.sour_address)
          } else if (state.ChatSessions.length != 0) {
            //no unread message
            let address = state.ChatSessions[0].address
            commit('SwitchChatSession', address)
            commit('Handshake', address)
          }
        }
      })
    }
  },
  DeliverMessage({ commit }, payload) {
    //compose message
    let key = payload.chatKey.slice(0, 32)
    let iv = payload.chatKey.slice(32, 48)

    //get pair message not confirmed
    let SQL = `SELECT * FROM MESSAGES WHERE sour_address = '${state.CurrentChatSession}' AND confirmed = false ORDER BY sequence ASC LIMIT 8`
    state.DB.all(SQL, (err, items) => {
      if (err) {
        console.log(err)
      } else {
        let pairHash = []
        for (let i = items.length - 1; i >= 0; i--) {
          pairHash.push(items[i].hash)
        }

        let json = {
          "Action": state.ActionCode.ChatMessage,
          "Sequence": state.CurrentMessageSequence + 1,
          "PreHash": state.CurrentMessageHash,
          "PairHash": pairHash,
          "Content": encrypt(key, iv, payload.content),
          "To": payload.address,
          "Timestamp": payload.timestamp,
          "PublicKey": state.PublicKey
        }
        let sig = sign(JSON.stringify(json), state.PrivateKey)
        json.Signature = sig
        //console.log(json)
        let strJson = JSON.stringify(json)
        let hash = halfSHA512(strJson)

        //save message
        SQL = `INSERT INTO MESSAGES (dest_address, sequence, pre_hash, content, timestamp, json, created_at, hash)
          VALUES ('${payload.address}', ${state.CurrentMessageSequence + 1}, '${state.CurrentMessageHash}', '${payload.content}', '${payload.timestamp}', '${strJson}', '${payload.timestamp}', '${hash}')`

        state.DB.run(SQL, err => {
          if (err) {
            console.log(err)
          } else {
            state.WS.send(strJson)
            state.Messages.push({ "name": SelfName, "timestamp": payload.timestamp, "created_at": payload.timestamp, 'sequence': state.CurrentMessageSequence + 1, "content": payload.content, 'confirmed': false, 'hash': hash })
            state.CurrentMessageSequence += 1
            state.CurrentMessageHash = hash

            SQL = `UPDATE MESSAGES SET confirmed = true WHERE sour_address = '${payload.address}' AND hash IN (${Array2Str(pairHash)})`
            //console.log(SQL)
            state.DB.run(SQL, err => {
              if (err) {
                console.log(err)
              } else {
                for (let i = state.Messages.length - 1; i >= 0; i--) {
                  if (pairHash.includes(state.Messages[i].hash)) {
                    state.Messages[i].confirmed = true
                  }
                }
              }
            })
          }
        })
      }
    })
  },
  //bulletin board => BB
  LoadBBs({ commit }, payload) {
    commit('LoadBBSession')
    //commit('FetchBulletin')
  },
  SyncAllBulletin({ commit }) {
    for (let i = state.Follows.length - 1; i >= 0; i--) {
      SyncFollowBulletin(state.Follows[i])
    }
  },
  SwitchBBSession({ commit }, payload) {
    //console.log("SwitchBBSession")
    //console.log(payload)
    commit('SwitchBBSession', payload)
    SyncFollowBulletin(payload)
  },
  PublishBulletin({ commit }, payload) {
    console.log(state.Quotes)
    let timestamp = Date.now()
    let tmpQuotes = []
    for (let i = state.Quotes.length - 1; i >= 0; i--) {
      let quote = { "Address": state.Quotes[i].Address, "Sequence": state.Quotes[i].Sequence, "Hash": state.Quotes[i].Hash }
      tmpQuotes.push(quote)
    }
    state.Quotes = []
    let json = {
      "Action": state.ActionCode.Bulletin,
      "Sequence": state.CurrentBulletinSequence + 1,
      "PreHash": state.CurrentBulletinHash,
      "Quote": tmpQuotes,
      "Content": payload.content,
      "Timestamp": timestamp,
      "PublicKey": state.PublicKey
    }
    let sig = sign(JSON.stringify(json), state.PrivateKey)
    json.Signature = sig
    console.log(json)
    let strJson = JSON.stringify(json)
    let hash = halfSHA512(strJson)
    console.log(strJson)

    //save bulletin
    let SQL = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size)
      VALUES ('${state.Address}', ${state.CurrentBulletinSequence + 1}, '${state.CurrentBulletinHash}', '${payload.content}', '${timestamp}', '${strJson}', '${timestamp}', '${hash}', ${tmpQuotes.length})`
    console.log(SQL)

    state.DB.run(SQL, err => {
      if (err) {
        console.log(err)
      } else {
        state.Bulletins.unshift({ "address": state.Address, "name": SelfName, "timestamp": timestamp, "created_at": timestamp, 'sequence': state.CurrentBulletinSequence + 1, "content": payload.content, 'hash': hash, 'quote_size': tmpQuotes.length })
        state.CurrentBulletinSequence += 1
        state.CurrentBulletinHash = hash
      }
    })
  }
}

const getters = {
  getWSState: (state) => {
    let s = state.WSState == 1 ? 'connected' : 'disconnected'
    return s
  },
  getHosts: (state) => {
    return state.Hosts
  },
  getNameByAddress: (state) => (address) => {
    return state.Contacts[address]
  },
  //chat
  currentChatSession: (state) => {
    //console.log('state.CurrentChatSession')
    return state.CurrentChatSession
  },
  currentChatKeySequence: (state) => {
    //console.log('state.CurrentChatKeySequence')
    return state.CurrentChatKeySequence
  },
  currentChatKey: (state) => {
    //console.log('state.CurrentChatKey')
    return state.CurrentChatKey
  },
  getMessages: (state) => {
    //console.log('state.Messages')
    //console.log(state.Messages.length)
    if (state.Messages.length == 0) {
      state.Messages = []
      let SQL = `SELECT * FROM MESSAGES WHERE sour_address = '${state.CurrentChatSession}' OR dest_address = '${state.CurrentChatSession}' ORDER BY created_at DESC LIMIT 20`
      state.DB.all(SQL, (err, items) => {
        if (err) {
          console.log(err)
        } else {
          items.reverse()
          for (const item of items) {
            let name = SelfName
            if (item.sour_address != null) {
              name = state.Contacts[item.sour_address]
            }
            state.Messages.push({ 'name': name, 'timestamp': item.timestamp, 'created_at': item.created_at, 'sequence': item.sequence, 'content': item.content, 'confirmed': item.confirmed, 'hash': item.hash })
          }
        }
      })
    }
    //console.log(state.Messages)
    return state.Messages
  },
  //bulletin board => BB
  currentBBSession() {
    return state.CurrentBBSession
  },
  getBulletins: (state) => {
    if (state.Bulletins.length == 0) {
      state.Bulletins = []
      let SQL = ''
      if (state.CurrentBBSession == "*") {
        let all = [state.Address]
        for (let i = state.Follows.length - 1; i >= 0; i--) {
          all.push(state.Follows[i])
        }
        SQL = `SELECT * FROM BULLETINS WHERE address in (${Array2Str(all)}) ORDER BY created_at DESC LIMIT 20`
      } else if (state.CurrentBBSession == "#") {
        SQL = `SELECT * FROM BULLETINS WHERE address = '${state.Address}' ORDER BY created_at DESC LIMIT 20`
      } else {
        SQL = `SELECT * FROM BULLETINS WHERE address = '${state.CurrentBBSession}' ORDER BY created_at DESC LIMIT 20`
      }

      state.DB.all(SQL, (err, items) => {
        if (err) {
          console.log(err)
        } else {
          for (const item of items) {
            let name = SelfName
            if (item.address != state.Address) {
              name = state.Contacts[item.address]
            }
            state.Bulletins.push({ "address": item.address, 'name': name, 'timestamp': item.timestamp, 'created_at': item.created_at, 'sequence': item.sequence, 'content': item.content, 'hash': item.hash, 'quote_size': item.quote_size })
          }
        }
      })
    }
    //console.log(state.Bulletins)
    return state.Bulletins
  },
  getQuotes: (state) => {
    return state.Quotes
  },
  displayQuotes: (state) => {
    return state.DisplayQuotes
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}