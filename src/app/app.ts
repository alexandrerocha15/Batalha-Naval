import { Component, inject } from '@angular/core';
import { PartidaStore } from './estado/partida-store';
import { TelaApresentacao } from './telas/apresentacao/tela-apresentacao';
import { TelaBatalha } from './telas/batalha/tela-batalha';
import { TelaEncerramento } from './telas/encerramento/tela-encerramento';
import { TelaPreparacao } from './telas/preparacao/tela-preparacao';

@Component({
  imports: [TelaApresentacao, TelaPreparacao, TelaBatalha, TelaEncerramento],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly partida = inject(PartidaStore);
}
