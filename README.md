<p align="center">
  <img src="public/favicon.svg" width="60" />
</p>

<h1 align="center">alado</h1>

<p align="center">
  <strong>Disparo de emails em massa via AWS SES, direto do navegador.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-blue" />
  <img src="https://img.shields.io/badge/typescript-5.9-blue" />
  <img src="https://img.shields.io/badge/vite-8-purple" />
  <img src="https://img.shields.io/badge/tailwind-4-cyan" />
  <img src="https://img.shields.io/badge/aws--ses-v3-orange" />
</p>

---

## A historia

Na mitologia grega, **Hermes** era o mensageiro dos deuses do Olimpo. Com suas sandalias aladas — as **Talaria** — ele cruzava o mundo em instantes, levando mensagens entre o divino e o mortal. Nenhuma mensagem se perdia. Nenhuma chegava atrasada.

**alado** carrega esse espirito. E uma ferramenta simples e direta para quem precisa enviar emails em massa usando o AWS SES, sem backends, sem servidores, sem complicacao. Voce abre no navegador, configura suas credenciais, escolhe os destinatarios e dispara. Quando fecha a aba, tudo desaparece — como se Hermes nunca tivesse passado por ali.

Sem rastros. Sem dados persistidos. So as mensagens entregues.

---

## O que e

Uma aplicacao **frontend-only** (React + Vite + TypeScript) que se conecta diretamente ao AWS SES pelo browser. Nao existe backend. Nao existe banco de dados. Suas credenciais AWS vivem apenas na memoria do React e morrem quando voce fecha o app.

### Funcionalidades

- **Configuracao AWS** — Access Key, Secret Key e regiao SES
- **Composicao de email** — remetente, assunto e upload de template HTML com preview ao vivo
- **Gestao de destinatarios** — cole emails no textarea ou importe via CSV/TXT, com validacao automatica e remocao de duplicatas
- **Disparo com controle** — rate limiting configuravel, barra de progresso em tempo real, botao de cancelamento e relatorio de sucesso/falha por email
- **Zero persistencia** — nada em localStorage, sessionStorage ou cookies

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Componentes | shadcn/ui (customizados) |
| Icons | Lucide React |
| AWS | @aws-sdk/client-ses v3 |

---

## Inicio rapido

```bash
# Clone o repositorio
git clone https://github.com/viaiv/alado.git
cd alado

# Instale as dependencias
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Como usar

O app funciona como um wizard de 4 etapas:

### 1. Credenciais AWS
Informe sua **Access Key ID**, **Secret Access Key** e a **regiao** onde seu SES esta configurado. Um alerta informa que nada e armazenado.

### 2. Configuracao do Email
Defina o **remetente** (deve ser verificado no SES), o **assunto** e faca upload do **template HTML**. Um preview renderizado aparece automaticamente em um iframe isolado (sandbox).

### 3. Destinatarios
Cole emails diretamente no textarea (separados por virgula, ponto e virgula ou quebra de linha) ou importe um arquivo **.csv** / **.txt**. O parser extrai emails validos, remove duplicatas e lista os invalidos.

### 4. Enviar
Revise o resumo, configure a **velocidade de envio** (emails/segundo) e dispare. Acompanhe o progresso em tempo real e veja o resultado individual de cada email. Pode cancelar a qualquer momento.

---

## Estrutura do projeto

```
src/
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input, etc.)
│   ├── aws-config.tsx      # Formulario de credenciais AWS
│   ├── email-config.tsx    # Configuracao do email + upload HTML
│   ├── header.tsx          # Header com logo das sandalias aladas
│   ├── recipients.tsx      # Textarea + upload CSV/TXT
│   └── send-panel.tsx      # Painel de envio + progresso
├── lib/
│   ├── email-sender.ts     # Logica de disparo com rate limiting
│   ├── parse-recipients.ts # Parser e validacao de emails
│   ├── ses-client.ts       # Fabrica do SESClient
│   └── utils.ts            # Utilitario cn() para classnames
├── App.tsx                 # Layout principal com stepper
├── main.tsx                # Entry point
└── index.css               # Theme e animacoes
```

---

## Limites do SES

| Modo | Rate | Limite diario |
|------|------|---------------|
| **Sandbox** | 1 email/seg | 200 emails/dia |
| **Producao** | ~14 emails/seg | Varia por conta |

O app permite configurar a velocidade de envio para respeitar os limites da sua conta. No modo sandbox do SES, tanto o remetente quanto os destinatarios precisam ser emails verificados.

---

## Seguranca

- Credenciais AWS ficam **apenas em React state** (memoria RAM)
- **Nenhum dado** e salvo em localStorage, sessionStorage ou cookies
- Preview de HTML renderizado em `<iframe sandbox="">` para prevenir XSS
- Ao fechar a aba ou o navegador, tudo e destruido

---

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de producao (tsc + vite build)
npm run preview   # Preview do build de producao
npm run lint      # Linting com ESLint
```

---

## Licenca

MIT

---

<p align="center">
  <sub>Construido com as sandalias de Hermes.</sub>
</p>
