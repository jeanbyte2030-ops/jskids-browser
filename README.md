# JsKids Browser

🔒 **Navegador Seguro e Controlado** para Educação, Trabalho e Ambientes Corporativos

Um navegador moderno desenvolvido com Electron, focado em segurança, controle parental, monitoramento e ambientes de aprendizagem. Perfeito para instituições educacionais, ambientes corporativos e famílias que buscam internet segura.

## 🎯 Características Principais

### 🔐 Segurança
- ✅ Isolamento de contexto de segurança (Preload)
- ✅ Proteção contra scripts maliciosos
- ✅ Controle de permissões de site
- ✅ Sandbox de aplicação

### 👶 Controle Parental
- ✅ Gerenciamento de abas e navegação
- ✅ Histórico rastreável
- ✅ Controle de acesso a sites
- ✅ Monitoramento de atividades

### 💼 Ambiente Corporativo
- ✅ Modo kiosk para terminais públicos
- ✅ Bloqueio de sites específicos
- ✅ Registros de navegação
- ✅ Configuração centralizada

### 🎓 Educação
- ✅ Ambiente controlado para alunos
- ✅ Suporte a plataformas de aprendizagem
- ✅ Recursos colaborativos integrados
- ✅ Integração com LMS

### 🚀 Funcionalidades
- ✅ Abas personalizadas
- ✅ Navegação (voltar, avançar, recarregar)
- ✅ Barra de endereços inteligente
- ✅ Busca integrada no Google
- ✅ Suporte a múltiplas abas
- ✅ Gerenciador de sessões
- ✅ Cache inteligente

## 🔧 Requisitos

- Node.js 16+
- npm ou yarn
- Linux, macOS ou Windows 10+

## 📥 Instalação

```bash
# Clone o repositório
git clone https://github.com/jeanbyte2030-ops/jskids-browser.git
cd jskids-browser

# Instale as dependências
npm install
# ou
yarn install
```

## 🚀 Executar

```bash
# Modo desenvolvimento
npm start
# ou
yarn start
```

## 🔨 Build

```bash
# Build para Linux (AppImage)
npm run build:linux
yarn build:linux

# Build para Windows
npm run build:windows
yarn build:windows

# Build para macOS
npm run build:mac
yarn build:mac

# Build para todas as plataformas
npm run build:all
yarn build:all
```

## 📁 Estrutura do Projeto

```
jskids-browser/
├── main.js                      # Processo principal do Electron
├── renderer.js                  # Lógica da interface do usuário
├── preload.js                   # Bridge de segurança (IPC)
├── index.html                   # Estrutura HTML da aplicação
├── styles.css                   # Estilos CSS
├── package.json                 # Dependências e scripts
├── set-jskids-default-browser.sh # Script de configuração Linux
├── assets/                      # Ícones e recursos
└── dist/                        # Arquivos compilados (após build)
```

## ⚙️ Configuração

### Linux - Definir como Navegador Padrão

```bash
chmod +x set-jskids-default-browser.sh
./set-jskids-default-browser.sh
```

## 🔒 Segurança

Este navegador implementa boas práticas de segurança:

- **Context Isolation**: Isolamento entre main process e renderer
- **Preload Scripts**: Ponte segura para acesso a APIs nativas
- **Sandbox**: Cada abra rodando em sandbox isolado
- **Content Security Policy**: Proteção contra XSS
- **Permissões Granulares**: Controle fino de acesso

## 👥 Uso em Ambientes

### 🏫 Educação
- Salas de aula digitais
- Ambientes de aprendizagem online
- Testes e avaliações seguras
- Plataformas colaborativas

### 🏢 Corporativo
- Terminais de atendimento
- Salas de treinamento
- Ambientes de kiosk
- Monitoramento de conformidade

### 👨‍👩‍👧‍👦 Familiar
- Controle parental
- Proteção infantil
- Bloqueio de conteúdo inadequado
- Monitoramento de tempo online

## 📝 Licença

MIT License - Veja arquivo LICENSE para detalhes

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

**Jean Byte**  
📧 jeanbyte2030@gmail.com  
🐙 [GitHub](https://github.com/jeanbyte2030-ops)

## 📄 Changelog

### v1.0.0 - Janeiro 2026
- ✨ Lançamento inicial
- 🔐 Sistema de segurança implementado
- 📱 Suporte multiplataforma (Linux, Windows, macOS)
- 🛠️ Script de integração com sistema operacional

MIT - Desenvolvido por Jean Gomes

## 👨‍💻 Autor

Jean Gomes  
Email: jeanbyte2030@gmail.com
