/**
 * pecas.js — estrutura de dados das 16 peças regionalizadas.
 * Lógica pura: não acessa o DOM.
 *
 * Legenda única dos bits (ordem: cor, altura, forma, estrutura).
 * Exemplo: peça 10 = 1010 = escura, baixa, quadrada, maciça.
 * Para mudar a ordem dos bits, altere só a constante LEGENDA.
 */

export const LEGENDA = [
  { atributo: 'Cor',       curto: ['clara', 'escura'],     longo: ['claras, da cor do Solimões', 'escuras, da cor do Rio Negro'] },
  { atributo: 'Altura',    curto: ['baixa', 'alta'],       longo: ['baixas, como a Vitória-Régia', 'altas, como a Samaúma'] },
  { atributo: 'Forma',     curto: ['redonda', 'quadrada'], longo: ['redondas, como a semente de Olho-de-Boi', 'quadradas, como o cesto de palha trançada'] },
  { atributo: 'Estrutura', curto: ['maciça', 'oca'],       longo: ['maciças', 'ocas, como toca de bicho'] },
];

/** Os IDs das 16 peças: 0 (0000) a 15 (1111). 2 × 2 × 2 × 2 = 16. */
export const TODAS_AS_PECAS = Array.from({ length: 16 }, (_, id) => id);

/** Valor (0 ou 1) do atributo de índice i (posição na LEGENDA). */
export const bit = (id, i) => (id >> (3 - i)) & 1;

/** Cadeia de 4 bits da peça, ex.: 10 → "1010". */
export const bits = id => id.toString(2).padStart(4, '0');

/** Descrição curta, ex.: "escura, baixa, quadrada, maciça". */
export const descrever = id => LEGENDA.map((a, i) => a.curto[bit(id, i)]).join(', ');
