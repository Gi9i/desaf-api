# Documentação da API

## Rota: / (Raiz)
- **Método:** GET
- **Descrição:** Essa rota representa a página inicial ou raiz da API.
- **Ação no Postman:** Selecione o método GET e insira a URL da sua API (por exemplo, `https://desafio-api-l4nl.onrender.com/`).
- **Observação:** Certifique-se de que o servidor está em execução para receber a solicitação.

## Rota: /auth/register
- **Método:** POST
- **Descrição:** Essa rota é usada para registrar um novo usuário na aplicação.
- **Input:**
    ```json
    {
      "nome": "nome",
      "email": "exemple@exemple.com",
      "senha": "senha",
      "confirmSenha": "senha",
      "telefones": {
        "numero": "123456789",
        "ddd": "11"
      }
    }
    ```
- **Ação no Postman:** Selecione o método POST, insira a URL completa da rota (por exemplo, `https://desafio-api-l4nl.onrender.com/auth/register`), e adicione o corpo da requisição como dados brutos (raw).

## Rota: /auth/login
- **Método:** POST
- **Descrição:** Essa rota é utilizada para autenticar um usuário existente.
- **Input:**
    ```json
    {
      "email": "exemple@exemple.com",
      "senha": "teste"
    }
    ```
- **Ação no Postman:** Selecione o método POST, insira a URL completa da rota (por exemplo, `https://desafio-api-l4nl.onrender.com/auth/login`), e adicione o corpo da requisição como dados brutos (raw).

## Rota: /users/:id
- **Método:** GET
- **Descrição:** Essa rota é utilizada para obter informações de um usuário específico com base no ID.
- **Exemplo de URL:** `https://desafio-api-l4nl.onrender.com/users/6574dd5b8c48dc0bf70c0550`
- **Ação no Postman:** Selecione o método GET e insira a URL completa da rota com o ID específico.

### Autorização (Authorization)
- **Tipo:** Bearer Token
- **Token:** [Seu token aqui]
- **Ação no Postman:** Vá até a guia "Authorization", escolha o tipo "Bearer Token" e insira o token que você possui na caixa apropriada.

### Enviar Requisição
Após configurar a URL e a autorização, clique no botão "Send" para enviar a solicitação.
