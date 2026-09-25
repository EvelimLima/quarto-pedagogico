/**
 * bits.js — mostra a peça entregue e seus 4 bits rotulados.
 * Semente do visualizador de bits em tempo real (Sprint 2).
 */
import { LEGENDA, bit, bits, descrever } from '../logica/pecas.js';
import { pecaSVG } from './desenho.js';

const maiuscula = t => t.charAt(0).toUpperCase() + t.slice(1);

export function renderMao(el, estado) {
  if (estado.mao === null) {
    el.innerHTML = '<p class="mao-vazia">Nenhuma peça em mãos.</p>';
    return;
  }
  const id = estado.mao;
  el.innerHTML = `
    <div class="mao-peca">${pecaSVG(id)}</div>
    <div>
      <p class="mao-desc">${maiuscula(descrever(id))}</p>
      <div class="bits" role="img" aria-label="Bits ${bits(id)}">
        ${LEGENDA.map((a, i) => `<span class="bit"><b>${bit(id, i)}</b><small>${a.atributo}</small></span>`).join('')}
      </div>
    </div>`;
}
