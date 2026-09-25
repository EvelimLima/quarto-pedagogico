# QUARTO Pedagógico Amazônico

Versão web do jogo QUARTO adaptado à narrativa amazônica do Pajé Timbira, usado para ensinar
Pensamento Computacional (reconhecimento de padrões binários e grafos) a estudantes do
9º ano em escolas públicas do Amazonas.

Projeto de extensão do Instituto de Computação da UFAM (IComp/UFAM), disciplina
ICC604 – Práticas Extensionistas em Computação.

**Autores:** Evelim Lopes Lima

## Como rodar

O projeto usa módulos JavaScript (`import`/`export`), que **não funcionam abrindo o
`index.html` com duplo clique** (o navegador bloqueia módulos em `file://`).
Use um servidor local:

- **VS Code:** extensão *Live Server* → botão direito no `index.html` → *Open with Live Server*
- **Terminal (Node instalado):** `npm run dev` e abra o endereço mostrado

Para testar no celular, conecte-o na mesma rede Wi-Fi e acesse o IP do computador
(ex.: `http://192.168.0.10:3000`).

## Testes

```bash
npm test
```

Usa o test runner nativo do Node (versão 18 ou superior), sem dependências.

## Estrutura

```
index.html            # jogo (tabuleiro, reserva, painel)
tutorial.html         # como jogar + legenda dos bits
css/style.css
assets/fonts/         # fontes locais (funcionam offline) — licença OFL
js/
  logica/             # lógica pura, SEM acesso ao DOM
    pecas.js          # legenda dos bits e as 16 peças
    vitoria.js        # linhas vencedoras e atributos em comum
    regras.js         # máquina de estados da partida
  tela/               # desenho na tela (DOM)
    desenho.js        # SVG de cada peça a partir dos bits
    tabuleiro.js      # tabuleiro 4×4 e reserva
    bits.js           # peça entregue e seus bits
    painel.js         # vez, placar, fim de partida
  main.js             # liga lógica e tela; guarda o estado
tests/
  vitoria.test.js
```

A separação entre `logica/` e `tela/` é intencional: os arquivos de `logica/` podem ser
testados sem navegador, convertidos para TypeScript e levados para o React sem reescrita.

## Legenda dos bits

Ordem dos bits: **cor, altura, forma, estrutura**.


| Característica | Bit 0                            | Bit 1                     |
| --------------- | -------------------------------- | ------------------------- |
| Cor             | Clara (Solimões)                | Escura (Rio Negro)        |
| Altura          | Baixa (Vitória-Régia)          | Alta (Samaúma)           |
| Forma           | Redonda (semente de Olho-de-Boi) | Quadrada (cesto de palha) |
| Estrutura       | Maciça                          | Oca (toca de bicho)       |

Exemplo: `1010` = escura, baixa, quadrada, maciça.
