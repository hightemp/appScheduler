import { app, BrowserWindow } from 'electron'

const path = require('path')

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

const sExecutableFileName = path.basename(process.argv[0]);

const parseArgs = require('electron-args');
 
const cli = parseArgs(`
    ${sExecutableFileName}
 
    Usage
      $ ${sExecutableFileName} [path]
 
    Options
      --help     show help
      --version  show version
      -d         run as daemon [Default: false]
      -p         websocket server port [Default: 9090]
 
    Examples
      $ ${sExecutableFileName} -d
`, {
    alias: {
        h: 'help'
    },
    default: {
        d: false,
        p: 9090
    }
});

// console.log(cli.flags.d);
// process.exit(0);

if (cli.flags.d) {
  const oDaemon = require('../../src/lib/daemon.js');

  oDaemon.fnStart(cli.flags);
} else {

  const oServiceInstaller = require('../../src/lib/install_service.js');
  oServiceInstaller.fnInstall();

  let mainWindow

  function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: true
      }
    })

    mainWindow.loadURL(process.env.APP_URL)

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}