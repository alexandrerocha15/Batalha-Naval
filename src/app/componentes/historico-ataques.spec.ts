import { TestBed } from '@angular/core/testing';
import { HistoricoAtaques } from './historico-ataques';
import { Ataque } from '../dominio/partida';

const ataques: Ataque[] = [
  { alvo: 'computador', coordenada: { linha: 1, coluna: 3 }, resultado: 'destruicao', embarcacao: 'cruzador' },
  { alvo: 'jogador', coordenada: { linha: 4, coluna: 4 }, resultado: 'acerto' },
  { alvo: 'computador', coordenada: { linha: 3, coluna: 1 }, resultado: 'acerto' },
  { alvo: 'jogador', coordenada: { linha: 0, coluna: 0 }, resultado: 'destruicao', embarcacao: 'destroyer' },
];

describe('HistoricoAtaques', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HistoricoAtaques] });
  });

  function criar(ataquesDaPartida: readonly Ataque[], reduzido: boolean) {
    const fixture = TestBed.createComponent(HistoricoAtaques);
    fixture.componentRef.setInput('ataques', ataquesDaPartida);
    fixture.componentRef.setInput('reduzido', reduzido);
    fixture.detectChanges();
    return fixture;
  }

  function textos(fixture: ReturnType<typeof criar>): string[] {
    return [...fixture.nativeElement.querySelectorAll('li')].map((item) => item.textContent!.trim());
  }

  it('exibe todos os ataques no modo completo com a identificação da embarcação destruída', () => {
    const fixture = criar(ataques, false);
    const linhas = textos(fixture);
    expect(linhas).toHaveLength(4);
    expect(linhas[0]).toBe('Seu ataque em B4: destruição — Cruzador destruído.');
    expect(linhas[1]).toBe('Ataque do computador em E5: acerto.');
    expect(linhas[2]).toBe('Seu ataque em D2: acerto.');
    expect(linhas[3]).toBe('Ataque do computador em A1: destruição — Destroyer destruído.');
    fixture.destroy();
  });

  it('mantém no máximo dois itens no modo reduzido, um por lado, na ordem cronológica', () => {
    const fixture = criar(ataques, true);
    const linhas = textos(fixture);
    expect(linhas).toHaveLength(2);
    expect(linhas[0]).toBe('Seu ataque em D2: acerto.');
    expect(linhas[1]).toBe('Ataque do computador em A1: destruição — Destroyer destruído.');
    expect(linhas.join(' ')).not.toContain('B4');
    expect(linhas.join(' ')).not.toContain('E5');
    fixture.destroy();
  });

  it('preserva o último ataque de cada lado mesmo quando a lista só tem jogadas de um lado', () => {
    const soAtaquesDoJogador: Ataque[] = ataques.filter((ataque) => ataque.alvo === 'computador');
    const fixture = criar(soAtaquesDoJogador, true);
    const linhas = textos(fixture);
    expect(linhas).toHaveLength(1);
    expect(linhas[0]).toBe('Seu ataque em D2: acerto.');
    fixture.destroy();
  });

  it('descreve o resultado sem nomear embarcação quando não há destruição', () => {
    const fixture = criar([ataques[2]], false);
    const linhas = textos(fixture);
    expect(linhas).toEqual(['Seu ataque em D2: acerto.']);
    expect(linhas[0]).not.toContain('destruído');
    fixture.destroy();
  });
});
