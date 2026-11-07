import { TestBed } from '@angular/core/testing';
import { IndicadorFrota } from './indicador-frota';
import { atacar } from '../dominio/combate';
import { FROTA_PADRAO, NomeEmbarcacao } from '../dominio/frota';
import { iniciarBatalha, Lado, Partida } from '../dominio/partida';
import { posicionar } from '../dominio/preparacao';

function frotaDeTeste() {
  let frota = [] as ReturnType<typeof posicionar>;
  for (let indice = 0; indice < FROTA_PADRAO.length; indice++) {
    frota = posicionar(frota ?? [], FROTA_PADRAO[indice], { linha: indice * 2, coluna: 0 }, 'horizontal');
  }
  return frota!;
}

function partidaInicial(): Partida {
  const inicio = iniciarBatalha(frotaDeTeste(), frotaDeTeste());
  if (!inicio.iniciada) throw new Error('partida não iniciada');
  return inicio.partida;
}

function linhaDeAtaque(indice: number): { linha: number; coluna: number } {
  return { linha: 1 + (indice % 9), coluna: indice % 10 };
}

function destruirEmbarcacao(partida: Partida, alvo: Lado, nome: NomeEmbarcacao): Partida {
  const frota = alvo === 'jogador' ? partida.frotaJogador : partida.frotaComputador;
  const embarcacao = frota.find((item) => item.nome === nome)!;
  let atual = partida;
  for (let indice = 0; indice < embarcacao.tamanho; indice++) {
    const celula = {
      linha: embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? indice : 0),
      coluna: embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? indice : 0),
    };
    const jogadaJogador = alvo === 'jogador' ? linhaDeAtaque(indice) : celula;
    const jogadaComputador = alvo === 'jogador' ? celula : linhaDeAtaque(indice);
    const respostaJogador = atacar(atual, 'jogador', jogadaJogador);
    expect(respostaJogador.aceito).toBe(true);
    atual = respostaJogador.partida;
    const respostaComputador = atacar(atual, 'computador', jogadaComputador);
    expect(respostaComputador.aceito).toBe(true);
    atual = respostaComputador.partida;
  }
  return atual;
}

describe('IndicadorFrota', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [IndicadorFrota] });
  });

  function criar(partida: Partida) {
    const fixture = TestBed.createComponent(IndicadorFrota);
    fixture.componentRef.setInput('partida', partida);
    fixture.detectChanges();
    return fixture;
  }

  it('lista os cinco tipos com símbolo decorativo e nomes e quantidades acessíveis', () => {
    const fixture = criar(partidaInicial());
    const itens = [...fixture.nativeElement.querySelectorAll('li')] as HTMLElement[];
    expect(itens).toHaveLength(5);
    expect(itens.map((item) => item.getAttribute('aria-label'))).toEqual([
      'Porta-aviões: 1 de 1 restantes',
      'Encouraçado: 1 de 1 restantes',
      'Cruzador: 1 de 1 restantes',
      'Submarino: 1 de 1 restantes',
      'Destroyer: 1 de 1 restantes',
    ]);
    for (const item of itens) {
      expect(item.textContent).toContain('restantes');
      expect(item.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    }
    const texto = fixture.nativeElement.textContent as string;
    for (const modelo of FROTA_PADRAO) expect(texto).toContain(modelo.rotulo);
    expect(fixture.nativeElement.querySelector('h2')?.textContent).toBe('Situação da frota');
    fixture.destroy();
  });

  it('reduz a quantidade do tipo destruído sem alterar os demais', () => {
    const partida = destruirEmbarcacao(partidaInicial(), 'jogador', 'destroyer');
    const fixture = criar(partida);
    const destroyer = [...fixture.nativeElement.querySelectorAll('li')]
      .find((item) => item.getAttribute('aria-label')?.startsWith('Destroyer'));
    expect(destroyer?.getAttribute('aria-label')).toBe('Destroyer: 0 de 1 restantes');
    const demais = [...fixture.nativeElement.querySelectorAll('li')]
      .filter((item) => !item.getAttribute('aria-label')?.startsWith('Destroyer'));
    expect(demais).toHaveLength(4);
    for (const item of demais) expect(item.getAttribute('aria-label')).toContain('1 de 1 restantes');
    fixture.destroy();
  });

  it('permanece inalterado diante de destruições adversárias', () => {
    const partida = destruirEmbarcacao(partidaInicial(), 'computador', 'cruzador');
    const fixture = criar(partida);
    const rotulos = [...fixture.nativeElement.querySelectorAll('li')]
      .map((item) => item.getAttribute('aria-label'));
    expect(rotulos).toEqual([
      'Porta-aviões: 1 de 1 restantes',
      'Encouraçado: 1 de 1 restantes',
      'Cruzador: 1 de 1 restantes',
      'Submarino: 1 de 1 restantes',
      'Destroyer: 1 de 1 restantes',
    ]);
    fixture.destroy();
  });
});
