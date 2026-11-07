import { TestBed } from '@angular/core/testing';
import { FROTA_PADRAO } from '../../dominio/frota';
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

  it('renderiza primeiro o tabuleiro do jogador e depois o adversário', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    const grupos = fixture.nativeElement.querySelectorAll('[role="group"]');
    expect(grupos).toHaveLength(2);
    expect(grupos[0].getAttribute('aria-label')).toContain('Seu tabuleiro');
    expect(grupos[1].getAttribute('aria-label')).toContain('Tabuleiro adversário');
    expect(grupos[0].querySelectorAll('button')).toHaveLength(0);
    expect(grupos[1].querySelectorAll('button')).toHaveLength(100);
    fixture.destroy();
  });

  it('aciona coordenada livre e desabilita coordenada já atacada', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    const tabuleiroAdversario = fixture.nativeElement.querySelectorAll('[role="group"]')[1];
    const botao = tabuleiroAdversario.querySelector('[aria-label="J10, sem ataque"]') as HTMLButtonElement;
    botao.click();
    fixture.detectChanges();
    expect(store.partida()?.ataques).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('button[aria-label^="J10"]')?.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Histórico de ataques');
    fixture.destroy();
  });

  it('mostra somente a última jogada de cada lado após uma troca de ataques e ignora jogadas recusadas', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    store.atacarJogador({ linha: 9, coluna: 9 }, () => 0);
    store.atacarJogador({ linha: 9, coluna: 8 }, () => 0);
    fixture.detectChanges();
    expect(store.partida()!.ataques).toHaveLength(4);

    const itens = () => [...fixture.nativeElement.querySelectorAll('app-historico-ataques li')].map((item) => item.textContent!.trim());
    expect(itens()).toHaveLength(2);
    expect(itens()[0]).toContain('Seu ataque em J9');
    expect(itens()[0]).not.toContain('J10');
    expect(itens()[1]).toContain('Ataque do computador em A2');
    expect(itens()[1]).not.toContain('A1');

    const antes = itens();
    expect(store.atacarJogador({ linha: 9, coluna: 9 })).toMatchObject({ aceito: false, motivo: 'ja-atacada' });
    fixture.detectChanges();
    expect(itens()).toEqual(antes);
    fixture.destroy();
  });

  it('exibe o indicador da frota abaixo do tabuleiro do jogador e reduz a quantidade após destruição própria', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    const grupos = fixture.nativeElement.querySelectorAll('[role="group"]');
    const indicador = fixture.nativeElement.querySelector('app-indicador-frota');
    expect(indicador).toBeTruthy();
    expect(grupos[0].compareDocumentPosition(indicador) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(indicador.compareDocumentPosition(grupos[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const rotulos = () => [...indicador.querySelectorAll('li')].map((item) => item.getAttribute('aria-label'));
    expect(rotulos()).toContain('Destroyer: 1 de 1 restantes');
    expect(rotulos()).toContain('Porta-aviões: 1 de 1 restantes');

    store.atacarJogador({ linha: 9, coluna: 9 }, () => 0.805);
    store.atacarJogador({ linha: 9, coluna: 8 }, () => 0.812);
    fixture.detectChanges();

    expect(store.partida()!.ataques.filter((ataque) => ataque.resultado === 'destruicao' && ataque.alvo === 'jogador'))
      .toHaveLength(1);
    expect(rotulos()).toContain('Destroyer: 0 de 1 restantes');
    expect(rotulos()).toContain('Porta-aviões: 1 de 1 restantes');
    expect(rotulos()).toContain('Encouraçado: 1 de 1 restantes');
    expect(rotulos()).toContain('Cruzador: 1 de 1 restantes');
    expect(rotulos()).toContain('Submarino: 1 de 1 restantes');
    fixture.destroy();
  });

  it('restaura as quantidades da frota ao iniciar uma nova partida', () => {
    const fixture = TestBed.createComponent(TelaBatalha);
    fixture.detectChanges();
    const rotulos = () => [...fixture.nativeElement.querySelectorAll('app-indicador-frota li')]
      .map((item: Element) => item.getAttribute('aria-label'));

    store.atacarJogador({ linha: 9, coluna: 9 }, () => 0.805);
    store.atacarJogador({ linha: 9, coluna: 8 }, () => 0.812);
    fixture.detectChanges();
    expect(rotulos()).toContain('Destroyer: 0 de 1 restantes');

    store.novaPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice * 2, coluna: 0 });
    });
    expect(store.iniciarBatalha(aleatorio())).toBe(true);
    fixture.detectChanges();

    expect(rotulos()).toEqual([
      'Porta-aviões: 1 de 1 restantes',
      'Encouraçado: 1 de 1 restantes',
      'Cruzador: 1 de 1 restantes',
      'Submarino: 1 de 1 restantes',
      'Destroyer: 1 de 1 restantes',
    ]);
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
    const ataques = store.partida()!.ataques;
    const ultimoDoJogador = [...ataques].reverse().find((ataque) => ataque.alvo === 'computador')!;
    const ultimoDoComputador = [...ataques].reverse().find((ataque) => ataque.alvo === 'jogador')!;
    const nomeDestruido = FROTA_PADRAO.find((modelo) => modelo.nome === ultimoDoJogador.embarcacao)!.rotulo;
    expect(fixture.nativeElement.textContent).toContain(`${nomeDestruido} destruído`);
    expect(fixture.nativeElement.textContent).toContain('destruição');
    expect(fixture.nativeElement.textContent).not.toContain('Seu ataque em adversário');
    expect(fixture.nativeElement.querySelectorAll('app-historico-ataques li')).toHaveLength(2);
    const textos = [...fixture.nativeElement.querySelectorAll('app-historico-ataques li')].map((item) => item.textContent!.trim());
    expect(textos[0]).toContain('Ataque do computador em');
    expect(textos[1]).toContain('Seu ataque em');
    expect(textos.join(' ')).not.toContain('em adversário');
    expect(fixture.nativeElement.querySelectorAll('button:disabled')).toHaveLength(100);
    fixture.destroy();
  });
});

function aleatorio() {
  let semente = 2468;
  return () => ((semente = (semente * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
