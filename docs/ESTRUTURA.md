# Estrutura do Projeto

## Visão Geral

Este documento detalha a estrutura de arquivos e diretórios do projeto de login moderno utilizando React e Material-UI.

## Árvore de Arquivos

```text
📁 .
├── 📁 src/                               # Código fonte da aplicação
│   ├── 📁 components/                    # Componentes reutilizáveis
│   │   └── 📄 Layout.jsx                 # Componente de layout principal com drawer e AppBar
│   │
│   ├── 📁 contexts/                      # Contextos do React para gerenciamento de estado
│   │   ├── 📄 AuthContext.jsx            # Contexto de autenticação
│   │   └── 📄 DashboardContext.jsx       # Contexto do dashboard
│   │
│   ├── 📁 pages/                         # Páginas da aplicação
│   │   ├── 📁 dashboard/                 # Componentes relacionados ao dashboard
│   │   ├── 📁 login/                     # Componentes relacionados ao login
│   │   ├── 📁 settings/                  # Componentes de configurações
│   │   ├── 📁 events/                    # Componentes de eventos
│   │   └── 📁 users/                     # Componentes de usuários
│   │
│   ├── 📁 routes/                        # Configuração de rotas
│   │   └── 📄 index.jsx                  # Definição das rotas da aplicação
│   │
│   ├── 📄 App.jsx                        # Componente raiz da aplicação
│   ├── 📄 index.js                       # Ponto de entrada da aplicação
│   └── 📄 theme.js                       # Configuração do tema Material-UI
│
├── 📁 public/                            # Arquivos públicos estáticos
│   └── 📄 index.html                     # HTML principal
│
├── 📁 docs/                              # Documentação do projeto
│   └── 📄 ESTRUTURA.md                   # Este arquivo - documentação da estrutura
│
├── 📄 package.json                       # Configuração do projeto e dependências
├── 📄 package-lock.json                  # Versões específicas das dependências
├── 📄 .gitignore                         # Arquivos ignorados pelo git
├── 📄 .prettierrc                        # Configuração do Prettier
├── 📄 .prettierignore                    # Arquivos ignorados pelo Prettier
├── 📄 .markdownlint.json                 # Configuração do Markdownlint
├── 📄 eslint.config.js                   # Configuração do ESLint
├── 📄 setup-markdownlint-eslint.cmd      # Script de configuração do ambiente
└── 📄 start.cmd                          # Script para iniciar o projeto
```

## Detalhamento dos Componentes

### Componentes Principais (src/)

#### Components

- **Layout.jsx**: Componente principal de layout que inclui:
  - AppBar superior com título dinâmico
  - Drawer lateral responsivo
  - Sistema de navegação
  - Área de conteúdo principal

#### Contexts

- **AuthContext.jsx**: Gerenciamento de autenticação
  - Login/Logout
  - Estado de autenticação
  - Gestão de erros de autenticação
  - Proteção de rotas

- **DashboardContext.jsx**: Gerenciamento do estado do dashboard
  - Estado do drawer (aberto/fechado)
  - Configurações do dashboard

#### Pages

Organização das páginas principais da aplicação:

- **dashboard/**: Página inicial após login
- **login/**: Página de autenticação
- **settings/**: Configurações do sistema
- **events/**: Gerenciamento de eventos
- **users/**: Gerenciamento de usuários

#### Routes

- **index.jsx**: Configuração central de rotas
  - Rotas protegidas
  - Redirecionamentos
  - Estrutura de navegação

#### Arquivos Base

- **App.jsx**: Componente raiz que configura:
  - Providers (Auth, Dashboard)
  - Tema Material-UI
  - Router
  
- **theme.js**: Configuração do tema Material-UI
  - Paleta de cores
  - Tipografia
  - Componentes customizados

### Configuração e Scripts

#### Dependências e Configuração

- **package.json**: Configuração do projeto
  - Dependências principais:
    - React
    - Material-UI
    - React Router
    - Formik (formulários)
    - Yup (validação)

#### Scripts

- **start.cmd**: Script de inicialização que:
  - Instala dependências
  - Inicia o servidor de desenvolvimento
  - Gerencia erros de execução

#### Ferramentas de Desenvolvimento

- **.prettierrc**: Configuração de formatação de código
- **eslint.config.js**: Regras de linting
- **.markdownlint.json**: Formatação de documentação

## Padrões de Desenvolvimento

### Estilo e Formatação

- Uso do Prettier para formatação consistente
- ESLint para qualidade de código
- Markdownlint para documentação padronizada

### Estrutura de Componentes

- Componentes funcionais com hooks
- Contextos para gerenciamento de estado
- Rotas protegidas por autenticação

### Material-UI

- Tema personalizado
- Componentes responsivos
- Drawer adaptativo
- Sistema de grid flexível

## Observações Técnicas

1. **Autenticação**
   - Sistema de login baseado em contexto
   - Proteção de rotas
   - Gestão de sessão

2. **Layout**
   - Design responsivo
   - Drawer lateral adaptativo
   - AppBar com navegação

3. **Estado**
   - Gerenciamento via Context API
   - Estados isolados por contexto
   - Compartilhamento eficiente de dados

4. **Roteamento**
   - Sistema de rotas protegidas
   - Redirecionamentos automáticos
   - Navegação integrada ao layout
