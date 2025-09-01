# Processo Seletivo AutoU
> ⚠️ **Importante:** Para que a aplicação funcione, você precisa da sua própria chave de API do Google Gemini.
> link para testar em produção: https://aistudio.google.com/app/apikey

## Sobre o Teste

Este teste é uma solução web desenvolvida como parte do processo seletivo da AutoU. O objetivo é automatizar a análise e classificação de e-mails, utilizando Inteligência Artificial para determinar se um e-mail é produtivo ou não e sugerir uma resposta apropriada, otimizando o tempo da equipe e automatizando tarefas manuais.

A aplicação permite que o usuário insira o conteúdo de um e-mail (seja por texto ou upload de arquivo `.txt`/`.pdf`) e recebe em troca uma análise completa, gerada pela API do Google Gemini.

## Funcionalidades

* **Análise de Texto e Arquivos:** Suporte para análise de texto livre ou upload de arquivos `.txt` e `.pdf`.
* **Classificação com IA:** Utiliza o Google Gemini para classificar e-mails em duas categorias:
    * **Produtivo:** E-mails que demandam uma ação ou resposta.
    * **Improdutivo:** E-mails que não necessitam de ação imediata (agradecimentos, felicitações, etc.).
* **Sugestão de Resposta:** A IA gera uma sugestão de resposta coerente com a classificação do e-mail.
* **Interface Reativa:** Frontend construído com Angular, proporcionando uma experiência de usuário fluida e moderna.
* **Containerização:** Aplicação totalmente containerizada com Docker, garantindo portabilidade e facilidade de execução.

## Tecnologias Utilizadas

* **Frontend:** Angular 17 (Standalone Components, TypeScript, SCSS)
* **Backend:** Python 3.10 com Flask
* **Inteligência Artificial:** Google Gemini API
* **Processamento de Linguagem Natural (NLP):** Biblioteca NLTK
* **Servidor de Produção (Backend):** Gunicorn
* **Servidor Web (Frontend):** Nginx
* **Containerização:** Docker e Docker Compose

---

## Arquitetura do Projeto

A aplicação foi estruturada seguindo as melhores práticas de desenvolvimento para garantir organização, escalabilidade e manutenibilidade.

### Backend (Python/Flask)

O backend foi desenvolvido utilizando o padrão **Application Factory** com **Blueprints**, separando as responsabilidades do código:

* **`run.py`**: Ponto de entrada da aplicação, responsável apenas por criar e iniciar o servidor.
* **`app/`**: Pacote principal da aplicação.
    * **`__init__.py`**: Contém a "fábrica" `create_app()`, que inicializa o Flask, configura o CORS e as chaves de API, e registra as rotas.
    * **`services/`**: Camada de lógica de negócio. As funções aqui não dependem do Flask e são responsáveis pela maior parte do trabalho.
        * `nlp_service.py`: Contém a lógica para o pré-processamento do texto com NLTK.
        * `gemini_service.py`: Contém a lógica para formatar o prompt e se comunicar com a API do Gemini.
    * **`api/routes.py`**: Camada de controle (Controller). Define os endpoints da API (ex: `/classify`), lida com as requisições HTTP, chama os serviços apropriados e formata a resposta JSON.

### Pré-requisitos

* **Docker** e **Docker Compose** instalados na sua máquina.

### Passo a Passo

**1. Clone o Repositório**
```bash
git clone https://github.com/Victor-Brito/Processo-Seletivo-AutoU.git
cd nome-do-repositorio
```

**2. Configure sua Chave da API do Gemini**

> ⚠️ **Importante:** Para que a aplicação funcione, você precisa da sua própria chave de API do Google Gemini.

* Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
* Crie uma cópia do arquivo de exemplo `.env.example`. Você pode fazer isso manualmente ou com o comando:
    ```bash
    cp .env.example .env
    ```
* Abra o novo arquivo `.env` e cole sua chave de API do Gemini após o sinal de igual:
    ```
    GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
    ```

**3. Inicie a Aplicação com Docker Compose**

* Volte para a pasta raiz do projeto.
* Execute o seguinte comando. Ele irá construir as imagens do frontend e backend e iniciar os containers.
    ```bash
    docker-compose up --build
    ```

**4. Acesse a Aplicação**

* Aguarde os logs se estabilizarem.
* Abra seu navegador e acesse: `http://localhost:4200`

### Como Parar a Aplicação
Para parar todos os containers, vá para o terminal onde o `docker-compose` está rodando e pressione `Ctrl + C`.
