import { TestBed } from '@angular/core/testing';
import { PartidaStore } from './partida-store';

describe('PartidaStore', () => {
  let store: PartidaStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(PartidaStore);
  });

  it('comeca na apresentacao', () => {
    expect(store.fase()).toBe('apresentacao');
  });

  it('avanca para a preparacao ao iniciar a partida', () => {
    store.iniciarPartida();

    expect(store.fase()).toBe('preparacao');
  });
});
