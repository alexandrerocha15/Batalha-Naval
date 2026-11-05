import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { PartidaStore } from './estado/partida-store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('exibe a apresentacao na fase inicial', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-tela-apresentacao')).toBeTruthy();
  });

  it('exibe a preparacao apos iniciar a partida', async () => {
    const fixture = TestBed.createComponent(App);
    const partida = TestBed.inject(PartidaStore);

    partida.iniciarPartida();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-tela-preparacao')).toBeTruthy();
  });
});
