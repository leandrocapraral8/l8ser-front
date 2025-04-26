# Use uma imagem oficial do Node como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de dependências para o container
COPY package.json pnpm-lock.yaml ./

# Instale o pnpm globalmente
RUN npm install -g pnpm@latest

# Instale as dependências do projeto
RUN pnpm install

# Copie todo o projeto para o diretório de trabalho
COPY . .

# Exponha a porta que o frontend utiliza
EXPOSE 3000

# Comando para rodar o frontend
CMD ["pnpm", "dev"]
