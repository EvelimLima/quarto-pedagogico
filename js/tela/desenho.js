/**
 * desenho.js — desenha uma peça em SVG (vista de cima) a partir dos seus bits.
 * Não há imagens: a peça é gerada pela sua representação binária.
 *
 *   alta     → maior e com sombra mais longa
 *   quadrada → trama de cesto de palha
 *   redonda  → anel de semente de Olho-de-Boi
 *   oca      → furo no centro
 */
import { bit } from '../logica/pecas.js';

export function pecaSVG(id) {
  const escura = bit(id, 0), alta = bit(id, 1), quadrada = bit(id, 2), oca = bit(id, 3);
  const fill  = escura ? '#3B2413' : '#EBCF9C';
  const borda = escura ? '#140B05' : '#8F6B38';
  const trama = escura ? '#6E4C2D' : '#B8904F';
  const t = alta ? 82 : 52;       // tamanho
  const o = (100 - t) / 2;        // margem
  const dy = alta ? 7 : 3;        // deslocamento da sombra

  const forma = (x, y, lado, attrs) => quadrada
    ? `<rect x="${x}" y="${y}" width="${lado}" height="${lado}" rx="${lado * 0.12}" ${attrs}/>`
    : `<circle cx="${x + lado / 2}" cy="${y + lado / 2}" r="${lado / 2}" ${attrs}/>`;

  let d = forma(o, o + dy, t, 'fill="rgba(0,0,0,.32)"');
  d += forma(o, o, t, `fill="${fill}" stroke="${borda}" stroke-width="2"`);

  if (quadrada) {
    for (let k = 1; k < 4; k++) {
      const p = o + (t * k) / 4;
      d += `<line x1="${p}" y1="${o + 3}" x2="${p}" y2="${o + t - 3}" stroke="${trama}" stroke-width="1.5"/>`;
      d += `<line x1="${o + 3}" y1="${p}" x2="${o + t - 3}" y2="${p}" stroke="${trama}" stroke-width="1.5"/>`;
    }
  } else {
    d += `<circle cx="50" cy="50" r="${t * 0.36}" fill="none" stroke="${trama}" stroke-width="1.5"/>`;
  }

  if (oca) {
    const h = t * 0.4, ho = (100 - h) / 2;
    d += forma(ho, ho, h, `fill="#150C06" stroke="${borda}" stroke-width="1.5"`);
  }

  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${d}</svg>`;
}
