/**
 * painel.js — de quem é a vez, placar e janela de fim de partida.
 */
import { LEGENDA, bit, bits, descrever } from '../logica/pecas.js';
import { POVOS } from '../logica/regras.js';
import { LINHAS } from '../logica/vitoria.js';
import { pecaSVG } from './desenho.js';

const COR_POVO = ['var(--tf-forte)', 'var(--ig-forte)'];

/** Emblemas dos povos (SVG, traço claro sobre a cor do povo). */
export const EMBLEMA = [
  //terra Firme: Samaúma, com copa larga em camadas e raízes tabulares
  `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M30 22h4v26h-4z" fill="currentColor"/>
    <path d="M30 44c-3 6-9 10-16 12h36c-7-2-13-6-16-12z" fill="currentColor"/>
    <path d="M32 26l-9-6M32 24l10-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="14" cy="17" r="7" fill="currentColor"/>
    <circle cx="24" cy="12" r="8" fill="currentColor"/>
    <circle cx="36" cy="10" r="8.5" fill="currentColor"/>
    <circle cx="48" cy="13" r="7.5" fill="currentColor"/>
    <circle cx="54" cy="19" r="5" fill="currentColor"/>
    <circle cx="8" cy="21" r="4.5" fill="currentColor"/>
    <path d="M6 20h52v4H6z" fill="currentColor"/>
  </svg>`,
  // Igarapé: peixe sobre as ondas
  `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path d="M12 28c8-10 24-10 32 0-8 10-24 10-32 0z" fill="currentColor"/>
    <path d="M44 28l10-8v16z" fill="currentColor"/>
    <circle cx="20" cy="26" r="2.2" fill="var(--emblema-fundo)"/>
    <path d="M6 46c5-4 9-4 13 0s9 4 13 0 9-4 13 0 9 4 13 0" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M10 55c5-4 9-4 13 0s9 4 13 0 9-4 13 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  </svg>`,
];

let ultimaVez = null; // para animar só quando a vez troca

export function renderVez(el, estado) {
  const { resultado, fase, vez } = estado;
  let povo, titulo, passo, texto;

  if (resultado?.tipo === 'vitoria') {
    povo = resultado.povo;
    titulo = `Vitória dos ${POVOS[povo].nome}!`;
    passo = 'Fim da partida';
    texto = 'Toque em Nova partida para jogar outra vez.';
  } else if (resultado?.tipo === 'empate') {
    povo = null;
    titulo = 'Empate na clareira';
    passo = 'Fim da partida';
    texto = 'Ninguém completou uma linha.';
  } else {
    povo = vez;
    titulo = `Vez do ${POVOS[vez].curto}`;
    passo = fase === 'escolher' ? 'Passo 1 de 2' : 'Passo 2 de 2';
    texto = fase === 'escolher'
      ? `Escolham na reserva a peça que o ${POVOS[1 - vez].curto} vai colocar.`
      : 'Coloquem a peça entregue em uma casa vazia.';
  }

  const cor = povo === null ? 'var(--empate)' : COR_POVO[povo];
  el.style.setProperty('--cor-vez', cor);
  document.querySelector('.jogo')?.style.setProperty('--cor-vez', cor);

  el.innerHTML = `
    <span class="vez-emblema">${povo === null ? '' : EMBLEMA[povo]}</span>
    <span class="vez-texto">
      <small class="vez-passo">${passo}</small>
      <strong>${titulo}</strong>
      <span>${texto}</span>
    </span>`;

  // anima a faixa quando muda de povo (ou quando a partida termina)
  const chave = `${povo}-${resultado ? 'fim' : ''}`;
  if (ultimaVez !== null && chave !== ultimaVez) {
    el.classList.remove('chegou');
    void el.offsetWidth; // reinicia a animação
    el.classList.add('chegou');
  }
  ultimaVez = chave;
}

export function renderPlacar(el, placar) {
  el.innerHTML = `<span>Terra Firme <b>${placar[0]}</b></span><span>Igarapé <b>${placar[1]}</b></span><span>Empates <b>${placar[2]}</b></span>`;
}


