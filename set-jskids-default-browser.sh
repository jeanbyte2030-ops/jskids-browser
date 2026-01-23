#!/usr/bin/env bash
set -e

echo ">>> Configurando JsKids Browser como navegador padrão..."

# Diretório do projeto (onde o script é executado)
PROJECT_DIR="$(pwd)"

# Caminhos
APPDIR="$PROJECT_DIR/dist"
APPIMAGE="$APPDIR/JsKids Browser-1.0.0.AppImage"
ICON_PATH="$PROJECT_DIR/assets/icon.png"

DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE="$DESKTOP_DIR/jskids-browser.desktop"

UNPACKED_BIN="$APPDIR/linux-unpacked/jskids-browser"

echo ">>> Projeto:"
echo "    $PROJECT_DIR"
echo ">>> AppImage:"
echo "    $APPIMAGE"
echo ">>> Ícone:"
echo "    $ICON_PATH"

# Verificações
if [ ! -f "$APPIMAGE" ]; then
  echo "ERRO: AppImage não encontrado!"
  exit 1
fi

if [ ! -f "$ICON_PATH" ]; then
  echo "ERRO: Ícone não encontrado!"
  echo "Esperado em: $ICON_PATH"
  exit 1
fi

# Permissões
chmod +x "$APPIMAGE"

# Criar pasta de applications
mkdir -p "$DESKTOP_DIR"

echo ">>> Criando .desktop..."

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Name=JsKids Browser
Comment=Navegador JsKids
Exec="$APPIMAGE" %u
Terminal=false
Type=Application
Icon=$ICON_PATH
Categories=Network;WebBrowser;
MimeType=text/html;x-scheme-handler/http;x-scheme-handler/https;
StartupNotify=true
EOF

chmod +x "$DESKTOP_FILE"

# Atualiza banco de apps
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$DESKTOP_DIR" || true
fi

# Define como navegador padrão
echo ">>> Definindo como navegador padrão..."
xdg-settings set default-web-browser jskids-browser.desktop || true

# Associa MIME types
echo ">>> Associando MIME types..."
xdg-mime default jskids-browser.desktop x-scheme-handler/http
xdg-mime default jskids-browser.desktop x-scheme-handler/https
xdg-mime default jskids-browser.desktop text/html

# update-alternatives (opcional, mas forte)
if [ -x "$UNPACKED_BIN" ]; then
  echo ">>> Registrando no update-alternatives..."
  sudo update-alternatives --install /usr/bin/x-www-browser x-www-browser "$UNPACKED_BIN" 50
  sudo update-alternatives --set x-www-browser "$UNPACKED_BIN"
fi

echo
echo ">>> CONFIGURAÇÃO FINALIZADA COM SUCESSO!"
echo "Navegador padrão atual:"
xdg-settings get default-web-browser

echo
echo "Teste agora:"
echo "  xdg-open https://www.google.com"

