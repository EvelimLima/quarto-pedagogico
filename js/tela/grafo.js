/**
 * grafo.js (tela) — desenha o "mapa mágico" de uma linha vencedora.
 * Botões de atributo trocam o grafo exibido; a lógica vem de js/logica/grafo.js.
 */
import { LEGENDA, bits } from '../logica/pecas.js';
import { grafoDoAtributo } from '../logica/grafo.js';
import { pecaSVG } from './desenho.js';

const T = 320;                 // tamanho do desenho (viewBox)
const N = T * 0.115;           // raio do nó
const P = T * 0.21;            // margem até o centro dos nós
const POS = [[P, P], [T - P, P], [P, T - P], [T - P, T - P]]; // 4 nós em quadrado

const miolo = id => pecaSVG(id).replace(/^<svg[^>]*>|<\/svg>$/g, '');

/** SVG do grafo de um atributo. */
function svgGrafo(ids, g) {
    const arestas = g.arestas.map(([a, b]) => {
    const [x1, y1] = POS[a], [x2, y2] = POS[b];
    return `<line class="g-aresta${g.completo ? ' completa' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }).join('');

    const nos = ids.map((id, k) => {
    const [x, y] = POS[k];
    const bx = x + N * 0.78, by = y - N * 0.78;
    return `
        <circle class="g-no" cx="${x}" cy="${y}" r="${N}"/>
      <svg x="${x - N * 0.82}" y="${y - N * 0.82}" width="${N * 1.64}" height="${N * 1.64}" viewBox="0 0 100 100">${miolo(id)}</svg>
      <circle class="g-bit${g.completo ? ' completa' : ''}" cx="${bx}" cy="${by}" r="${N * 0.42}"/>
      <text class="g-bit-txt" x="${bx}" y="${by}" font-size="${N * 0.55}">${g.valores[k]}</text>
      <rect class="g-rotulo" x="${x - T * 0.085}" y="${y + N + T * 0.012}" width="${T * 0.17}" height="${T * 0.065}" rx="${T * 0.02}"/>
      <text class="g-rotulo-txt" x="${x}" y="${y + N + T * 0.045}" font-size="${T * 0.048}">${bits(id)}</text>`;
    }).join('');

    const nome = LEGENDA[g.atributo].atributo;
    const resumo = `Grafo de ${nome}: ${g.arestas.length} de 6 arestas${g.completo ? ', todas as peças ligadas' : ''}.`;
    return `<svg class="g-svg" viewBox="0 0 ${T} ${T}" role="img" aria-label="${resumo}">${arestas}${nos}</svg>`;
}

/** Texto que explica o grafo exibido. */
function legenda(g) {
    const a = LEGENDA[g.atributo];
    const regra = `Cada peça é um <b>nó</b>. Uma <b>aresta</b> liga duas peças com o mesmo bit de <b>${a.atributo}</b>.`;
    if (g.completo) {
    const v = g.valores[0];
    return `${regra} As 4 peças têm bit <b>${v}</b> (todas ${a.longo[v]}): todas se ligam, e é isso que dá a vitória.`;
    }
    const [zeros, uns] = g.grupos.map(gr => gr.length);
    const partido = zeros === 2
    ? 'o grafo fica partido em dois pares'
    : 'uma peça tem bit diferente e fica de fora';
    const tem = n => (n === 1 ? 'tem' : 'têm');
    return `${regra} Aqui ${zeros} peça${zeros === 1 ? '' : 's'} ${tem(zeros)} bit 0 e ${uns} ${tem(uns)} bit 1: ${partido}. ${a.atributo} não liga as 4 peças.`;
}

/** Conteúdo trocável do mapa (desenho + legenda). */
function corpoMapa(ids, i) {
    const g = grafoDoAtributo(ids, i);
    return `${svgGrafo(ids, g)}<p class="g-legenda">${legenda(g)}</p>`;
}

/**
 * HTML completo do mapa mágico de uma linha.
 * @param {number[]} ids        as 4 peças da linha
 * @param {number[]} vencedores índices dos atributos em comum
 */
export function htmlMapa(ids, vencedores) {
    const inicial = vencedores[0];
    const botoes = LEGENDA.map((a, i) => `
    <button type="button" class="g-aba${vencedores.includes(i) ? ' vence' : ''}" data-atributo="${i}"
        aria-pressed="${i === inicial}">${a.atributo}</button>`).join('');
    return `
    <section class="mapa" data-pecas="${ids.join(',')}">
        <h4 class="mapa-titulo">Mapa mágico</h4>
        <div class="g-abas" role="group" aria-label="Escolha o atributo">${botoes}</div>
        <div class="g-corpo" aria-live="polite">${corpoMapa(ids, inicial)}</div>
    </section>`;
}

/** Trata o clique num botão de atributo (ligado uma vez, no container da janela de fim). */
export function trocarAtributo(evento) {
    const botao = evento.target.closest('.g-aba');
    if (!botao) return;
    const mapa = botao.closest('.mapa');
    const ids = mapa.dataset.pecas.split(',').map(Number);
    const i = Number(botao.dataset.atributo);
    mapa.querySelectorAll('.g-aba').forEach(b => b.setAttribute('aria-pressed', String(b === botao)));
    mapa.querySelector('.g-corpo').innerHTML = corpoMapa(ids, i);
}