/**
 * regras.js — máquina de estados da partida.
 * Lógica pura: não acessa o DOM. Cada função recebe um estado
 * e devolve um estado NOVO (o original não é alterado).
 *
 * Fases:
 *   'escolher'   → o povo da vez escolhe a peça que o outro vai jogar
 *   'posicionar' → o povo da vez coloca a peça que recebeu
 *   'fim'        → vitória ou empate
 */
import { TODAS_AS_PECAS } from './pecas.js';
import { linhasVencedoras } from './vitoria.js';

export const POVOS = [
  { nome: 'Guerreiros da Terra Firme', curto: 'Terra Firme' },
  { nome: 'Guerreiros do Igarapé',     curto: 'Igarapé' },
];

export function criarPartida(quemComeca = 0) {
  return {
    tabuleiro: Array(16).fill(null),
    reserva: [...TODAS_AS_PECAS],
    vez: quemComeca,
    fase: 'escolher',
    mao: null,
    resultado: null, // { tipo: 'vitoria', povo, linhas } ou { tipo: 'empate' }
  };
}

/** O povo da vez entrega a peça `id` ao outro povo. */
export function escolherPeca(estado, id) {
  if (estado.fase !== 'escolher' || !estado.reserva.includes(id)) return estado;
  return {
    ...estado,
    reserva: estado.reserva.filter(p => p !== id),
    mao: id,
    vez: 1 - estado.vez,
    fase: 'posicionar',
  };
}

/** O povo da vez coloca a peça que recebeu na `casa` (0 a 15). */
export function posicionarPeca(estado, casa) {
  if (estado.fase !== 'posicionar' || estado.tabuleiro[casa] !== null) return estado;

  const tabuleiro = [...estado.tabuleiro];
  tabuleiro[casa] = estado.mao;
  const base = { ...estado, tabuleiro, mao: null };

  const linhas = linhasVencedoras(tabuleiro);
  if (linhas.length > 0) {
    return { ...base, fase: 'fim', resultado: { tipo: 'vitoria', povo: estado.vez, linhas } };
  }
  if (tabuleiro.every(p => p !== null)) {
    return { ...base, fase: 'fim', resultado: { tipo: 'empate' } };
  }
  return { ...base, fase: 'escolher' };
}
