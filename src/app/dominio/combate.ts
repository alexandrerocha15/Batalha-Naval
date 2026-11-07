import { chave, Coordenada, TAMANHO_TABULEIRO, validarCoordenada } from './coordenada';
import { celulas } from './frota';
import { Ataque, Lado, Partida } from './partida';
import { Frota } from './preparacao';

export type MotivoAtaque = 'coordenada-invalida' | 'ja-atacada' | 'fora-do-turno' | 'partida-encerrada';
export type ResultadoAtacar =
  | { readonly aceito: true; readonly ataque: Ataque; readonly partida: Partida }
  | { readonly aceito: false; readonly motivo: MotivoAtaque; readonly partida: Partida };

function frotaDoAlvo(partida: Partida, alvo: Lado): Frota { return alvo === 'jogador' ? partida.frotaJogador : partida.frotaComputador; }
function todasDestruidas(partida: Partida, alvo: Lado): boolean {
  const frota = frotaDoAlvo(partida, alvo);
  return frota.every((embarcacao) => celulas(embarcacao).every((celula) => partida.ataques.some((ataque) => ataque.alvo === alvo && chave(ataque.coordenada) === chave(celula))));
}

export function atacar(partida: Partida, atacante: Lado, coordenada: Coordenada): ResultadoAtacar {
  if (partida.situacao !== 'em-andamento') return { aceito: false, motivo: 'partida-encerrada', partida };
  if (partida.turno !== atacante) return { aceito: false, motivo: 'fora-do-turno', partida };
  if (!validarCoordenada(coordenada)) return { aceito: false, motivo: 'coordenada-invalida', partida };
  const alvo: Lado = atacante === 'jogador' ? 'computador' : 'jogador';
  if (partida.ataques.some((ataque) => ataque.alvo === alvo && chave(ataque.coordenada) === chave(coordenada))) return { aceito: false, motivo: 'ja-atacada', partida };
  const embarcacao = frotaDoAlvo(partida, alvo).find((item) => celulas(item).some((celula) => chave(celula) === chave(coordenada)));
  const parcial: Ataque = { alvo, coordenada, resultado: embarcacao ? 'acerto' : 'agua' };
  const ataques = [...partida.ataques, parcial];
  let ataque = parcial;
  if (embarcacao && embarcacaoDestruida(ataques, alvo, embarcacao)) ataque = { ...parcial, resultado: 'destruicao', embarcacao: embarcacao.nome };
  const historico = ataque === parcial ? ataques : [...partida.ataques, ataque];
  const venceu = todasDestruidas({ ...partida, ataques: historico }, alvo);
  const situacao = venceu ? (alvo === 'computador' ? 'vitoria' : 'derrota') : partida.situacao;
  return { aceito: true, ataque, partida: { ...partida, ataques: historico, situacao, turno: situacao === 'em-andamento' ? alvo : partida.turno } };
}

function embarcacaoDestruida(ataques: readonly Ataque[], alvo: Lado, embarcacao: Parameters<typeof celulas>[0]): boolean {
  return celulas(embarcacao).every((celula) => ataques.some((ataque) => ataque.alvo === alvo && chave(ataque.coordenada) === chave(celula)));
}

export function escolherCoordenada(partida: Partida, alvo: Lado, aleatorio: () => number): Coordenada {
  const ocupadas = new Set(partida.ataques.filter((ataque) => ataque.alvo === alvo).map((ataque) => chave(ataque.coordenada)));
  const livres: Coordenada[] = [];
  for (let linha = 0; linha < TAMANHO_TABULEIRO; linha++) for (let coluna = 0; coluna < TAMANHO_TABULEIRO; coluna++) if (!ocupadas.has(chave({ linha, coluna }))) livres.push({ linha, coluna });
  if (!livres.length) throw new Error('Não há coordenadas livres');
  return livres[Math.min(livres.length - 1, Math.floor(aleatorio() * livres.length))];
}

export function marcacaoEm(partida: Partida, alvo: Lado): readonly Ataque[] { return partida.ataques.filter((ataque) => ataque.alvo === alvo); }
export function embarcacoesDestruidas(partida: Partida, alvo: Lado): readonly string[] {
  const destruicoes = new Set<string>();
  for (const ataque of marcacaoEm(partida, alvo)) {
    if (ataque.resultado === 'destruicao' && ataque.embarcacao) destruicoes.add(ataque.embarcacao);
  }
  return [...destruicoes];
}
