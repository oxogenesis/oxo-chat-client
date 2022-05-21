const DefaultHost = 'wss://ru.oxo-chat-server.com'
const DefaultTheme = 'light'
const DefaultBulletinCacheSize = 0

//1000*60*60*24=86400000
//const Epoch = Date.parse('2011-11-11 11:11:11')
const Epoch = 1320981071000

//const GenesisHash = quarterSHA512('obeTvR9XDbUwquA6JPQhmbgaCCaiFa2rvf')
const GenesisHash = 'F4C2EB8A3EBFC7B6D81676D79F928D0E'

const MessageInterval = 1000

//constant
const ActionCode = {
  "Declare": 100,
  "ObjectResponse": 101,

  "BulletinRandom": 200,
  "BulletinRequest": 201,
  "BulletinFileRequest": 202,

  "ChatDH": 301,
  "ChatMessage": 302,
  "ChatSync": 303,
  "PrivateFileRequest": 304,

  "GroupRequest": 401,
  "GroupManageSync": 402,
  "GroupDH": 403,
  "GroupMessageSync": 404,
  "GroupFileRequest": 405
}

const DefaultDivision = 3

//group
const GroupRequestActionCode = {
  "Join": 1,
  "Leave": 0
}
const GroupManageActionCode = {
  "Dismiss": 0,
  "Create": 1,
  "MemberApprove": 2, //need Request
  "MemberRemove": 3,
  "MemberRelease": 4 //need Request
}
const GroupMemberShip = {
  "Applying": 0,
  "Founder": 1,
  "Member": 2,
  "Exited": 3
}

const ObjectType = {
  "Bulletin": 101,
  "BulletinFile": 102,

  "PrivateFile": 201,

  "GroupManage": 301,
  "GroupMessage": 302,
  "GroupFile": 303
}

const SessionType = {
  "Private": 0,
  "Group": 1
}

//Bulletin
const BulletinPageSize = 50
const BulletinTabSession = '<BT>'
const BulletinMarkSession = '<BM>'
const BulletinHistorySession = '<BH>'
const BulletinAddressSession = '<BA>'

//Message
const MessagePageSize = 50

export {
  DefaultHost,
  DefaultTheme,
  DefaultBulletinCacheSize,
  Epoch,
  GenesisHash,
  MessageInterval,
  ActionCode,
  DefaultDivision,
  GroupRequestActionCode,
  GroupManageActionCode,
  GroupMemberShip,
  ObjectType,
  SessionType,
  BulletinPageSize,
  BulletinTabSession,
  BulletinMarkSession,
  BulletinHistorySession,
  BulletinAddressSession,
  MessagePageSize
}