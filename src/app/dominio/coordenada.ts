export const TAMANHO_TABULEIRO = 10;

export interface Coordenada {
  readonly linha: number;
  readonly coluna: number;
}

export function validarCoordenada(coordenada: Coordenada): boolean {
  return Number.isInteger(coordenada.linha) && Number.isInteger(coordenada.coluna)
    && coordenada.linha >= 0 && coordenada.linha < TAMANHO_TABULEIRO
    && coordenada.coluna >= 0 && coordenada.coluna < TAMANHO_TABULEIRO;
}

export function rotulo(coordenada: Coordenada): string {
  if (!validarCoordenada(coordenada)) throw new Error('Coordenada inválida');
  return `${String.fromCharCode(65 + coordenada.linha)}${coordenada.coluna + 1}`;
}

export function deRotulo(valor: string): Coordenada | undefined {
  const resultado = /^([A-J])(10|[1-9])$/.exec(valor.trim().toUpperCase());
  if (!resultado) return undefined;
  return { linha: resultado[1].charCodeAt(0) - 65, coluna: Number(resultado[2]) - 1 };
}

export function chave(coordenada: Coordenada): string {
  return `${coordenada.linha}:${coordenada.coluna}`;
}
