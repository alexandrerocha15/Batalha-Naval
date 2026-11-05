import { Injectable, signal } from '@angular/core';

export type FasePartida = 'apresentacao' | 'preparacao' | 'batalha' | 'encerrada';

@Injectable({ providedIn: 'root' })
export class PartidaStore {
  private readonly _fase = signal<FasePartida>('apresentacao');

  readonly fase = this._fase.asReadonly();

  iniciarPartida(): void {
    this._fase.set('preparacao');
  }
}
