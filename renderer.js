/* ===================================
   GERENCIADOR DE ABAS - JSKids Browser
   =================================== */

/* ===================================
   ESTADO GLOBAL
   =================================== */
let tabs = [];
let activeTabId = null;
let tabCounter = 0;

/* ===================================
   ELEMENTOS DO DOM
   =================================== */
const tabsContainer = document.getElementById('tabsContainer');
const webviewContainer = document.getElementById('webview-container');
const addressInput = document.getElementById('address');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const goBtn = document.getElementById('goBtn');
const newTabBtn = document.getElementById('newTabBtn');

/* ===================================
   FUNÇÕES UTILITÁRIAS
   =================================== */

/**
 * Transforma texto em URL ou realiza busca no Google
 * @param {string} text - Texto a ser processado
 * @returns {string} URL formatada
 */
function formatInputToUrl(text) {
  const value = text.trim();

  if (!value) return 'https://www.google.com';

  // Se parecer uma URL (tem ponto, não tem espaço)
  const hasSpace = /\s/.test(value);
  const hasDot = value.includes('.');

  if (!hasSpace && hasDot) {
    // Se não tem protocolo, adiciona https://
    if (!/^https?:\/\//i.test(value)) {
      return 'https://' + value;
    }
    return value;
  }

  // Caso contrário, trata como busca no Google
  const query = encodeURIComponent(value);
  return `https://www.google.com/search?q=${query}`;
}

/* ===================================
   GERENCIAMENTO DE ABAS
   =================================== */

/**
 * Criar uma nova aba com webview
 * @param {string} url - URL inicial (padrão: Google)
 */
function createTab(url = 'https://www.google.com') {
  const tabId = `tab-${++tabCounter}`;
  const webviewId = `webview-${tabCounter}`;

  // Criar webview
  const webview = document.createElement('webview');
  webview.id = webviewId;
  webview.src = url;
  webview.allowpopups = true;
  webviewContainer.appendChild(webview);

  // Objeto da aba
  const tab = {
    id: tabId,
    webviewId: webviewId,
    title: 'Nova aba',
    url: url
  };
  tabs.push(tab);

  // Criar elemento visual da aba
  createTabElement(tab, webview);

  // Ativar a aba
  activateTab(tabId, webview);
}

/**
 * Criar elemento visual (HTML) da aba
 * @param {object} tab - Objeto da aba
 * @param {element} webview - Elemento webview
 */
function createTabElement(tab, webview) {
  const tabElement = document.createElement('div');
  tabElement.className = 'tab';
  tabElement.id = tab.id;

  const title = document.createElement('span');
  title.className = 'tab-title';
  title.textContent = tab.title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'tab-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tab.id);
  });

  tabElement.appendChild(title);
  tabElement.appendChild(closeBtn);

  // Evento: clicar na aba para ativar
  tabElement.addEventListener('click', () => {
    activateTab(tab.id, webview);
  });

  // Eventos da webview
  setupWebviewEvents(tab, webview, title);

  tabsContainer.appendChild(tabElement);
}

/**
 * Configurar eventos da webview
 * @param {object} tab - Objeto da aba
 * @param {element} webview - Elemento webview
 * @param {element} title - Elemento título da aba
 */
function setupWebviewEvents(tab, webview, title) {
  // Quando navegar
  webview.addEventListener('did-navigate', (event) => {
    const urlObj = new URL(event.url);
    tab.title = urlObj.hostname || 'Nova aba';
    title.textContent = tab.title;
    if (activeTabId === tab.id) {
      addressInput.value = event.url;
      updateNavButtons(webview);
    }
  });

  // Quando navegar na mesma página
  webview.addEventListener('did-navigate-in-page', (event) => {
    if (activeTabId === tab.id) {
      addressInput.value = event.url;
    }
  });

  // Quando a página está pronta
  webview.addEventListener('dom-ready', () => {
    if (activeTabId === tab.id) {
      try {
        if (typeof webview.getURL === 'function') {
          addressInput.value = webview.getURL();
        } else {
          addressInput.value = webview.src || '';
        }
      } catch (e) {
        addressInput.value = webview.src || '';
      }
      updateNavButtons(webview);
    }
  });

  // Quando termina de carregar
  webview.addEventListener('did-stop-loading', () => {
    if (activeTabId === tab.id) {
      updateNavButtons(webview);
    }
  });

  // Interceptar popups e abrir em nova aba (versão antiga - removida)
  // Nota: No Electron 22+, popups são interceptados no main.js com setWindowOpenHandler
  // e enviados via IPC para aqui. Veja setupWebviewPopupListener() abaixo.
}

/**
 * Ativar uma aba
 * @param {string} tabId - ID da aba
 * @param {element} webview - Elemento webview
 */
