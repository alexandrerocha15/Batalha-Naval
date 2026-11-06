import { Component, input } from '@angular/core';
import { FROTA_PADRAO } from '../dominio/frota';
import { Ataque } from '../dominio/partida';

@Component({
  selector: 'app-historico-ataques',
  styles: [':host { display: block; }'],
  templateUrl: './historico-ataques.html',
})
export class HistoricoAtaques {
  readonly ataques = input.required<readonly Ataque[]>();

  textoAtaque(ataque: Ataque): string {
    const lado = ataque.alvo === 'computador' ? 'adversário' : 'jogador';
    const posicao = `${this.linhas[ataque.coordenada.linha]}${ataque.coordenada.coluna + 1}`;
    return `${ataque.alvo === 'computador' ? 'Seu ataque' : 'Ataque do computador'} em ${lado}, ${posicao}: ${this.resultadoTexto(ataque)}${ataque.embarcacao ? ` — ${this.nomeEmbarcacao(ataque.embarcacao)} destruído` : ''}.`;
  }

  private readonly linhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  private resultadoTexto(ataque: Ataque): string {
    return ataque.resultado === 'agua' ? 'água' : ataque.resultado === 'acerto' ? 'acerto' : 'destruição';
  }

  private nomeEmbarcacao(nome: NonNullable<Ataque['embarcacao']>): string {
    return FROTA_PADRAO.find((embarcacao) => embarcacao.nome === nome)?.rotulo ?? nome;
  }
}
