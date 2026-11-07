import { Component, computed, input } from '@angular/core';
import { LucideFish, LucidePlane, LucideShield, LucideShip, LucideZap } from '@lucide/angular';
import { situacaoFrota } from '../dominio/combate';
import { Partida } from '../dominio/partida';

@Component({
  selector: 'app-indicador-frota',
  imports: [LucideFish, LucidePlane, LucideShield, LucideShip, LucideZap],
  styles: [':host { display: block; }'],
  templateUrl: './indicador-frota.html',
})
export class IndicadorFrota {
  readonly partida = input.required<Partida>();

  readonly situacao = computed(() => situacaoFrota(this.partida(), 'jogador'));
}
