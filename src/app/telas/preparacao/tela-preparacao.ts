import { Component, HostListener, inject, signal } from '@angular/core';
import { chave, Coordenada } from '../../dominio/coordenada';
import { celulas, NomeEmbarcacao } from '../../dominio/frota';
import { PartidaStore } from '../../estado/partida-store';

@Component({
  selector: 'app-tela-preparacao',
  templateUrl: './tela-preparacao.html',
})
export class TelaPreparacao {
  readonly partida = inject(PartidaStore);
  readonly linhas = Array.from({ length: 10 }, (_, indice) => indice);
  readonly colunas = Array.from({ length: 10 }, (_, indice) => indice);
  readonly origem = signal<Coordenada | undefined>(undefined);

  apontar(linha: number, coluna: number): void { this.origem.set({ linha, coluna }); }
  avaliar(linha: number, coluna: number) { return this.partida.avaliar({ linha, coluna }); }
  avaliacaoAtual() { const origem = this.origem(); return origem ? this.partida.avaliar(origem) : undefined; }
  rotuloLinha(linha: number): string { return String.fromCharCode(65 + linha); }
  @HostListener('document:keydown', ['$event'])
  atalhoOrientacao(evento: KeyboardEvent): void {
    if (evento.key.toLowerCase() === 'r' && this.partida.embarcacaoAtiva()) this.alternarOrientacao();
  }
  confirmar(linha: number, coluna: number): void {
    this.apontar(linha, coluna);
    this.partida.posicionarAtiva({ linha, coluna });
  }
  alternarOrientacao(): void { this.partida.alternarOrientacao(); }
  selecionar(nome: NomeEmbarcacao): void { this.partida.selecionarEmbarcacao(nome); this.origem.set(undefined); }
  remover(nome: NomeEmbarcacao): void { this.partida.removerEmbarcacao(nome); }
  embarcacaoNaCelula(linha: number, coluna: number): string | undefined {
    return this.partida.frotaPreparacao().find((embarcacao) => celulas(embarcacao).some((celula) => chave(celula) === chave({ linha, coluna })))?.rotulo;
  }
  previaNaCelula(linha: number, coluna: number): boolean {
    const avaliacao = this.origem() ? this.partida.avaliar(this.origem()!) : undefined;
    return !!avaliacao?.celulas.some((celula) => celula.linha === linha && celula.coluna === coluna);
  }
  motivoInvalido(): string {
    const origem = this.origem();
    const avaliacao = origem ? this.partida.avaliar(origem) : undefined;
    if (!avaliacao || avaliacao.valido) return '';
    return avaliacao.motivo === 'fora-do-tabuleiro' ? 'A embarcação ultrapassa o limite do tabuleiro.' : 'A posição sobrepõe outra embarcação.';
  }
}
