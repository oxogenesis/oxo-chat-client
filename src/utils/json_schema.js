//client schema
//>>>declare<<<
let DeclareSchema = {
  "type": "object",
  "required": ["Action", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 4,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

//>>>bulletin<<<
let BulletinSchema = {
  "type": "object",
  "required": ["Action", "Sequence", "PreHash", "Quote", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "Quote": {
      "type": "array",
      "minItems": 0,
      "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Address", "Sequence", "Hash"],
        "properties": {
          "Address": { "type": "string" },
          "Sequence": { "type": "number" },
          "Hash": { "type": "string" }
        }
      }
    },
    "Content": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let BulletinRequestSchema = {
  "type": "object",
  "required": ["Action", "Address", "Sequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Address": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let ObjectResponseSchema = {
  "type": "object",
  "required": ["Action", "Object", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Object": {
      "type": "object"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

//>>>chat<<<
let ChatMessageSchema = {
  "type": "object",
  "required": ["Action", "Sequence", "PreHash", "PairHash", "Content", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "PairHash": {
      "type": "array",
      "minItems": 0,
      "maxItems": 8,
      "items": {
        "type": "string",
      }
    },
    "Content": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let ChatSyncSchema = {
  "type": "object",
  "required": ["Action", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
    },
    "CurrentSequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

//ChatDH
let ChatDHSchema = {
  "type": "object",
  "required": ["Action", "Division", "Sequence", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Division": {
      "type": "number"
    },
    "Sequence": {
      "type": "number"
    },
    "DHPublicKey": {
      "type": "string"
    },
    "Pair": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

//>>>group<<<
//group request
let GroupRequestSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "SubAction", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    //leave:0
    //join:1
    "SubAction": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

//group control for group admin
let GroupManageSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "Sequence", "PreHash", "SubAction", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    //dismiss:0
    //create:1
    //member approve:2   need Request
    //remove member:3    Request = {"Address":address}
    //member release:4   need Request
    "SubAction": {
      "type": "string"
    },
    "Request": {
      "type": "object"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let GroupManageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "CurrentSequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let GroupDHSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "DHPublicKey": {
      "type": "string"
    },
    "Pair": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let GroupMessageSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "Sequence", "PreHash", "Confirm", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "Confirm": {
      "type": "string"
    },
    "Content": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let GroupMessageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "MessageHash", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "MessageHash": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}
//end client schema

var Ajv = require('ajv')
var ajv = new Ajv({ allErrors: true })

//client
var vDeclare = ajv.compile(DeclareSchema)
var vBulletinRequestSchema = ajv.compile(BulletinRequestSchema)
var vObjectResponseSchema = ajv.compile(ObjectResponseSchema)
var vChatMessageSchema = ajv.compile(ChatMessageSchema)
var vChatSyncSchema = ajv.compile(ChatSyncSchema)
var vChatDHSchema = ajv.compile(ChatDHSchema)
var vGroupManageSyncSchema = ajv.compile(GroupManageSyncSchema)
var vGroupDHSchema = ajv.compile(GroupDHSchema)
var vGroupMessageSyncSchema = ajv.compile(GroupMessageSyncSchema)
var vGroupRequestSchema = ajv.compile(GroupRequestSchema)

function checkJsonSchema(strJson) {
  if (typeof strJson == "string") {
    try {
      let json = JSON.parse(strJson)
      if (vObjectResponseSchema(json) || vBulletinRequestSchema(json) || vChatMessageSchema(json) || vChatSyncSchema(json) || vChatDHSchema(json) || vDeclare(json) || vGroupManageSchema(json) || vGroupManageSyncSchema(json) || vGroupDHSchema(json) || vGroupMessageSchema(json) || vGroupMessageSyncSchema(json) || vGroupRequestSchema(json)) {
        return json
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else {
    return false
  }
}

var vBulletinSchema = ajv.compile(BulletinSchema)
function checkBulletinSchema(json) {
  //console.log(json)
  try {
    if (vBulletinSchema(json)) {
      console.log(`bulletin schema ok`)
      return true
    } else {
      console.log(`bulletin schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

var vGroupManageSchema = ajv.compile(GroupManageSchema)
function checkGroupManageSchema(json) {
  //console.log(json)
  try {
    if (vGroupManageSchema(json)) {
      console.log(`GroupManage schema ok`)
      return true
    } else {
      console.log(`GroupManage schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

var vGroupMessageSchema = ajv.compile(GroupMessageSchema)
function checkGroupMessageSchema(json) {
  //console.log(json)
  try {
    if (vGroupMessageSchema(json)) {
      console.log(`GroupMessage schema ok`)
      return true
    } else {
      console.log(`GroupMessage schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

function checkGroupRequestSchema(json) {
  //console.log(json)
  try {
    if (vGroupRequestSchema(json)) {
      console.log(`GroupRequest schema ok`)
      return true
    } else {
      console.log(`GroupRequest schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  checkJsonSchema,
  checkBulletinSchema,
  checkGroupManageSchema,
  checkGroupRequestSchema,
  checkGroupMessageSchema
}
