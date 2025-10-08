FROM node:22.20.0-alpine
ARG REGISTRY

RUN apk add --no-cache tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

RUN npm config set registry ${REGISTRY}
RUN npm install -g npm@11.6.1
RUN mkdir /webApp
WORKDIR /webApp

COPY ./ ./

RUN adduser -D smartwork
RUN chown -R smartwork:smartwork .
RUN chmod -R 744 .

USER smartwork

RUN npm install 

CMD ["node", "index.js"]