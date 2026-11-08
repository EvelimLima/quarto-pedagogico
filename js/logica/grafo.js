/**
 * grafo.js — o "mapa mágico" de uma linha do tabuleiro.
 * Lógica pura: não acessa o DOM.
 *
 * Para cada atributo (cor, altura, forma, estrutura) monta um grafo:
 *   - cada peça da linha é um NÓ;
 *   - uma ARESTA liga duas peças que têm o MESMO bit naquele atributo.
 *
 * A linha vence por um atributo exatamente quando o grafo desse atributo
 * é COMPLETO: todas as peças ligadas a todas as outras.
 * Com 4 nós, um grafo completo tem 4 × 3 / 2 = 6 arestas.
 */
import { LEGENDA, bit } from './pecas.js';

/** Número de arestas de um grafo completo com n nós: n(n-1)/2. */
export const arestasDoCompleto = n => (n * (n - 1)) / 2;

/**
 * Grafo de um atributo.
 * @param {number[]} ids  peças da linha (IDs de 0 a 15)
 * @param {number} i      índice do atributo na LEGENDA
 * @returns {{ atributo: number, valores: number[], arestas: [number, number][],
 *             grupos: [number[], number[]], completo: boolean }}
 *   valores: o bit de cada peça naquele atributo
 *   arestas: pares de posições (0 a 3) ligados
 *   grupos:  posições com bit 0 e posições com bit 1
 */
export function grafoDoAtributo(ids, i) {
    const valores = ids.map(id => bit(id, i));
    const arestas = [];
    for (let a = 0; a < ids.length; a++) {
    for (let b = a + 1; b < ids.length; b++) {
        if (valores[a] === valores[b]) arestas.push([a, b]);
    }
    }
    const grupos = [[], []];
    valores.forEach((v, pos) => grupos[v].push(pos));
    return {
    atributo: i,
    valores,
    arestas,
    grupos,
    completo: arestas.length === arestasDoCompleto(ids.length),
    };
}

/** Os 4 grafos de uma linha, um por atributo, na ordem da LEGENDA. */
export function grafosDaLinha(ids) {
    return LEGENDA.map((_, i) => grafoDoAtributo(ids, i));
}