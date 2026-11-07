import { Component, computed, input } from '@angular/core';
import { FROTA_PADRAO } from '../dominio/frota';
import { Ataque } from '../dominio/partida';

@Component({
  selector: 'app-historico-ataques',
  styles: [':host { display: block; }'],
  templateUrl: './historico-ataques.html',
})
export class HistoricoAtaques {
  readonly ataques = input.required<readonly Ataque[]>();
  readonly reduzido = input(false);

  readonly ataquesExibidos = computed(() => {
    const lista = this.ataques();
    if (!this.reduzido()) return lista;
    const ultimoPorLado = new Map<Ataque['alvo'], Ataque>();
    for (const ataque of lista) ultimoPorLado.set(ataque.alvo, ataque);
    return lista.filter((ataque) => ultimoPorLado.get(ataque.alvo) === ataque);
  });

  textoAtaque(ataque: Ataque): string {
    const posicao = `${this.linhas[ataque.coordenada.linha]}${ataque.coordenada.coluna + 1}`;
    const destruicao = ataque.embarcacao ? ` — ${this.nomeEmbarcacao(ataque.embarcacao)} destruído` : '';
    return `${ataque.alvo === 'computador' ? 'Seu ataque' : 'Ataque do computador'} em ${posicao}: ${this.resultadoTexto(ataque)}${destruicao}.`;
  }

  private readonly linhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  private resultadoTexto(ataque: Ataque): string {
    return ataque.resultado === 'agua' ? 'água' : ataque.resultado === 'acerto' ? 'acerto' : 'destruição';
  }

  private nomeEmbarcacao(nome: NonNullable<Ataque['embarcacao']>): string {
    return FROTA_PADRAO.find((embarcacao) => embarcacao.nome === nome)?.rotulo ?? nome;
  }
}
