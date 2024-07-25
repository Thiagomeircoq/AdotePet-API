# Use a imagem oficial do PostgreSQL como base
FROM postgres:latest

# Defina variáveis de ambiente para o PostgreSQL
ENV POSTGRES_USER=<postgres>
ENV POSTGRES_PASSWORD=<123>
ENV POSTGRES_DB=<dogpay>

# Copie um script SQL para o container e execute-o na inicialização (opcional)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expor a porta padrão do PostgreSQL
EXPOSE 5435