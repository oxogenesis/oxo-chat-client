# 需要前端小伙伴
这个客户端只是个原型，还有很多需要美化优化的工作需要做。  
主要代码并不复杂，客户端2000多行，服务端200多行，容易理解。  

1. 希望能有一个前端帮忙把界面这块按正经项目的水平做一遍，对于vue使用上不合惯例的地方进行调整。  
2. 希望能有移动端开发者将项目移植到移动端。
  
谢谢！  

本项目纯粹是个人兴趣。  
后续可能还会进行扩展：局域网内数据同步功能，数据中继远程系统互联机制，本地系统同时连接多个远程中继，消息内容格式扩展等。

后续还有其他项目计划，需要c++11相关人才，苟富贵，定不相忘！  
**namespacegenesis@gmail.com**


# code
**[client](https://github.com/oxogenesis/oxo-chat-client)**  
**[server](https://github.com/oxogenesis/oxo-chat-server)**  

# release
**[download page](https://github.com/oxogenesis/oxo-chat-client/releases)**  

**v0.0.2 群聊**（群主主控模式的点对点群聊）  
**v0.0.1 公告、私聊**

# wiki
**[1.关于密码学](https://github.com/oxogenesis/oxo-chat-client/wiki/1.%E5%85%B3%E4%BA%8E%E5%AF%86%E7%A0%81%E5%AD%A6)**  
**[2.系统描述](https://github.com/oxogenesis/oxo-chat-client/wiki/2.%E7%B3%BB%E7%BB%9F%E6%8F%8F%E8%BF%B0)**  
**[3.业务消息](https://github.com/oxogenesis/oxo-chat-client/wiki/3.%E4%B8%9A%E5%8A%A1%E6%B6%88%E6%81%AF)**  
**[4.数据存储](https://github.com/oxogenesis/oxo-chat-client/wiki/4.%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8)**  

# public server
* **wss://ru.oxo-chat-server.com**  

I would like to point a subdomain to your ip, if you want to provide service for the public.  
You could create a issue to submit your ip and other info of your server.  
You could use servers other people provided to contact you friends.  
Or you could setup your own server just for your friends.  

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
