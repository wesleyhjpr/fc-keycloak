FROM node:19.0-slim

# Instala ferramentas de rede básicas
# RUN apt-get update && apt-get install -y \
#     iputils-ping \
#     dnsutils \
#     && rm -rf /var/lib/apt/lists/*

RUN apt-get update -y 

WORKDIR /home/node/app

USER node

CMD ["tail", "-f", "/dev/null"]