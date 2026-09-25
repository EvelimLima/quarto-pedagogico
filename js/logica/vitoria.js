/**
 * vitoria.js — verificação de vitória.
 * Lógica pura: não acessa o DOM.
 *
 * O tabuleiro é um array de 16 posições (índice = linha * 4 + coluna),
 * com o ID da peça ou null quando a casa está vazia.
 */

/** As 10 linhas vencedoras: 4 linhas, 4 colunas e 2 diagonais. */
export const LINHAS = [
  ...[0, 1, 2, 3].map(r => ({ nome: `Linha ${r + 1}`,  casas: [0, 1, 2, 3].map(c => r * 4 + c) })),
  ...[0, 1, 2, 3].map(c => ({ nome: `Coluna ${c + 1}`, casas: [0, 1, 2, 3].map(r => r * 4 + c) })),
  { nome: 'Diagonal principal',  casas: [0, 5, 10, 15] },
  { nome: 'Diagonal secundária', casas: [3, 6, 9, 12] },
];

/**
 * Atributos em comum entre peças, usando operações bit a bit:
 *   "todas têm 1 naquele bit" = AND de todas as peças
 *   "todas têm 0 naquele bit" = AND dos complementos (~peça)
 * Devolve uma lista de { i, valor }, onde i é o índice na LEGENDA.
 */
export function atributosComuns(ids) {
  let todosUm = 0b1111;
  let todosZero = 0b1111;
  for (const id of ids) {
    todosUm &= id;
    todosZero &= ~id & 0b1111;
  }
  const comuns = [];
  for (let i = 0; i < 4; i++) {
    const b = 3 - i;
    if ((todosUm >> b) & 1) comuns.push({ i, valor: 1 });
    if ((todosZero >> b) & 1) comuns.push({ i, valor: 0 });
  }
  return comuns;
}

/** Todas as linhas completas que têm pelo menos um atributo em comum. */
export function linhasVencedoras(tabuleiro) {
  const resultado = [];
  for (const linha of LINHAS) {
    const ids = linha.casas.map(c => tabuleiro[c]);
    if (ids.some(id => id === null)) continue;
    const comuns = atributosComuns(ids);
    if (comuns.length > 0) resultado.push({ ...linha, comuns });
  }
  return resultado;
}
