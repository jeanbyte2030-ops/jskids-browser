const { contextBridge, ipcRenderer } = require('electron');

/**
 * Expor API segura do Electron para o renderer
 * Com contextIsolation: true, precisamos usar contextBridge
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Receber evento de nova janela (popup) do main process
   * @param {Function} callback - Função chamada quando há novo popup
   */
  onWebviewNewWindow: (callback) => {
    ipcRenderer.on('webview-new-window', (_event, data) => {
      callback(data);
    });
  }
});
