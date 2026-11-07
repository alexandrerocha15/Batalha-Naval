import { Component, inject } from '@angular/core';
import { Coordenada } from '../../dominio/coordenada';
import { HistoricoAtaques } from '../../componentes/historico-ataques';
import { IndicadorFrota } from '../../componentes/indicador-frota';
import { TabuleiroPartida } from '../../componentes/tabuleiro-partida';
import { PartidaStore } from '../../estado/partida-store';

@Component({
  selector: 'app-tela-batalha',
  imports: [TabuleiroPartida, HistoricoAtaques, IndicadorFrota],
  templateUrl: './tela-batalha.html',
})
export class TelaBatalha {
  protected readonly store = inject(PartidaStore);
  protected readonly partida = this.store.partida;

  atacar(c: Coordenada): void { this.store.atacarJogador(c); }
}
