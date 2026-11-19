# TEApoia — Frontend demonstrativo

Este pacote contém somente a interface do TEApoia, reorganizada como um projeto Next.js independente.

## O que está incluído
- Telas, componentes, estilos, ícones e imagens do aplicativo.
- Navegação e interações visuais.
- Dados de demonstração armazenados localmente no navegador (`localStorage`).
- Fluxos simulados de cadastro, login, recuperação de acesso e privacidade.

## O que não está incluído
- Payload CMS, painel administrativo ou banco de dados.
- APIs de autenticação, sincronização ou serviços externos.
- Envio real de e-mails, confirmação real de conta ou login social.

## Executar localmente
Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

**Atenção:** esta versão é apenas para prototipagem e demonstração. Não use dados pessoais reais. O login é simulado: qualquer e-mail e senha preenchidos permitem testar o fluxo.
