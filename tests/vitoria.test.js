// Rodar com: npm test   (usa o test runner nativo do Node, sem dependências)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bits, descrever, TODAS_AS_PECAS } from '../js/logica/pecas.js';
import { LINHAS, atributosComuns, linhasVencedoras } from '../js/logica/vitoria.js';
import { criarPartida, escolherPeca, posicionarPeca } from '../js/logica/regras.js';

test('existem 16 peças, todas diferentes', () => {
  assert.equal(TODAS_AS_PECAS.length, 16);
  assert.equal(new Set(TODAS_AS_PECAS.map(bits)).size, 16);
});

test('a peça 1010 é escura, baixa, quadrada e maciça', () => {
  assert.equal(bits(10), '1010');
  assert.equal(descrever(10), 'escura, baixa, quadrada, maciça');
});

test('existem 10 linhas vencedoras', () => {
  assert.equal(LINHAS.length, 10);
});

test('encontra atributo comum com bit 1 (todas escuras)', () => {
  assert.deepEqual(atributosComuns([0b1010, 0b1110, 0b1011, 0b1000]), [{ i: 0, valor: 1 }]);
});

test('encontra atributo comum com bit 0 (todas maciças)', () => {
  assert.deepEqual(atributosComuns([0b0000, 0b0110, 0b1010, 0b1100]), [{ i: 3, valor: 0 }]);
});

test('peças complementares não têm nada em comum', () => {
  assert.deepEqual(atributosComuns([0b0000, 0b1111, 0b0101, 0b1010]), []);
});

test('linha incompleta não vence', () => {
  const t = Array(16).fill(null);
  t[0] = 4; t[1] = 5; t[2] = 6;
  assert.deepEqual(linhasVencedoras(t), []);
});

test('detecta vitória na diagonal principal', () => {
  const t = Array(16).fill(null);
  t[0] = 4; t[5] = 5; t[10] = 6; t[15] = 7; // todas claras e altas
  const [v] = linhasVencedoras(t);
  assert.equal(v.nome, 'Diagonal principal');
  assert.equal(v.comuns.length, 2);
});

test('quem coloca a peça vencedora é quem vence', () => {
  let e = criarPartida(0);
  // Terra Firme (0) entrega, Igarapé (1) coloca — repetido até completar a linha 1
  for (const [peca, casa] of [[4, 0], [5, 1], [6, 2]]) {
    e = escolherPeca(e, peca);
    e = posicionarPeca(e, casa);
    // depois de colocar, o mesmo povo escolhe para o outro
    e = escolherPeca(e, [8, 9, 10][casa]);
    e = posicionarPeca(e, 4 + casa);
  }
  e = escolherPeca(e, 7);
  const quemColoca = e.vez;
  e = posicionarPeca(e, 3);
  assert.equal(e.fase, 'fim');
  assert.equal(e.resultado.povo, quemColoca);
});

test('jogada inválida devolve o mesmo estado', () => {
  const e = criarPartida(0);
  assert.equal(posicionarPeca(e, 0), e);         // não pode colocar na fase de escolher
  const e2 = escolherPeca(e, 3);
  assert.equal(escolherPeca(e2, 5), e2);          // não pode escolher na fase de posicionar
});
