# ✉️ Mensage.IA - Dê o tom, nós damos o texto.

![Mensage.IA Preview](preview.png)

**Mensage.IA** é uma aplicação web inteligente projetada para ajudar você a encontrar as palavras perfeitas para qualquer momento. Seja um aniversário, um agradecimento ou uma mensagem profissional, nossa IA cria textos personalizados em segundos.

---

## 🌟 Funcionalidades

- **Categorias Inteligentes**: Escolha entre Aniversário, Promoção, Agradecimento, Condolências e muito mais.
- **Tons Personalizados**: Defina se a mensagem deve ser Carinhosa, Formal, Engraçada ou Inspiradora.
- **Ajuste de Comprimento**: Gere mensagens Curtas, Médias ou Longas.
- **Contexto Extra**: Adicione detalhes específicos para uma personalização única.
- **Compartilhamento Rápido**: Botão dedicado para copiar ou enviar direto para o **WhatsApp**.
- **Modo Dark/Light**: Interface moderna e confortável para qualquer horário.

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5 Semântico, CSS3 Moderno (Variáveis e Flexbox/Grid) e JavaScript Vanilla.
- **Backend**: [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno runtime).
- **Inteligência Artificial**: [Google Gemini 1.5 Flash](https://aistudio.google.com/app/apikey) (via Google Generative AI API).
- **Ícones**: [Phosphor Icons](https://phosphoricons.com/).
- **Automação**: GitHub Actions para CI/CD (Deploy Automático).

## 🛡️ Segurança e Performance

O projeto utiliza uma arquitetura de **Edge Computing**. Isso significa que sua chave de API da IA nunca é exposta no navegador (frontend). Todas as requisições passam por uma função servidora segura no Supabase, garantindo que seu projeto seja escalável e protegido.

## 🛠️ Como rodar o projeto localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/mensage-ia.git
```

2. Abra o arquivo `index.html` diretamente no seu navegador ou use o **Live Server**.

3. Para configurar seu próprio backend:
   - Crie um projeto no [Supabase](https://supabase.com/).
   - Obtenha uma chave no [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Configure os segredos no Supabase:
     ```bash
     supabase secrets set GEMINI_API_KEY=sua_chave_aqui
     ```
   - Faça o deploy da função:
     ```bash
     supabase functions deploy generate-message
     ```

---

## 📄 Licença

Este projeto é para fins de estudo e prática. Sinta-se à vontade para usá-lo e melhorá-lo!

---

**Desenvolvido com ❤️ e Inteligência Artificial.**
