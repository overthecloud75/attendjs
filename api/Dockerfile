FROM node:18.18.2
ARG REGISTRY

RUN npm config set registry ${REGISTRY}
RUN npm install -g npm@10.2.0
RUN mkdir /webApp
WORKDIR /webApp

RUN chown -R 1000:1000 .
RUN chmod -R 744 . 

COPY ./ ./ 
RUN npm install

USER 1000
CMD ["node", "index.js"]