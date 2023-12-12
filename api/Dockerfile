FROM node:18.19.0-alpine
ARG REGISTRY

RUN npm config set registry ${REGISTRY}
RUN npm install -g npm@10.2.0
RUN mkdir /webApp
WORKDIR /webApp

COPY ./ ./

RUN adduser -D smartwork
RUN chown -R smartwork:smartwork .
RUN chmod -R 744 .

USER smartwork

RUN npm install 

CMD ["node", "index.js"]