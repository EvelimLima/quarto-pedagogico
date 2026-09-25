/**
 * main.js — liga a lógica (js/logica) à tela (js/tela).
 * É o único arquivo que guarda estado e trata eventos.
 */
import { criarPartida, escolherPeca, posicionarPeca } from './logica/regras.js';
import { renderTabuleiro, renderReserva } from './tela/tabuleiro.js';
import { renderMao } from './tela/bits.js';
import { renderVez, renderPlacar, preencherFim } from './tela/painel.js';

const $ = sel => document.querySelector(sel);
const el = {
  tabuleiro: $('#tabuleiro'), reserva: $('#reserva'), mao: $('#mao'),
  vez: $('#vez'), placar: $('#placar'),
  fim: $('#fim'), fimTitulo: $('#fim-titulo'), fimTexto: $('#fim-texto'),
};

const placar = [0, 0, 0]; // Terra Firme, Igarapé, empates
let quemComeca = 0;
let estado;

function render() {
  renderTabuleiro(el.tabuleiro, estado);
  renderReserva(el.reserva, estado);
  renderMao(el.mao, estado);
  renderVez(el.vez, estado);
  renderPlacar(el.placar, placar);
}

function focar(seletor) {
  document.querySelector(seletor)?.focus({ preventScroll: true });
}

function novaPartida() {
  estado = criarPartida(quemComeca);
  quemComeca = 1 - quemComeca;
  el.fim.hidden = true;
  render();
  focar('.ficha.disponivel');
}

function atualizar(novoEstado) {
  if (novoEstado === estado) return; // jogada inválida: nada muda
  estado = novoEstado;
  render();

  if (estado.fase === 'fim') {
    if (estado.resultado.tipo === 'vitoria') placar[estado.resultado.povo]++;
    else placar[2]++;
    renderPlacar(el.placar, placar);
    preencherFim(el.fimTitulo, el.fimTexto, estado.resultado);
    el.fim.hidden = false;
    $('#fim-nova').focus();
  } else if (estado.fase === 'posicionar') {
    focar('.casa.livre');
  } else {
    focar('.ficha.disponivel');
  }
}

el.tabuleiro.addEventListener('click', e => {
  const b = e.target.closest('[data-casa]');
  if (b) atualizar(posicionarPeca(estado, Number(b.dataset.casa)));
});
el.reserva.addEventListener('click', e => {
  const b = e.target.closest('[data-peca]');
  if (b) atualizar(escolherPeca(estado, Number(b.dataset.peca)));
});
$('#nova').addEventListener('click', novaPartida);
$('#fim-nova').addEventListener('click', novaPartida);
$('#fim-ver').addEventListener('click', () => { el.fim.hidden = true; $('#nova').focus(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !el.fim.hidden) el.fim.hidden = true;
});

novaPartida();
