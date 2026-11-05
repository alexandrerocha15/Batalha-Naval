import { Component, computed, inject } from '@angular/core';
import { chave, Coordenada } from '../../dominio/coordenada';
import { celulas, FROTA_PADRAO } from '../../dominio/frota';
import { Ataque, Lado, Partida } from '../../dominio/partida';
import { PartidaStore } from '../../estado/partida-store';

@Component({
  selector: 'app-tela-batalha',
  templateUrl: './tela-batalha.html',
})
export class TelaBatalha {
  protected readonly store = inject(PartidaStore);
  protected readonly coordenadas = Array.from({ length: 100 }, (_, indice) => ({ linha: Math.floor(indice / 10), coluna: indice % 10 }));
  protected readonly partida = this.store.partida;
  protected readonly resultadoTurno = computed(() => this.partida()?.ataques.slice(-2) ?? []);
  protected readonly linhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  protegido(c: Coordenada): boolean {
    return !!this.partida()?.frotaJogador.some((embarcacao) => celulas(embarcacao).some((celula) => chave(celula) === chave(c)));
  }

  ataque(alvo: Lado, c: Coordenada): Ataque | undefined {
    return this.partida()?.ataques.find((item) => item.alvo === alvo && chave(item.coordenada) === chave(c));
  }

  classe(alvo: Lado, c: Coordenada): string {
    const ataque = this.ataque(alvo, c);
    if (ataque?.resultado === 'agua') return 'bg-sky-900/70 text-sky-100';
    if (ataque) return 'bg-rose-700 text-white';
    return alvo === 'jogador' && this.protegido(c) ? 'bg-amber-500/70 text-white' : 'bg-oceano-800 text-espuma-100/70';
  }

  rotulo(alvo: Lado, c: Coordenada): string {
    const posicao = `${this.linhas[c.linha]}${c.coluna + 1}`;
    const ataque = this.ataque(alvo, c);
    const navio = alvo === 'jogador' && this.protegido(c) ? ', embarcação própria' : '';
    const resultado = ataque ? `, ${this.resultadoTexto(ataque)}${ataque.embarcacao ? `: ${this.nomeEmbarcacao(ataque.embarcacao)}` : ''}` : ', sem ataque';
    return `${posicao}${navio}${resultado}`;
  }

  atacar(c: Coordenada): void { this.store.atacarJogador(c); }

  textoAtaque(ataque: Ataque): string {
    const lado = ataque.alvo === 'computador' ? 'adversário' : 'jogador';
    const posicao = `${this.linhas[ataque.coordenada.linha]}${ataque.coordenada.coluna + 1}`;
    return `${ataque.alvo === 'computador' ? 'Seu ataque' : 'Ataque do computador'} em ${lado}, ${posicao}: ${this.resultadoTexto(ataque)}${ataque.embarcacao ? ` — ${this.nomeEmbarcacao(ataque.embarcacao)} destruído` : ''}.`;
  }

  private resultadoTexto(ataque: Ataque): string {
    return ataque.resultado === 'agua' ? 'água' : ataque.resultado === 'acerto' ? 'acerto' : 'destruição';
  }

  private nomeEmbarcacao(nome: NonNullable<Ataque['embarcacao']>): string {
    return FROTA_PADRAO.find((embarcacao) => embarcacao.nome === nome)?.rotulo ?? nome;
  }
}
