const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

let mainWindow;

// Otimizações de performance
const numCores = os.cpus().length;
process.env.UV_THREADPOOL_SIZE = Math.max(128, numCores * 2);

/**
 * Captura URL passada via linha de comando
 */
function getUrlFromArgs(argv) {
  return argv.find(arg => /^https?:\/\//i.test(arg));
}

/**
 * Cria a janela e configura handlers
 */
function createWindow(urlFromCli) {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      enableWebSQL: false,
      preloadBufferSize: 5 * 1024 * 1024,
      v8CacheOptions: 'bypassHeatCheck'
    },
    show: false
  });

  // Determinar URL inicial
  const startUrl = urlFromCli 
    ? urlFromCli 
    : `file://${path.join(__dirname, 'index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Mostrar a janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Habilitar V8 code caching
  mainWindow.webContents.session.enableNetworkEmulation({ offline: false });

  // Interceptar novas janelas/popups e transformar em abas
  mainWindow.webContents.setWindowOpenHandler((details) => {
    // Enviar mensagem para renderer criar nova aba
    mainWindow.webContents.send('webview-new-window', {
      url: details.url
    });
    
    // Denegar abertura de nova janela
    return { action: 'deny' };
  });

  // Quando uma webview é anexada, configurar seu handler também
  mainWindow.webContents.on('did-attach-webview', (event, wc) => {
    wc.setWindowOpenHandler((details) => {
      mainWindow.webContents.send('webview-new-window', {
        url: details.url
      });
      return { action: 'deny' };
    });
  });
}

app.whenReady().then(() => {
  const url = getUrlFromArgs(process.argv);
  createWindow(url);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(getUrlFromArgs(process.argv));
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
