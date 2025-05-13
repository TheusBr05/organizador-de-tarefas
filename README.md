# Guia de Execução Local - Organizador de Atividades (Windows)

Este guia detalha os passos para configurar e executar o programa de organização de atividades em seu computador Windows.

## 1. Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

*   **Python:** Versão 3.9 ou superior. Você pode baixá-lo em [python.org](https://www.python.org/downloads/). Durante a instalação, marque a opção "Add Python to PATH".
*   **Node.js:** Versão 18.x ou superior (que inclui npm). Você pode baixá-lo em [nodejs.org](https://nodejs.org/).
*   **pnpm (opcional, mas recomendado para o frontend):** Após instalar Node.js, você pode instalar o pnpm globalmente abrindo o Prompt de Comando (CMD) ou PowerShell e digitando: `npm install -g pnpm`
*   **Git (opcional):** Para clonar os repositórios, se preferir. Caso contrário, você pode baixar os arquivos do projeto diretamente (por exemplo, como um arquivo ZIP).

## 2. Estrutura do Projeto

Você receberá os arquivos do projeto organizados da seguinte forma (ou poderá baixá-los e descompactá-los assim):

```
organizador_atividades/
|-- backend/      # Contém a aplicação Flask (Python)
|-- frontend/     # Contém a aplicação React (JavaScript)
|-- Readme.md   # Este arquivo
```

## 3. Configurando e Executando o Backend (Flask)

Siga os passos abaixo no diretório `organizador_atividades/backend/`.

1.  **Abra o Prompt de Comando (CMD) ou PowerShell** nesta pasta.
    *   Você pode navegar até a pasta usando o comando `cd caminho\para\organizador_atividades\backend`.

2.  **Crie um Ambiente Virtual Python:**
    ```bash
    python -m venv venv
    ```

3.  **Ative o Ambiente Virtual:**
    ```bash
    .\venv\Scripts\activate
    ```
    Seu prompt deve mudar para indicar que o ambiente virtual está ativo (ex: `(venv) C:\...`).

4.  **Instale as Dependências:**
    O arquivo `requirements.txt` já deve estar presente no diretório `backend` e foi atualizado para incluir `Flask-CORS`.
    ```bash
    pip install -r requirements.txt
    ```

5.  **Execute o Servidor Flask:**
    Navegue para o diretório `src` dentro de `backend`:
    ```bash
    cd src
    ```
    Então, execute:
    ```bash
    python main.py
    ```
    Você deverá ver mensagens indicando que o servidor Flask está rodando, geralmente em `http://127.0.0.1:5000/`. O CORS estará habilitado.

    **Mantenha este terminal aberto enquanto utiliza a aplicação.**

## 4. Configurando e Executando o Frontend (React com Tailwind CSS)

Siga os passos abaixo no diretório `organizador_atividades/frontend/`.

1.  **Abra um NOVO Prompt de Comando (CMD) ou PowerShell** nesta pasta.
    *   Você pode navegar até a pasta usando o comando `cd caminho\para\organizador_atividades\frontend`.

2.  **Instale as Dependências do Projeto:**
    Se você instalou `pnpm` (recomendado):
    ```bash
    pnpm install
    ```
    Caso contrário, usando `npm` (que vem com Node.js):
    ```bash
    npm install
    ```

3.  **Execute o Servidor de Desenvolvimento React:**
    Se você usou `pnpm`:
    ```bash
    pnpm run dev
    ```
    Caso contrário, usando `npm`:
    ```bash
    npm run dev
    ```
    Você deverá ver mensagens indicando que o servidor de desenvolvimento Vite (React) está rodando e acessível em `http://localhost:5173/`.

    **Mantenha este terminal aberto enquanto utiliza a aplicação.**

## 5. Acessando a Aplicação

1.  Certifique-se de que **ambos os servidores (backend e frontend) estejam em execução** em seus respectivos terminais.
2.  Abra seu navegador de internet (Chrome, Firefox, Edge, etc.).
3.  Digite o seguinte endereço na barra de URLs: `http://localhost:5173/`

A aplicação de organização de atividades deve carregar no navegador.

## 6. Solução de Problemas Comuns

*   **Erro `ModuleNotFoundError` no backend:** Certifique-se de que o ambiente virtual Python (`venv`) está ativado antes de rodar `python main.py` e que as dependências foram instaladas corretamente com `pip install -r requirements.txt`.
*   **Frontend não carrega ou mostra erros de API:**
    *   Verifique se o servidor backend Flask está rodando no `http://127.0.0.1:5000/`.
    *   Verifique o console do navegador (geralmente pressionando F12) para mensagens de erro detalhadas. Podem ser erros de CORS (improvável com a configuração padrão do Flask para desenvolvimento) ou o backend não estar acessível.
*   **Portas já em uso:** Se a porta 5000 (backend) ou 5173 (frontend) estiverem em uso por outro programa, você precisará parar esse programa ou configurar as aplicações para usarem portas diferentes (isso exigiria alterações nos códigos-fonte e configuração).

Se encontrar outros problemas, por favor, anote as mensagens de erro e os passos que levaram ao erro para que eu possa ajudar a diagnosticar.

## 7. Parando a Aplicação

Para parar a aplicação, volte para cada um dos terminais (o do backend e o do frontend) e pressione `Ctrl + C`. Confirme se necessário.
Para desativar o ambiente virtual do backend, no terminal do backend, digite `deactivate` após parar o servidor.


