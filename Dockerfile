FROM node:14-alpine
LABEL maintainer="Colin Griffin <colin@krum.io>"

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apt-get install expect -y

COPY package.json package-lock.json /temp/
RUN cd temp && npm ci --unsafe-perm=true --allow-root && npm install -g nodemon

COPY . /src

RUN mv /temp/node_modules /src/node_modules

WORKDIR /src

EXPOSE 3002

CMD ["npm", "start"]
