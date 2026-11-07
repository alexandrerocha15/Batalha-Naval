import { TestBed } from '@angular/core/testing';
import { PartidaStore } from '../../estado/partida-store';
import { TelaPreparacao } from './tela-preparacao';

describe('TelaPreparacao', () => {
  let store: PartidaStore;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TelaPreparacao] });
    store = TestBed.inject(PartidaStore);
    store.iniciarPartida();
  });

  it('seleciona a embarcação ativa e alterna sua orientação', () => {
    const fixture = TestBed.createComponent(TelaPreparacao);
    fixture.detectChanges();
    const botoes = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    botoes.find((botao) => botao.textContent?.includes('Destroyer'))!.click();
    fixture.detectChanges();
    expect(store.embarcacaoAtiva()).toBe('destroyer');
    expect(fixture.nativeElement.querySelector('[aria-pressed="true"]')?.textContent).toContain('Destroyer');
    botoes.find((botao) => botao.textContent?.includes('Alternar orientação'))!.click();
    expect(store.orientacao()).toBe('vertical');
    fixture.destroy();
  });

  it('mostra a frota faltante e mantém o início indisponível', () => {
    const fixture = TestBed.createComponent(TelaPreparacao);
    fixture.detectChanges();
    const botoes = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const iniciar = botoes.find((botao) => botao.textContent?.includes('Iniciar batalha'))!;
    expect(iniciar.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Faltantes: 5');
    expect(fixture.nativeElement.textContent).toContain('pressione R');
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label*="Tabuleiro de posicionamento"]')).toBeTruthy();
    fixture.destroy();
  });

  it('habilita o início e transiciona ao completar a frota', () => {
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice * 2, coluna: 0 });
    });
    const fixture = TestBed.createComponent(TelaPreparacao);
    fixture.detectChanges();
    const iniciar = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .find((botao) => botao.textContent?.includes('Iniciar batalha'))!;
    expect(iniciar.disabled).toBe(false);
    iniciar.click();
    expect(store.fase()).toBe('batalha');
    fixture.destroy();
  });

  it('permite alternar orientação pelo atalho de teclado', () => {
    const fixture = TestBed.createComponent(TelaPreparacao);
    fixture.detectChanges();
    store.selecionarEmbarcacao('destroyer');
    fixture.componentInstance.atalhoOrientacao(new KeyboardEvent('keydown', { key: 'r' }));
    expect(store.orientacao()).toBe('vertical');
    fixture.destroy();
  });

  it('avalia prévia, confirma origem válida e recusa posição fora do tabuleiro', () => {
    const fixture = TestBed.createComponent(TelaPreparacao);
    fixture.detectChanges();
    store.selecionarEmbarcacao('destroyer');
    fixture.componentInstance.apontar(0, 0);
    expect(fixture.componentInstance.avaliacaoAtual()?.valido).toBe(true);
    fixture.componentInstance.confirmar(0, 0);
    expect(store.frotaPreparacao()).toHaveLength(1);
    store.selecionarEmbarcacao('cruzador');
    fixture.componentInstance.apontar(0, 8);
    expect(fixture.componentInstance.avaliacaoAtual()?.valido).toBe(false);
    fixture.componentInstance.confirmar(0, 8);
    fixture.detectChanges();
    expect(store.frotaPreparacao()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('ultrapassa o limite do tabuleiro');
    fixture.destroy();
  });
});
