# xy-inc-poi
Auxiliar pessoas na localização de ponto de interesse (POIs)

Aplicação é uma plataforma que fornecerá toda a inteligência ao dispositivo que irá que auxiliar pessoas na localização de pontos de interesse (POIs). Esta plataforma deve será baseada em serviços, de forma a flexibilizar a integração, que deverão contemplar:
- Cadastro de pontos de interesse, com 3 atributos: Nome do POI, coordenada X (inteiro não negativo) e coordenada Y (inteiro não negativo).
- Listagem de todos os POIs encontrados.
- Listagem de POIs por proximidade.

# Set up do ambiente
- Necessária a instalação do Node.js (versão utilizada 6.0.0, utilizar uma equivalente) https://nodejs.org/en/download/
- Necessária a instalação do mongoDB Server (https://www.mongodb.com/download-center?jmp=nav#community)
- Crie uma pasta para armazenar os dados do banco através do prompt executando: `sudo mkdir -p /data/db`
- Configure o path para os dados da base de dados através de um prompt de comando executando: `sudo mongod --dbpath=/data/db`
- Clone o projeto através da url https://github.com/tsr-thulio/xy-inc-poi.git
- Entre na pasta do projeto e instale as dependências executando o comando: `npm install`

# Execução da aplicação
- Se ainda não estiver rodando, inicie o mongoDB Server na máquina através de um prompt de comando com do comando `mongod` (pode ser necessário privilégios de administrador, neste caso execute `sudo mongod`).
  - OBS.: quando o mongoDB estiver sendo executado, o prompt estará com a seguinte mensagem: `[thread1] waiting for connections on port 27017`
- Através de outro prompt de comando, na pasta raiz do projeto execute o comando: `npm start`
- Quando a aplicação estiver ok o prompt exibirá a mensagem: "Server initialized"

# Execução de testes unitários
- Se ainda não estiver rodando, inicie o mongoDB Server na máquina através de um prompt de comando com do comando `mongod` (pode ser necessário privilégios de administrador, neste caso execute `sudo mongod`).
  - OBS.: quando o mongoDB estiver sendo executado, o prompt estará com a seguinte mensagem: `[thread1] waiting for connections on port 27017`
- Através de um prompt de comando, na pasta raiz do projeto execute o comando: `npm test`

# Utilizando a aplicação
- Com a aplicação rodando você poderá realizar as 3 operações requeridas através de um aplicativo para testes de Web Api como o Postman por exemplo. Utilize as seguintes informações:
- POST (Inserir POIs)
  - URL: http://localhost:9000/poi
  - Exemplo de body para a request: `{ "x": 1, "y": 1, "name": "POI 1"}`
  - Headers: `Content-Type: application/json`
- GET (Listagem de todos os POIs)
  - URL: http://localhost:9000/poi
- GET (Listagem de POIs por proximidade)
  - URL: http://localhost:9000/poi/proximity
  - Os parâmetros `x` e `y` deverão ser informados por querystring.
  - Exemplo de request: http://localhost:9000/poi/proximity?x=10&y=20