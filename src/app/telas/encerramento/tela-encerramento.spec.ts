import { TestBed } from '@angular/core/testing';
import { Coordenada } from '../../dominio/coordenada';
import { PartidaStore } from '../../estado/partida-store';
import { TelaEncerramento } from './tela-encerramento';

function aleatorio() {
  let semente = 2468;
  return () => ((semente = (semente * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

function aleatorioControlado() {
  let semente = 12345;
  return () => ((semente = (semente * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe('TelaEncerramento', () => {
  let store: PartidaStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TelaEncerramento] });
    store = TestBed.inject(PartidaStore);
  });

  function posicionarFrota(posicoes: (indice: number) => Coordenada): void {
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      expect(store.posicionarAtiva(posicoes(indice))).toBe(true);
    });
  }

  function encerrarComVitoria(): void {
    posicionarFrota((indice) => ({ linha: indice + 5, coluna: 0 }));
    expect(store.iniciarBatalha(aleatorio())).toBe(true);
    const celulasAdversarias = store.partida()!.frotaComputador.flatMap((embarcacao) =>
      Array.from({ length: embarcacao.tamanho }, (_, deslocamento) => ({
        linha: embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? deslocamento : 0),
        coluna: embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? deslocamento : 0),
      })),
    );
    celulasAdversarias.forEach((coordenada) => store.atacarJogador(coordenada, () => 0));
    expect(store.partida()?.situacao).toBe('vitoria');
    expect(store.fase()).toBe('encerrada');
  }

  function encerrarComDerrota(): void {
    const posicoes: Coordenada[] = [
      { linha: 0, coluna: 0 }, { linha: 0, coluna: 6 },
      { linha: 1, coluna: 0 }, { linha: 1, coluna: 3 }, { linha: 1, coluna: 6 },
    ];
    posicionarFrota((indice) => posicoes[indice]);
    expect(store.iniciarBatalha(aleatorioControlado())).toBe(true);
    const celulasAdversarias = new Set(store.partida()!.frotaComputador.flatMap((embarcacao) =>
      Array.from({ length: embarcacao.tamanho }, (_, deslocamento) =>
        `${embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? deslocamento : 0)},${embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? deslocamento : 0)}`),
    ));
    let tentativa = 0;
    while (store.partida()?.situacao === 'em-andamento') {
      let coordenada: Coordenada;
      do {
        coordenada = { linha: Math.floor(tentativa / 10), coluna: tentativa++ % 10 };
      } while (celulasAdversarias.has(`${coordenada.linha},${coordenada.coluna}`)
        || store.partida()!.ataques.some((ataque) => ataque.alvo === 'computador'
          && ataque.coordenada.linha === coordenada.linha && ataque.coordenada.coluna === coordenada.coluna));
      expect(store.atacarJogador(coordenada, () => 0)?.aceito).toBe(true);
    }
    expect(store.partida()?.situacao).toBe('derrota');
    expect(store.fase()).toBe('encerrada');
  }

  it('anuncia a vitória com os dois tabuleiros e o histórico preservados', () => {
    encerrarComVitoria();
    const totalAtaques = store.partida()!.ataques.length;
    const fixture = TestBed.createComponent(TelaEncerramento);
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Vitória!');
    expect(texto).toContain('a frota do computador foi destruída');
    expect(texto).toContain('Nenhum ataque adicional é possível');
    expect(fixture.nativeElement.querySelectorAll('[role="group"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('ul li')).toHaveLength(totalAtaques);
    expect(texto).toContain('Seu ataque em adversário');
    expect(texto).toContain('Jogar novamente');
    fixture.destroy();
  });

  it('anuncia a derrota identificando a frota destruída', () => {
    encerrarComDerrota();
    const totalAtaques = store.partida()!.ataques.length;
    const fixture = TestBed.createComponent(TelaEncerramento);
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Derrota.');
    expect(texto).toContain('a sua frota foi destruída');
    expect(texto).toContain('Nenhum ataque adicional é possível');
    expect(fixture.nativeElement.querySelectorAll('[role="group"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('ul li')).toHaveLength(totalAtaques);
    fixture.destroy();
  });

  it('não oferece coordenadas acionáveis e mantém o resultado inalterado', () => {
    encerrarComVitoria();
    const fixture = TestBed.createComponent(TelaEncerramento);
    fixture.detectChanges();
    const ataquesAntes = store.partida()!.ataques.length;
    const botoes = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];
    expect(botoes.filter((botao) => !botao.disabled && /^[A-J]\d/.test(botao.getAttribute('aria-label') ?? ''))).toHaveLength(0);
    expect(botoes.filter((botao) => botao.disabled)).toHaveLength(100);
    botoes.find((botao) => /^A1/.test(botao.getAttribute('aria-label') ?? ''))?.click();
    expect(store.partida()!.ataques).toHaveLength(ataquesAntes);
    expect(store.partida()!.situacao).toBe('vitoria');
    fixture.destroy();
  });

  it('mantém hierarquia de títulos, seções rotuladas e ação de reinício funcional', () => {
    encerrarComVitoria();
    const fixture = TestBed.createComponent(TelaEncerramento);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;

    const titulos = [...raiz.querySelectorAll('h1, h2')].map((titulo) => titulo.tagName + ':' + titulo.textContent?.trim());
    expect(titulos.filter((titulo) => titulo.startsWith('H1:'))).toHaveLength(1);
    expect(titulos[0]).toBe('H1:Partida encerrada');
    expect(titulos).toContain('H2:Frota adversária');
    expect(titulos).toContain('H2:Sua frota');
    expect(titulos).toContain('H2:Histórico de ataques');

    const secoes = [...raiz.querySelectorAll('section[aria-labelledby]')] as HTMLElement[];
    expect(secoes.length).toBeGreaterThanOrEqual(3);
    for (const secao of secoes) {
      const id = secao.getAttribute('aria-labelledby');
      expect(id).toBeTruthy();
      expect(raiz.querySelector(`#${id}`)).toBeTruthy();
    }

    const reinicio = [...raiz.querySelectorAll('button')].find((botao) => botao.textContent?.trim() === 'Jogar novamente') as HTMLButtonElement;
    expect(reinicio).toBeTruthy();
    reinicio.click();
    expect(store.fase()).toBe('preparacao');
    expect(store.partida()).toBeUndefined();
    expect(store.frotaPreparacao()).toEqual([]);
    fixture.destroy();
  });
});
