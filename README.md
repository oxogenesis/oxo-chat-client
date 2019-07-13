# install node environment, must be v10.11.0
$ node -v
v10.11.0

# install dependencies for test, compile sqlite for electron
$ npm install

$ npm run rebuild

# install dependencies for build, compile sqlite for electron
$ cd dist

$ npm install

$ npm run rebuild

# if you could not compile sqlite for electron, copy node_sqlite3.node from lib to node_modules/sqlite3/lib/binding/
cp -r lib/electron-v4.0-win32-x64 node_modules/sqlite3/lib/binding/

cp -r lib/electron-v4.0-win32-x64 dist/node_modules/sqlite3/lib/binding/

# test
$ npm run test

# build
$ npm run build
