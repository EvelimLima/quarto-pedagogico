// Testes do "mapa mágico". Rodar com: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TODAS_AS_PECAS } from '../js/logica/pecas.js';
import { atributosComuns } from '../js/logica/vitoria.js';
import { arestasDoCompleto, grafoDoAtributo, grafosDaLinha } from '../js/logica/grafo.js';

// Linha de exemplo do esboço: Coluna 4 com 0000, 0001, 1001, 0011 (todas baixas)
const COLUNA4 = [0b0000, 0b0001, 0b1001, 0b0011];
const ALTURA = 1, COR = 0, ESTRUTURA = 3;

test('grafo completo de 4 nós tem 6 arestas', () => {
    assert.equal(arestasDoCompleto(4), 6);
});

test('atributo vencedor gera grafo completo', () => {
    const g = grafoDoAtributo(COLUNA4, ALTURA);
    assert.deepEqual(g.valores, [0, 0, 0, 0]);
    assert.equal(g.arestas.length, 6);
    assert.equal(g.completo, true);
});

test('3 peças iguais e 1 diferente: triângulo e uma peça de fora', () => {
  const g = grafoDoAtributo(COLUNA4, COR); // cores 0, 0, 1, 0
    assert.deepEqual(g.arestas, [[0, 1], [0, 3], [1, 3]]);
    assert.deepEqual(g.grupos, [[0, 1, 3], [2]]);
    assert.equal(g.completo, false);
});

test('2 e 2: o grafo fica partido em dois pares', () => {
  const g = grafoDoAtributo([0b0000, 0b0001, 0b0010, 0b0011], ESTRUTURA); // 0, 1, 0, 1
    assert.deepEqual(g.arestas, [[0, 2], [1, 3]]);
    assert.equal(g.completo, false);
});

test('a linha tem um grafo por atributo', () => {
    const gs = grafosDaLinha(COLUNA4);
    assert.equal(gs.length, 4);
    assert.deepEqual(gs.map(g => g.completo), [false, true, false, false]);
});

test('em TODAS as 1820 linhas possíveis, grafo completo ⇔ atributo em comum', () => {
    let linhas = 0;
    const p = TODAS_AS_PECAS;
    for (let a = 0; a < 16; a++)
    for (let b = a + 1; b < 16; b++)
        for (let c = b + 1; c < 16; c++)
        for (let d = c + 1; d < 16; d++) {
            const ids = [p[a], p[b], p[c], p[d]];
            const pelosGrafos = grafosDaLinha(ids).filter(g => g.completo).map(g => g.atributo);
            const pelosBits = atributosComuns(ids).map(c => c.i).sort();
            assert.deepEqual(pelosGrafos, pelosBits, `linha ${ids}`);
            linhas++;
        }
  assert.equal(linhas, 1820); // C(16, 4)
});