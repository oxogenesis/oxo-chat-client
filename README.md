# code
**[client](https://github.com/oxogenesis/oxo-chat-client)**  
**[server](https://github.com/oxogenesis/oxo-chat-server)**  

# wiki
**[1.关于密码学](https://github.com/oxogenesis/oxo-chat-client/wiki/1.%E5%85%B3%E4%BA%8E%E5%AF%86%E7%A0%81%E5%AD%A6)**  
**[2.系统描述](https://github.com/oxogenesis/oxo-chat-client/wiki/2.%E7%B3%BB%E7%BB%9F%E6%8F%8F%E8%BF%B0)**  
**[3.业务消息](https://github.com/oxogenesis/oxo-chat-client/wiki/3.%E4%B8%9A%E5%8A%A1%E6%B6%88%E6%81%AF)**  

# test server
**wss://ru.oxo-chat-server.com**  


# run code
* install node environment, must be v10.11.0  
$ node -v  
v10.11.0  

* install dependencies, compile sqlite for electron  
$ npm install  
$ npm run sqlite3  
$ cd dist  
$ npm install  
$ npm run sqlite3  

* if you could not compile sqlite for electron, copy node_sqlite3.node from lib to node_modules/sqlite3/lib/binding/  
$ cp -r lib/electron-v4.0-win32-x64 node_modules/sqlite3/lib/binding/  
$ cp -r lib/electron-v4.0-win32-x64 dist/node_modules/sqlite3/lib/binding/  

* test  
$ npm run test  

* build  
$ npm run build  
