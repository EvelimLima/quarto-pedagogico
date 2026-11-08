// Confere a lista de arquivos do modo offline. Rodar com: npm test
// Se faltar um arquivo na lista, o jogo funciona online mas QUEBRA offline.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url)); // funciona no Windows também
const sw = readFileSync(join(RAIZ, 'service-worker.js'), 'utf8');
const lista = [...sw.match(/const ARQUIVOS = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);

/** Arquivos do jogo que precisam estar disponíveis offline. */
function arquivosDoJogo(pasta = '', saida = []) {
  for (const item of readdirSync(join(RAIZ, pasta), { withFileTypes: true })) {
    const caminho = pasta ? `${pasta}/${item.name}` : item.name;
    if (item.isDirectory()) {
      if (['js', 'css', 'assets', 'assets/fonts', 'assets/icons', 'js/logica', 'js/tela'].includes(caminho)) arquivosDoJogo(caminho, saida);
    } else if (/\.(html|css|js|woff2|png|webmanifest)$/.test(caminho) && caminho !== 'service-worker.js') {
      saida.push(`./${caminho}`);
    }
  }
  return saida;
}

test('todo arquivo do jogo está na lista do modo offline', () => {
  const faltando = arquivosDoJogo().filter(a => !lista.includes(a));
  assert.deepEqual(faltando, [], `Acrescente em ARQUIVOS (service-worker.js): ${faltando.join(', ')}`);
});

test('todo item da lista do modo offline existe', () => {
  const inexistentes = lista.filter(a => a !== './' && !existsSync(join(RAIZ, a)));
  assert.deepEqual(inexistentes, [], `Remova ou corrija em ARQUIVOS: ${inexistentes.join(', ')}`);
});

test('manifest aponta para ícones que existem', () => {
  const manifest = JSON.parse(readFileSync(join(RAIZ, 'manifest.webmanifest'), 'utf8'));
  for (const icone of manifest.icons) assert.ok(existsSync(join(RAIZ, icone.src)), icone.src);
});
