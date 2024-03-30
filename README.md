# Golden Raspberry Awards API

## Descrição
Esta API possibilita a leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Pré-requisitos
- Node.js instalado
- Arquivo CSV contendo os dados dos filmes (movielist.csv)

## Instalação
1. Clone o repositório: `git clone https://github.com/seu-usuario/seu-projeto.git`
2. Instale as dependências: `npm install`
3. Adicione o arquivo de importação com o nome movielist.csv na pasta raiz do projeto
4. Inicie a aplicação: `npm start`

## Endpoints
### Obter o produtor com maior intervalo entre dois prêmios consecutivos e o que obteve dois prêmios mais rápido
- Método: GET
- Rota: /raspberries/interval

## Testes
Para executar os testes:
```bash
npm test
