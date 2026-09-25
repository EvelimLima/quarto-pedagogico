/**
 * tabuleiro.js — desenha o tabuleiro 4×4 e a reserva de peças.
 */
import { TODAS_AS_PECAS, bits, descrever } from '../logica/pecas.js';
import { pecaSVG } from './desenho.js';

export function renderTabuleiro(el, estado) {
  const vencedoras = new Set(
    (estado.resultado?.linhas ?? []).flatMap(l => l.casas)
  );

  el.innerHTML = estado.tabuleiro.map((peca, i) => {
    const r = Math.floor(i / 4) + 1, c = (i % 4) + 1;
    const livre = estado.fase === 'posicionar' && peca === null;
    const rotulo = peca === null
      ? `Casa vazia, linha ${r}, coluna ${c}`
      : `Linha ${r}, coluna ${c}: peça ${descrever(peca)}`;
    const classes = ['casa', livre && 'livre', vencedoras.has(i) && 'vence'].filter(Boolean).join(' ');
    return `<button type="button" class="${classes}" data-casa="${i}" aria-label="${rotulo}"${livre ? '' : ' aria-disabled="true"'}>${peca === null ? '' : pecaSVG(peca)}</button>`;
  }).join('');
}

export function renderReserva(el, estado) {
  const pode = estado.fase === 'escolher';
  el.setAttribute('aria-disabled', String(!pode));
  el.innerHTML = TODAS_AS_PECAS.map(id => {
    if (!estado.reserva.includes(id)) return '<span class="ficha usada" aria-hidden="true"></span>';
    return `<button type="button" class="ficha${pode ? ' disponivel' : ''}" data-peca="${id}" aria-label="Peça ${descrever(id)}, bits ${bits(id)}"${pode ? '' : ' aria-disabled="true"'}>${pecaSVG(id)}</button>`;
  }).join('');
}
