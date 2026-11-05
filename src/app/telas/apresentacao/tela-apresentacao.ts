import { Component, inject } from '@angular/core';
import {
  LucideAnchor,
  LucideArrowRight,
  LucideCrosshair,
  LucideShip,
} from '@lucide/angular';
import { PartidaStore } from '../../estado/partida-store';

interface EmbarcacaoApresentacao {
  nome: string;
  tamanho: number;
}

const FROTA_APRESENTACAO: readonly EmbarcacaoApresentacao[] = [
  { nome: 'Porta-aviões', tamanho: 5 },
  { nome: 'Encouraçado', tamanho: 4 },
  { nome: 'Cruzador', tamanho: 3 },
  { nome: 'Submarino', tamanho: 3 },
  { nome: 'Destroyer', tamanho: 2 },
];

@Component({
  imports: [LucideAnchor, LucideArrowRight, LucideCrosshair, LucideShip],
  selector: 'app-tela-apresentacao',
  templateUrl: './tela-apresentacao.html',
})
export class TelaApresentacao {
  private readonly partida = inject(PartidaStore);

  protected readonly frota = FROTA_APRESENTACAO;

  protected iniciarPartida(): void {
    this.partida.iniciarPartida();
  }
}
