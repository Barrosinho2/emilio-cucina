# Site do Emílio Cucina Contemporânea

Site estático (HTML, CSS e JS), sem build. A ordem das seções segue o qissa.co.uk; o código parte do site do Segredos do Marujo; o visual é o do kit do Emílio.

## Estrutura (Qissa → Emílio)

| Qissa | Emílio | O que mudou |
| --- | --- | --- |
| Cabeçalho: Menu, logo, Order e Reserve | Menu, assinatura, "As opções" e "Reservar" | Reservar abre o WhatsApp de reservas |
| Navegação numerada 00–06 | Numerada 00–08, fundo azul | Igual em estrutura |
| Hero com o forno desfocado ao fundo e o prato em primeiro plano | Bar desfocado ao fundo e a panela de feijoada em primeiro plano | A assinatura se escreve na abertura; a panela sobe ao rolar e acompanha o mouse |
| Our Story (foto da fachada + promessa) | A casa: fachada com faixas de papel rasgado, texto e "Seja bem-vindo à nossa casa" | |
| Masterpieces (slider de pratos) + faixa de palavras | Da nossa cucina: foto emoldurada sobre o próprio prato desfocado + faixa azul rasgada | O slider gira, arrasta e anda sozinho |
| The Cuisine (6 categorias) | As opções: almoço, feijoada, jantar, bar, eventos e deck pet friendly + "A semana no Emílio" | Seção ampliada para deixar as opções claras |
| From Our Kitchen | A cozinha: trilho horizontal fixado com quadros dos reels | |
| The Signatures (6 pratos + PDFs) | Primeira vez no Emílio? (entrada, principal, bebida, sobremesa, parmegiana e feijoada) + 3 cardápios em PDF | |
| The Tale So Far | A história até aqui: 4,8 no Google, 477 avaliações, 14,9 mil seguidores, 70 convidados | |
| The Room | Três ambientes | |
| Reviews | Avaliações (3 do site antigo + nota do Google) | |
| Private Dining | Eventos: "Sua empresa merece um brinde" | |
| Your Table Awaits (Dine in / At home) | Estamos te esperando: Reservar mesa / Orçar evento, com formulário que monta a mensagem do WhatsApp | O Emílio não tem delivery, então o segundo cartão virou eventos |
| Wordmark | Assinatura que se escreve com a rolagem | |
| Rodapé | Rodapé azul com horários e contatos | |

## Onde trocar dados

- **WhatsApp:** `assets/js/main.js`, no topo (`TEL_RES`, `TEL_EV` e as mensagens em `WA`). Os números visíveis estão no `index.html` (procure `99686-9645` e `99624-6436`).
- **Horários:** semana (`.week-grid`), opções (`.op-when`), rodapé (`.hours`) e menu. O "Aberto agora" e o destaque de "Hoje" são calculados na função `periods()` do `main.js`.
- **Preços:** procure `R$` no `index.html`.
- **Cardápios:** `assets/pdf/` (almoço, jantar e bar). Troque o arquivo mantendo o nome.
- **Cores e fontes:** `:root` no topo do `assets/css/style.css`. As fontes (Roboto e Sacramento) estão em `assets/fonts/`, sem depender do Google Fonts.
- **Logo:** `assets/svg/emilio-assinatura.svg`, vetorizada a partir do cartão final dos reels. O mesmo desenho está embutido no `index.html` (símbolo `#assinatura`).

## Pendências com o cliente

- Programa de fidelidade: não encontrei nenhum. Se existir, entra como bloco na seção "As opções".
- Confirmar os WhatsApps (o post fixado de setembro diz que 99624-6436 é reservas; Linktree, cardápios e Google dizem que é eventos).
- Fotos em alta dos ambientes (salão principal e garden só existem em baixa resolução) e vídeos originais dos reels.
- Autorização de imagem das pessoas que aparecem nas fotos e vídeos (clientes, modelos e a chef).
- Cardápios atualizados (os PDFs são de outubro de 2026).
