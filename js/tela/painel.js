/**
 * painel.js — de quem é a vez, placar e janela de fim de partida.
 */
import { LEGENDA } from '../logica/pecas.js';
import { POVOS } from '../logica/regras.js';

const COR_POVO = ['var(--terra-firme)', 'var(--igarape)'];

export function renderVez(el, estado) {
  const { resultado, fase, vez } = estado;
  let titulo, texto, cor;

  if (resultado?.tipo === 'vitoria') {
    titulo = `Vitória dos ${POVOS[resultado.povo].nome}`;
    texto = 'Clique em Nova partida para jogar outra vez.';
    cor = COR_POVO[resultado.povo];
  } else if (resultado?.tipo === 'empate') {
    titulo = 'Empate';
    texto = 'A clareira está cheia e ninguém completou uma linha.';
    cor = 'var(--tinta)';
  } else {
    titulo = POVOS[vez].nome;
    texto = fase === 'escolher'
      ? `Escolham na reserva a peça que o ${POVOS[1 - vez].curto} vai colocar.`
      : 'Coloquem a peça entregue em uma casa vazia.';
    cor = COR_POVO[vez];
  }

  el.style.setProperty('--cor-vez', cor);
  el.innerHTML = `<strong>${titulo}</strong><span>${texto}</span>`;
}

export function renderPlacar(el, placar) {
  el.innerHTML = `<span>Terra Firme <b>${placar[0]}</b></span><span>Igarapé <b>${placar[1]}</b></span><span>Empates <b>${placar[2]}</b></span>`;
}

export function preencherFim(tituloEl, textoEl, resultado) {
  if (resultado.tipo === 'vitoria') {
    tituloEl.textContent = `Vitória dos ${POVOS[resultado.povo].nome}!`;
    const itens = resultado.linhas.map(l =>
      `<li><b>${l.nome}:</b> todas são ${l.comuns.map(c => LEGENDA[c.i].longo[c.valor]).join(' e também ')}.</li>`
    ).join('');
    textoEl.innerHTML = `<p>A peça que completou a linha foi entregue pelo ${POVOS[1 - resultado.povo].curto}. O que as peças têm em comum:</p><ul>${itens}</ul>`;
  } else {
    tituloEl.textContent = 'Empate na clareira';
    textoEl.innerHTML = '<p>As 16 moradas foram ocupadas sem nenhuma linha com característica em comum. Com dois jogadores perfeitos, todo QUARTO termina assim.</p>';
  }
}
