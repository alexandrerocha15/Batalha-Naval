import { TestBed } from '@angular/core/testing';
import { PartidaStore } from '../../estado/partida-store';
import { TelaApresentacao } from './tela-apresentacao';

describe('TelaApresentacao', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaApresentacao],
    }).compileComponents();
  });

  it('apresenta o jogo, o objetivo e a frota', async () => {
    const fixture = TestBed.createComponent(TelaApresentacao);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    const texto = elemento.textContent ?? '';

    expect(elemento.querySelector('h1')?.textContent).toContain('Batalha Naval');
    expect(texto).toContain('Afunde a frota inimiga');
    expect(texto).toContain('Você ataca primeiro');
    expect(texto).toContain('Porta-aviões');
    expect(texto).toContain('Encouraçado');
    expect(texto).toContain('Cruzador');
    expect(texto).toContain('Submarino');
    expect(texto).toContain('Destroyer');
  });

  it('inicia a partida ao acionar o botao', async () => {
    const fixture = TestBed.createComponent(TelaApresentacao);
    const partida = TestBed.inject(PartidaStore);
    await fixture.whenStable();

    const botao = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    botao.click();
    await fixture.whenStable();

    expect(partida.fase()).toBe('preparacao');
  });
});
