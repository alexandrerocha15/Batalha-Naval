# Spec Delta

## Purpose

Define a identidade visual exibida na aba do navegador, garantindo que o ícone do navio represente a Batalha Naval e permaneça disponível nos ambientes local e de publicação.

## ADDED Requirements

### Requirement: Ícone da aba do navegador

A aplicação SHALL declarar a imagem `navio.png`, publicada a partir da pasta `public`, como ícone da aba do navegador.

#### Scenario: Ícone do navio exibido

- **WHEN** a aplicação é aberta em um navegador
- **THEN** a aba exibe o ícone do navio em vez do favicon padrão do Angular

#### Scenario: Favicon padrão removido

- **WHEN** o documento da aplicação é inspecionado
- **THEN** não há referência ao `favicon.ico` padrão do Angular

### Requirement: Fundo transparente do ícone

O ícone SHALL preservar o fundo transparente da imagem original, sem recorte, preenchimento ou conversão que introduza uma cor de fundo.

#### Scenario: Ícone sobre fundos variados

- **WHEN** o ícone é exibido sobre a barra de abas clara ou escura
- **THEN** o contorno do navio aparece sem moldura ou bloco de cor ao redor

### Requirement: Disponibilidade local e no GitHub Pages

O ícone SHALL ser carregado tanto na execução local quanto no site publicado no GitHub Pages, acompanhando o caminho base configurado para cada ambiente.

#### Scenario: Execução local

- **WHEN** a aplicação é servida localmente a partir da raiz
- **THEN** o navegador carrega o ícone do navio sem erro de recurso não encontrado

#### Scenario: Publicação no GitHub Pages

- **WHEN** a aplicação é publicada no subdiretório `/Batalha-Naval/` do GitHub Pages
- **THEN** o navegador carrega o ícone do navio a partir desse subdiretório, sem erro de recurso não encontrado
