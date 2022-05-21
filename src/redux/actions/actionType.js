export const actionType = {
  master: {
    setMasterKey: 'SET_MASTER_KEY'
  },
  avatar: {
    setTheme: 'SET_THEME',
    changeTheme: 'CHANGE_THEME',
    setAvatar: 'SET_AVATAR',
    setAvatarName: 'SET_AVATAR_NAME',
    setDatabase: 'SET_DATABASE',

    enableAvatar: 'ENABLE_AVATAR',
    disableAvatar: 'DISABLE_AVATAR',
    resetAvatar: 'RESET_AVATAR',
    loadFromDB: 'LOAD_FROM_DB',

    setAddressBook: 'SET_ADDRESS_BOOK',
    setCurrentAddressMark: 'SET_CURRENT_ADDRESS_MARK',
    addAddressMark: 'ADD_ADDRESS_MARK',
    delAddressMark: 'DEL_ADDRESS_MARK',
    saveAddressName: 'SAVE_ADDRESS_NAME',
    setFriends: 'SET_FRIENDS',
    setFriendRequests: 'SET_FRIEND_REQUESTS',
    addFriend: 'ADD_FRIEND',
    delFriend: 'DEL_FRIEND',
    setFollows: 'SET_FOLLOWS',
    addFollow: 'ADD_FOLLOW',
    delFollow: 'DEL_FOLLOW',

    Conn: 'CONN',
    setConnStatus: 'SET_CONN_STATUS',
    changeHostList: 'CHANGE_HOST_LIST',
    setHostList: 'SET_HOSTS_LIST',
    addHost: 'ADD_HOST',
    delHost: 'DEL_HOST',
    setCurrentHost: 'SET_CURRENT_HOST',
    changeCurrentHost: 'CHANGE_CURRENT_HOST',
    setWebSocket: 'SET_WEBSOCKET',
    setWebSocketChannel: 'SET_WEBSOCKET_CHANNEL',
    SendMessage: 'SEND_MESSAGE',

    setMessageGenerator: 'SET_MESSAGE_GENERATOR',

    addQuote: "ADD_QUOTE",
    delQuote: "DEL_QUOTE",
    setQuoteList: 'SET_QUOTE_LIST',
    setQuoteWhiteList: 'SET_QUOTE_WHITE_LIST',

    setTabBulletinList: 'SET_TAB_BULLETIN_LIST',
    setBulletinList: 'SET_BULLETIN_LIST',
    setBulletinCacheSize: 'SET_BULLETIN_CACHE_SIZE',
    changeBulletinCacheSize: 'CHANGE_BULLETIN_CACHE_SIZE',
    clearBulletinCache: 'CLEAR_BULLETIN_CACHE',
    LoadTabBulletinList: 'LOAD_TAB_BULLETIN_LIST',
    LoadBulletinList: 'LOAD_BULLETIN_LIST',
    LoadCurrentBulletin: 'LOAD_CURRENT_BULLETIN',
    MarkBulletin: "MARK_BULLETIN",
    UnmarkBulletin: "UNMARK_BULLETIN",
    UpdateFollowBulletin: "UPDATE_FOLLOW_BULLETIN",
    setCurrentBulletin: 'SET_CURRENT_BULLETIN',
    setRandomBulletin: 'SET_RANDOM_BULLETIN',
    setRandomBulletinFlag: 'SET_RANDOM_BULLETIN_FLAG',
    setCurrentBBSession: 'SET_CURRENT_BB_SESSION',

    HandleBulletinRequest: 'HANDLE_BULLETIN_REQUEST',
    SaveBulletin: 'SAVE_BULLETIN',
    // SaveContentBulletin: 'SAVE_CONTENT_BULLETIN',
    FetchBulletin: 'FETCH_BULLETIN',
    FetchRandomBulletin: 'FETCH_RANDOM_BULLETIN',
    PublishBulletin: 'PUBLISH_BULLETIN',


    //Chat
    setSessionMap: 'SET_SESSION_MAP',
    setCurrentSession: 'SET_CURRENT_SESSION',
    setCurrentMessageList: 'SET_CURRENT_MESSAGE_LIST',
    LoadCurrentSession: 'LOAD_CURRENT_SESSION',
    LoadCurrentMessageList: 'LOAD_CURRENT_MESSAGE_LIST',
    HandleFriendECDH: 'HANDLE_FRIEND_ECDH',
    HandleFriendMessage: 'HANDLE_FRIEND_MESSAGE',
    SaveFriendMessage: 'SAVE_FRIEND_MESSAGE',
    HandleFriendSync: 'HANDLE_FRIEND_SYNC',
    SendFriendMessage: 'SEND_FRIEND_MESSAGE',
    setMessageWhiteList: 'SET_MESSAGE_WHITE_LIST'
  }
}