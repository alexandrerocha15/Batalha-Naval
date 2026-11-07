import { Component, inject } from '@angular/core';
import { HistoricoAtaques } from '../../componentes/historico-ataques';
import { TabuleiroPartida } from '../../componentes/tabuleiro-partida';
import { PartidaStore } from '../../estado/partida-store';

@Component({
  selector: 'app-tela-encerramento',
  imports: [TabuleiroPartida, HistoricoAtaques],
  templateUrl: './tela-encerramento.html',
})
export class TelaEncerramento {
  private readonly store = inject(PartidaStore);
  protected readonly partida = this.store.partida;

  jogarNovamente(): void { this.store.novaPartida(); }
}