/** Mini-tabuleiro 4×4 com as casas da linha destacadas. */
function mapaLinha(casas) {
  const marcadas = new Set(casas);
  const celulas = Array.from({ length: 16 }, (_, i) => `<i${marcadas.has(i) ? ' class="on"' : ''}></i>`).join('');
  return `<span class="mapa-linha" aria-hidden="true">${celulas}</span>`;
}

/**
 * Tabela de bits de uma linha vencedora: uma peça por linha da tabela,
 * um atributo por coluna. A coluna do atributo em comum fica destacada.
 */
function tabelaVitoria(linha, tabuleiro) {
  const ids = linha.casas.map(c => tabuleiro[c]);
  const comum = new Map(linha.comuns.map(c => [c.i, c.valor]));
  const cls = i => (comum.has(i) ? ' class="comum"' : '');

  const cabecalho = `<tr><th scope="col">Peça</th>${LEGENDA.map((a, i) => `<th scope="col"${cls(i)}>${a.atributo}</th>`).join('')}</tr>`;
  const corpo = ids.map(id => `
    <tr>
      <th scope="row"><span class="mini" aria-hidden="true">${pecaSVG(id)}</span><span class="sr">${descrever(id)}</span><code>${bits(id)}</code></th>
      ${LEGENDA.map((_, i) => `<td${cls(i)}>${bit(id, i)}</td>`).join('')}
    </tr>`).join('');
  const rodape = `<tr><th scope="row">Resultado</th>${LEGENDA.map((_, i) =>
    comum.has(i) ? `<td class="comum">todas ${comum.get(i)}</td>` : '<td class="misto">0 e 1</td>').join('')}</tr>`;

  const frases = linha.comuns.map(c =>
    `o bit de <b>${LEGENDA[c.i].atributo}</b> é <b>${c.valor}</b> nas 4 peças (todas ${LEGENDA[c.i].longo[c.valor]})`
  ).join('; e ');

  return `
    <h3 class="fim-linha">${mapaLinha(linha.casas)}<span>${linha.nome} do tabuleiro</span></h3>
    <div class="tabela-bits-caixa">
      <table class="tabela-bits"><thead>${cabecalho}</thead><tbody>${corpo}</tbody><tfoot>${rodape}</tfoot></table>
    </div>
    <p>Na ${linha.nome.toLowerCase()}, ${frases}.</p>`;
}

/**no empate: o tabuleiro final escrito em bits e a conferência das 10 linhas. */
function bitsEmpate(tabuleiro) {
  const grade = tabuleiro.map(id => `<code>${bits(id)}</code>`).join('');
  const linhas = LINHAS.map(l =>
    `<li><b>${l.nome}:</b> ${l.casas.map(c => `<code>${bits(tabuleiro[c])}</code>`).join(' ')}</li>`
  ).join('');
  return `
    <h3 class="fim-linha">A clareira em bits</h3>
    <div class="grade-bits" role="img" aria-label="Tabuleiro final em bits">${grade}</div>
    <p>Em todas as 10 linhas, cada posição de bit aparece com 0 e 1 misturados: nenhum atributo se repete nas 4 peças.</p>
    <details class="conferir">
      <summary>Conferir linha por linha</summary>
      <ul class="lista-bits">${linhas}</ul>
    </details>`;
}

export function preencherFim(tituloEl, textoEl, resultado, tabuleiro) {
  if (resultado.tipo === 'vitoria') {
    tituloEl.textContent = `Vitória dos ${POVOS[resultado.povo].nome}!`;
    textoEl.innerHTML = `<p>A peça que completou a linha foi entregue pelo ${POVOS[1 - resultado.povo].curto}.</p>`
      + resultado.linhas.map(l => tabelaVitoria(l, tabuleiro)).join('');
  }
  else {
    tituloEl.textContent = 'Empate na clareira';
    textoEl.innerHTML = '<p>As 16 moradas foram ocupadas sem nenhuma linha com característica em comum. Com dois jogadores perfeitos, todo QUARTO termina assim.</p>'
      + bitsEmpate(tabuleiro);
  }
}
