import { actionType } from '../actions/actionType'
import { fromJS, set } from 'immutable'
import { AddressToName } from '../../lib/Util'
import { DefaultTheme, DefaultBulletinCacheSize } from '../../lib/Const'

function initialState() {
  return fromJS(
    {
      Seed: null,
      Address: null,
      PublicKey: null,
      PrivateKey: null,
      Theme: DefaultTheme,

      Database: null,

      HostList: [],
      CurrentHost: null,
      WebSocket: null,
      WebSocketChannel: null,
      ConnStatus: false,
      MessageGenerator: null,

      AddressMap: {},
      AddressArray: [],
      CurrentAddressMark: null,

      Friends: [],
      FriendRequests: [],
      Follows: [],

      TabBulletinList: [],
      BulletinList: [],
      CurrentBBSession: null,
      CurrentBulletin: null,
      RandomBulletin: null,
      RandomBulletinFlag: false,
      QuoteList: [],
      QuoteWhiteList: [],
      BulletinCacheSize: DefaultBulletinCacheSize,

      SessionMap: {},
      SessionList: [],
      UnreadMessage: 0,
      UnreadSessionMap: {},
      CurrentSession: {},
      CurrentMessageList: [],
      // bulletin from message
      MessageWhiteList: [],
      CountUnreadMessage: 0
    }
  )
}

export default function reducer(state = initialState(), action) {
  if (typeof reducer.prototype[action.type] === "function") {
    return reducer.prototype[action.type](state, action)
  } else {
    return state
  }
}

reducer.prototype[actionType.avatar.setAvatar] = (state, action) => {
  return state.set('Seed', action.seed)
    .set('Name', action.name)
    .set('Address', action.address)
    .set('PublicKey', action.public_key)
    .set('PrivateKey', action.private_key)
    .set('Database', null)
    .set('CurrentHost', null)
    .set('CurrentBBSession', null)
    .set('CurrentBulletin', null)
    .set('RandomBulletin', null)
    .set('RandomBulletinFlag', false)
    .set('AddressMap', {})
    .set('AddressArray', [])
    .set('CurrentAddressMark', null)
    .set('Friends', [])
    .set('FriendRequests', [])
    .set('Follows', [])
    .set('TabBulletinList', [])
    .set('BulletinList', [])
    .set('QuoteList', [])
    .set('QuoteWhiteList', [])
    .set('SessionMap', {})
    .set('SessionList', [])
    .set('UnreadMessage', 0,)
    .set('UnreadSessionMap', {})
    .set('CurrentSession', {})
    .set('CurrentMessageList', [])
    .set('CountUnreadMessage', null)
    .set('MessageWhiteList', [])
}


reducer.prototype[actionType.avatar.setTheme] = (state, action) => {
  return state.set('Theme', action.theme)
}

reducer.prototype[actionType.avatar.setAvatarName] = (state, action) => {
  return state.set('Name', action.name)
}

reducer.prototype[actionType.avatar.setDatabase] = (state, action) => {
  return state.set('Database', action.db)
}

reducer.prototype[actionType.avatar.resetAvatar] = (state) => {
  return state.set('Seed', null)
    .set('Address', null)
    .set('PublicKey', null)
    .set('PrivateKey', null)
    .set('Database', null)
    .set('CurrentHost', null)
    .set('CurrentBBSession', null)
    .set('CurrentBulletin', null)
    .set('RandomBulletin', null)
    .set('RandomBulletinFlag', false)
    .set('AddressMap', {})
    .set('AddressArray', [])
    .set('CurrentAddressMark', null)
    .set('Friends', [])
    .set('FriendRequests', [])
    .set('Follows', [])
    .set('TabBulletinList', [])
    .set('BulletinList', [])
    .set('QuoteList', [])
    .set('QuoteWhiteList', [])
    .set('SessionMap', {})
    .set('SessionList', [])
    .set('UnreadMessage', 0,)
    .set('UnreadSessionMap', {})
    .set('CurrentSession', {})
    .set('CurrentMessageList', [])
    .set('CountUnreadMessage', null)
    .set('MessageWhiteList', [])
}

reducer.prototype[actionType.avatar.setAddressBook] = (state, action) => {
  let self_address = state.get('Address')
  let address_list = []
  Object.keys(action.address_map).forEach(address => {
    if (self_address !== address) {
      address_list.push({ "Address": address, "Name": action.address_map[address] })
    }
  })
  address_list.sort(function (m, n) {
    if (m.Name > n.Name) return 1
    else if (m.Name < n.Name) return -1
    else return 0
  })
  return state.set('AddressMap', action.address_map)
    .set('AddressArray', address_list)
}

reducer.prototype[actionType.avatar.setCurrentAddressMark] = (state, action) => {
  let tmp = {}
  tmp.Address = action.address
  tmp.Name = AddressToName(state.get('AddressMap'), action.address)
  tmp.IsMark = (tmp.Address != tmp.Name)
  tmp.IsFollow = state.get('Follows').includes(tmp.Address)
  tmp.IsFriend = state.get('Friends').includes(tmp.Address)
  return state.set('CurrentAddressMark', tmp)
}

