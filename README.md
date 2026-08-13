# Desafio Técnico Veritas - Mini Kanban Fullstack

Este projeto é uma aplicação de gerenciamento de tarefas estilo Kanban, construída como solução para o desafio técnico da Veritas. A aplicação permite a criação, edição, movimentação e exclusão de tarefas, contando com persistência de dados e orquestração completa via Docker.

## Tecnologias Utilizadas

**Frontend:**
- React (com Vite)
- Tailwind CSS
- HTML5 Drag and Drop API (Nativa)

**Backend:**
- Go (Golang)
- Gin Framework
- Persistência em arquivo JSON (`tasks.json`)
- `httptest` (Testes automatizados)

**Infraestrutura:**
- Docker & Docker Compose
- Nginx (Servidor de arquivos estáticos no frontend)

## Arquitetura e Fluxo de Dados

A aplicação foi desenhada separando claramente as responsabilidades de interface, controladores e modelos de dados.

```text
[ Cliente / Navegador ]
          |
    (Drag & Drop / UI)
          v
[ Frontend React (Porta 5173) ]
          |
    (HTTP REST / JSON)
          v
[ Backend Go Gin (Porta 8080) ]
          |
    (Leitura / Escrita em Disco)
          v
[ Banco de Dados (tasks.json) ]

`````
Como Executar o Projeto

A maneira mais recomendada e fácil de testar a aplicação é utilizando o Docker.

Via Docker (Recomendado)

Certifique-se de ter o Docker Desktop em execução e execute o comando na raiz do projeto:

````text
docker compose up --build
`````
Após a inicialização:

Frontend: http://localhost:5173

API: http://localhost:8080


Execução Local (Modo de Desenvolvimento)

Caso queira executar os serviços separadamente sem Docker:

Backend:

````text
cd backend
go run .
````
Frontend:

Em outro terminal:

````text
cd frontend
npm install
npm run dev
````

Como Rodar os Testes

Para executar os testes automatizados da API em Go, navegue até a pasta do backend:

````text
cd backend
go test -v
````

👤 Autor

Sóstenes Marques Maciel