function activateTab(tabId, webview) {
  // Desativar aba anterior
  if (activeTabId) {
    const oldTab = document.getElementById(activeTabId);
    if (oldTab) oldTab.classList.remove('active');
    const oldTabObj = tabs.find(t => t.id === activeTabId);
    if (oldTabObj) {
      const oldWebview = document.getElementById(oldTabObj.webviewId);
      if (oldWebview) oldWebview.classList.remove('active');
    }
  }

  // Ativar nova aba
  activeTabId = tabId;
  const tabElement = document.getElementById(tabId);
  if (tabElement) tabElement.classList.add('active');
  if (webview) {
    webview.classList.add('active');
    
    // Atualizar barra de endereço com URL segura
    try {
      if (typeof webview.getURL === 'function') {
        addressInput.value = webview.getURL();
      } else {
        addressInput.value = webview.src || '';
      }
    } catch (e) {
      addressInput.value = webview.src || '';
    }
    
    updateNavButtons(webview);
  }
}

/**
 * Fechar uma aba
 * @param {string} tabId - ID da aba a fechar
 */
function closeTab(tabId) {
  const tabIndex = tabs.findIndex(t => t.id === tabId);
  if (tabIndex === -1) return;

  const tab = tabs[tabIndex];
  const tabElement = document.getElementById(tabId);
  const webview = document.getElementById(tab.webviewId);

  if (tabElement) tabElement.remove();
  if (webview) webview.remove();

  tabs.splice(tabIndex, 1);

  // Se fechou a aba ativa
  if (activeTabId === tabId) {
    if (tabs.length > 0) {
      const nextTab = tabs[Math.max(0, tabIndex - 1)];
      const nextWebview = document.getElementById(nextTab.webviewId);
      activateTab(nextTab.id, nextWebview);
    } else {
      activeTabId = null;
      createTab();
    }
  }
}

/* ===================================
   NAVEGAÇÃO
   =================================== */

/**
 * Navegar para URL na barra de endereço
 */
function navigate() {
  if (!activeTabId) return;

  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;

  const webview = document.getElementById(tab.webviewId);
  const url = formatInputToUrl(addressInput.value);
  webview.loadURL(url);
}

/**
 * Voltar na história da aba ativa
 */
function goBack() {
  if (!activeTabId) return;
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) {
    const webview = document.getElementById(tab.webviewId);
    if (webview && typeof webview.canGoBack === 'function' && webview.canGoBack()) {
      webview.goBack();
    }
  }
}

/**
 * Avançar na história da aba ativa
 */
function goForward() {
  if (!activeTabId) return;
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) {
    const webview = document.getElementById(tab.webviewId);
    if (webview && typeof webview.canGoForward === 'function' && webview.canGoForward()) {
      webview.goForward();
    }
  }
}

/**
 * Recarregar a página atual
 */
function reload() {
  if (!activeTabId) return;
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) {
    const webview = document.getElementById(tab.webviewId);
    if (webview) webview.reload();
  }
}

/* ===================================
   ESTADO DA UI
   =================================== */

/**
 * Atualizar estado dos botões de voltar/avançar
 * @param {element} webview - Elemento webview
 */
function updateNavButtons(webview) {
  if (!webview) {
    backBtn.disabled = true;
    forwardBtn.disabled = true;
    return;
  }

  let canBack = false;
  let canForward = false;

  try {
    if (typeof webview.canGoBack === 'function') {
      canBack = webview.canGoBack();
    }
    if (typeof webview.canGoForward === 'function') {
      canForward = webview.canGoForward();
    }
  } catch (e) {
    // Se der erro, deixa tudo desabilitado
    console.error('Erro ao verificar histórico:', e);
  }

  backBtn.disabled = !canBack;
  forwardBtn.disabled = !canForward;
}

/* ===================================
   EVENT LISTENERS
   =================================== */

// Botão: Nova aba
newTabBtn.addEventListener('click', () => createTab());

// Barra de endereço
goBtn.addEventListener('click', navigate);
addressInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    navigate();
  }
});

// Botões de navegação
backBtn.addEventListener('click', goBack);
forwardBtn.addEventListener('click', goForward);
reloadBtn.addEventListener('click', reload);

/* ===================================
   INICIALIZAÇÃO
   =================================== */

// Criar primeira aba ao carregar
createTab();

// Receber pedido de "nova janela" (popup) vindo do main process
// e transformar em nova aba no navegador
if (window.electronAPI && typeof window.electronAPI.onWebviewNewWindow === 'function') {
  window.electronAPI.onWebviewNewWindow(({ url }) => {
    console.log('Abrindo popup em nova aba:', url);
    if (url) {
      createTab(url);
    }
  });
}