reducer.prototype[actionType.avatar.setFriends] = (state, action) => {
  return state.set('Friends', action.friend_list)
}

reducer.prototype[actionType.avatar.setFriendRequests] = (state, action) => {
  return state.set('FriendRequests', action.friend_request_list)
}

reducer.prototype[actionType.avatar.setFollows] = (state, action) => {
  return state.set('Follows', action.follow_list)
}

reducer.prototype[actionType.avatar.setHostList] = (state, action) => {
  return state.set('HostList', action.host_list)
}

reducer.prototype[actionType.avatar.setCurrentHost] = (state, action) => {
  return state.set('CurrentHost', action.current_host)
    .set('CurrentHostTimestamp', action.current_host_timestamp)
}

reducer.prototype[actionType.avatar.setWebSocket] = (state, action) => {
  return state.set('WebSocket', action.websocket)
}

reducer.prototype[actionType.avatar.setWebSocketChannel] = (state, action) => {
  return state.set('WebSocketChannel', action.channel)
}

reducer.prototype[actionType.avatar.setConnStatus] = (state, action) => {
  return state.set('ConnStatus', action.status)
}

reducer.prototype[actionType.avatar.setMessageGenerator] = (state, action) => {
  return state.set('MessageGenerator', action.message_generator)
}

//Bulletin
reducer.prototype[actionType.avatar.setBulletinCacheSize] = (state, action) => {
  return state.set('BulletinCacheSize', action.bulletin_cache_size)
}

reducer.prototype[actionType.avatar.setTabBulletinList] = (state, action) => {
  return state.set('TabBulletinList', action.tab_bulletin_list)
}

reducer.prototype[actionType.avatar.setBulletinList] = (state, action) => {
  return state.set('BulletinList', action.bulletin_list)
}

reducer.prototype[actionType.avatar.setCurrentBulletin] = (state, action) => {
  return state.set('CurrentBulletin', action.bulletin)
}

reducer.prototype[actionType.avatar.setRandomBulletin] = (state, action) => {
  return state.set('RandomBulletin', action.bulletin)
}

reducer.prototype[actionType.avatar.setRandomBulletinFlag] = (state, action) => {
  return state.set('RandomBulletinFlag', action.flag)
}

reducer.prototype[actionType.avatar.setCurrentBBSession] = (state, action) => {
  return state.set('CurrentBBSession', action.current_BB_session)
}

reducer.prototype[actionType.avatar.setQuoteList] = (state, action) => {
  return state.set('QuoteList', action.quote_list)
}

reducer.prototype[actionType.avatar.setQuoteWhiteList] = (state, action) => {
  return state.set('QuoteWhiteList', action.quote_white_list)
}

reducer.prototype[actionType.avatar.addQuote] = (state, action) => {
  let quote_list = state.get('QuoteList')

  if (quote_list.length >= 8) {
    return state.set('QuoteList', quote_list)
  }
  for (const quote of quote_list) {
    if (quote.Hash == action.hash) {
      return state.set('QuoteList', quote_list)
    }
  }

  quote_list.push({
    Address: action.address,
    Sequence: action.sequence,
    Hash: action.hash
  })
  return state.set('QuoteList', quote_list)
}

reducer.prototype[actionType.avatar.delQuote] = (state, action) => {
  let quote_list = state.get('QuoteList')
  let tmp_quote_list = []
  for (const quote of quote_list) {
    if (quote.Hash != action.hash) {
      tmp_quote_list.push(quote)
    }
  }
  return state.set('QuoteList', tmp_quote_list)
}

//Chat
reducer.prototype[actionType.avatar.setSessionMap] = (state, action) => {
  // console.log(action.session_map)
  let session_list = Object.values(action.session_map)

  session_list.sort(function (m, n) {
    if (m.Timestamp < n.Timestamp) return 1
    else if (m.Timestamp > n.Timestamp) return -1
    else return 0
  })

  let count = 0
  session_list.forEach(session => {
    count += session.CountUnread
  })
  if (count == 0) {
    count = null
  }

  return state.set('SessionList', session_list)
    .set('SessionMap', action.session_map)
    .set('CountUnreadMessage', count)
}

reducer.prototype[actionType.avatar.setCurrentSession] = (state, action) => {
  let session = state.get('CurrentSession')
  if (action.address != null) {
    session.Address = action.address
    if (action.sequence != null) {
      session.Sequence = action.sequence
      session.Hash = action.hash
    }
    if (action.aes_key != null) {
      session.AesKey = action.aes_key
      session.EcdhSequence = action.ecdh_sequence
    }
  } else {
    session = {}
  }
  return state.set('CurrentSession', session)
}

reducer.prototype[actionType.avatar.setCurrentMessageList] = (state, action) => {
  // console.log(action.message_list)
  return state.set('CurrentMessageList', action.message_list)
}

reducer.prototype[actionType.avatar.setMessageWhiteList] = (state, action) => {
  // console.log(action.message_white_list)
  return state.set('MessageWhiteList', action.message_white_list)
}