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

//>>>bulletin<<<
let BulletinSchema = {
  "type": "object",
  "required": ["ObjectType", "Sequence", "PreHash", "Quote", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "ObjectType": {
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

let FileChunkSchema = {
  "type": "object",
  "required": ["ObjectType", "SHA1", "Chunk", "Content"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number"
    },
    "SHA1": {
      "type": "string"
    },
    "Chunk": {
      "type": "number"
    },
    "Content": {
      "type": "string"
    }
  }
}

let FileRequestSchema = {
  "type": "object",
  "required": ["Action", "SHA1", "CurrentChunk", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
    },
    "SHA1": {
      "type": "string"
    },
    "CurrentChunk": {
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
  "required": ["Action", "GroupHash", "GroupManageAction", "To", "Timestamp", "PublicKey", "Signature"],
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
    "GroupManageAction": {
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
  "required": ["ObjectType", "GroupHash", "Sequence", "PreHash", "GroupManageAction", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
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
    "GroupManageAction": {
      "type": "number"
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
  "required": ["GroupHash", "Sequence", "PreHash", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
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
      "type": "object",
      "required": ["Address", "Sequence", "Hash"],
      "properties": {
        "Address": { "type": "string" },
        "Sequence": { "type": "number" },
        "Hash": { "type": "string" }
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

let GroupMessageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "Address", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "Address": {
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

let FileSchema = {
  "type": "object",
  "required": ["Name", "Ext", "Size", "Chunk", "SHA1"],
  "maxProperties": 5,
  "properties": {
    "Name": {
      "type": "string"
    },
    "Ext": {
      "type": "string"
    },
    "Size": {
      "type": "number"
    },
    "Chunk": {
      "type": "number"
    },
    "SHA1": {
      "type": "string"
    }
  }
}
//end client schema

//local schema
let ObjectSchema = {
  "type": "object",
  "required": ["ObjectType", "Address", "Sequence", "Hash"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "string"
    },
    "Address": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "Hash": {
      "type": "string"
    }
  }
}
//end local schema

let Ajv = require('ajv')
let ajv = new Ajv({ allErrors: true })

//client
let vDeclare = ajv.compile(DeclareSchema)
let vObjectResponseSchema = ajv.compile(ObjectResponseSchema)

let vBulletinRequestSchema = ajv.compile(BulletinRequestSchema)
let vFileRequestSchema = ajv.compile(FileRequestSchema)

let vChatMessageSchema = ajv.compile(ChatMessageSchema)
let vChatSyncSchema = ajv.compile(ChatSyncSchema)
let vChatDHSchema = ajv.compile(ChatDHSchema)

let vGroupManageSyncSchema = ajv.compile(GroupManageSyncSchema)
let vGroupDHSchema = ajv.compile(GroupDHSchema)
let vGroupMessageSyncSchema = ajv.compile(GroupMessageSyncSchema)
let vGroupRequestSchema = ajv.compile(GroupRequestSchema)

function checkJsonSchema(json) {
  if (vObjectResponseSchema(json) || vBulletinRequestSchema(json) || vFileRequestSchema(json) || vChatMessageSchema(json) || vChatSyncSchema(json) || vChatDHSchema(json) || vDeclare(json) || vGroupManageSyncSchema(json) || vGroupDHSchema(json) || vGroupMessageSyncSchema(json) || vGroupRequestSchema(json)) {
    return true
  } else {
    return false
  }
}

let vBulletinSchema = ajv.compile(BulletinSchema)

function checkBulletinSchema(json) {
  try {
    if (vBulletinSchema(json)) {
      console.log(`Bulletin schema ok`)
      return true
    } else {
      console.log(`Bulletin schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vFileChunkSchema = ajv.compile(FileChunkSchema)

function checkFileChunkSchema(json) {
  try {
    if (vFileChunkSchema(json)) {
      console.log(`File schema ok`)
      return true
    } else {
      console.log(`File schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vGroupManageSchema = ajv.compile(GroupManageSchema)

function checkGroupManageSchema(json) {
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

let vGroupMessageSchema = ajv.compile(GroupMessageSchema)

function checkGroupMessageSchema(json) {
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

var vFileSchema = ajv.compile(FileSchema)

function deriveJson(str) {
  try {
    let json = JSON.parse(str)
    return json
  } catch (e) {
    console.log(`not a json`)
    return false
  }
}

function checkFileSchema(json) {
  try {
    if (vFileSchema(json)) {
      console.log(`File schema ok`)
      return true
    } else {
      console.log(`File schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vObjectSchema = ajv.compile(ObjectSchema)

function checkObjectSchema(json) {
  try {
    if (vObjectSchema(json)) {
      console.log(`Object schema ok`)
      return true
    } else {
      console.log(`Object schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  deriveJson,
  checkJsonSchema,
  checkBulletinSchema,
  checkFileChunkSchema,
  checkGroupManageSchema,
  checkGroupRequestSchema,
  checkGroupMessageSchema,
  checkFileSchema,
  checkObjectSchema
}
