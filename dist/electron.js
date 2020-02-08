// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let fs = require("fs")
let path = require("path")

//递归创建目录 异步方法
//recursive在10.14.1可以，在10.11上不可以
function mkdirs(dirname, callback) {
  fs.exists(dirname, function(exists) {
    if (exists) {
      callback()
    } else {
      mkdirs(path.dirname(dirname), function() {
        fs.mkdir(dirname, callback)
      })
    }
  })
}

mkdirs("./data/tmp", function(ee) {
  console.log(ee)
})

let mainWindow
//系统托盘图标目录
let trayIcon = path.join(__dirname, 'assets')
let appTray = null
let blinkJob = null

function destroyTray() {
  if (blinkJob != null) {
    clearInterval(blinkJob)
  }
  blinkJob = null
  if (appTray != null) {
    appTray.destroy()
  }
}

function createTray() {
  //系统托盘右键菜单
  let trayMenuTemplate = [{
      label: '恢复',
      click: function() {
        mainWindow.show()
        destroyTray()
      }
    },
    {
      label: '退出',
      click: function() {
        app.quit()
      }
    }
  ]

  appTray = new Tray(path.join(trayIcon, 'app.ico'))
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('oxo.chat-client')
  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)

  appTray.on('click', function() {
    mainWindow.show()
    destroyTray()
  })
}

function createWindow() {
  //Menu.setApplicationMenu(null)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('close', (event) => {
    if (!mainWindow.isVisible()) {
      mainWindow = null
    } else {
      event.preventDefault()
      mainWindow.hide()
      createTray()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('asynchronous-message', function(event, arg) {
  console.log(arg)
  // 回应异步消息
  //event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', function(event, arg) {
  console.log(arg)
  // 回应同步消息
  //event.returnValue = 'pong'
  if (appTray != null && blinkJob == null) {
    let count = 0
    blinkJob = setInterval(function() {
      count++
      if (count % 2 == 0) {
        appTray.setImage(path.join(trayIcon, 'blank.ico'))
      } else {
        appTray.setImage(path.join(trayIcon, 'app.ico'))
      }
    }, 500)
  }
})
