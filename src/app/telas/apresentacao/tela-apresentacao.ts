import { Component, inject } from '@angular/core';
import {
  LucideAnchor,
  LucideArrowRight,
  LucideCrosshair,
  LucideShip,
} from '@lucide/angular';
import { PartidaStore } from '../../estado/partida-store';
import { FROTA_PADRAO } from '../../dominio/frota';

@Component({
  imports: [LucideAnchor, LucideArrowRight, LucideCrosshair, LucideShip],
  selector: 'app-tela-apresentacao',
  templateUrl: './tela-apresentacao.html',
})
export class TelaApresentacao {
  private readonly partida = inject(PartidaStore);

  protected readonly frota = FROTA_PADRAO;

  protected iniciarPartida(): void {
    this.partida.iniciarPartida();
  }
}
