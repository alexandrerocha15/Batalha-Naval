import { TestBed } from '@angular/core/testing';
import { PartidaStore } from '../../estado/partida-store';
import { TelaBatalha } from './tela-batalha';

describe('TelaBatalha', () => {
  let store: PartidaStore;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TelaBatalha] });
    store = TestBed.inject(PartidaStore);
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice * 2, coluna: 0 });
    });
    store.iniciarBatalha();
  });

  it('exibe dois tabuleiros, frota própria e mantém oculta a adversária', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="group"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('button[aria-label]')).toHaveLength(100);
    expect(fixture.nativeElement.textContent).toContain('Seu turno');
    expect(fixture.nativeElement.querySelector('[aria-label="A1, embarcação própria, sem ataque"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Frota adversária porta-aviões');
    fixture.destroy();
  });

  it('aciona coordenada livre e desabilita coordenada já atacada', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    const botao = fixture.nativeElement.querySelector('[aria-label="J10, sem ataque"]') as HTMLButtonElement;
    botao.click();
    fixture.detectChanges();
    expect(store.partida()?.ataques).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('button[aria-label^="J10"]')?.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Histórico de ataques');
    fixture.destroy();
  });

  it('mantém resultados, destruição e vitória acessíveis após o fim', () => {
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice + 5, coluna: 0 });
    });
    store.iniciarBatalha(aleatorio());
    const fixture = TestBed.createComponent(TelaBatalha);
    const frota = store.partida()!.frotaComputador;
    const coordenadas = frota.flatMap((embarcacao) => Array.from({ length: embarcacao.tamanho }, (_, deslocamento) => ({
      linha: embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? deslocamento : 0),
      coluna: embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? deslocamento : 0),
    })));
    coordenadas.forEach((coordenada) => store.atacarJogador(coordenada, () => 0));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Vitória!');
    expect(fixture.nativeElement.textContent).toContain('Porta-aviões destruído');
    expect(fixture.nativeElement.textContent).toContain('Seu ataque em adversário');
    expect(fixture.nativeElement.querySelectorAll('ul li')).toHaveLength(store.partida()!.ataques.length);
    expect(fixture.nativeElement.querySelectorAll('button:disabled')).toHaveLength(100);
    fixture.destroy();
  });
});

function aleatorio() {
  let semente = 2468;
  return () => ((semente = (semente * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
