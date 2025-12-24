FROM python:3.13.0a4-alpine3.18
ARG REGISTRY

RUN apk add --no-cache nmap
RUN apk add --no-cache wireless-tools
RUN apk add --no-cache tzdata

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

RUN mkdir /webApp
WORKDIR /webApp

COPY ./ ./

#RUN adduser -D smartwork
#RUN chown -R smartwork:smartwork .
#RUN chmod -R 744 .

#USER smartwork

RUN pip3 install -i ${REGISTRY} -r requirements.txt

CMD ["python3", "main.py"]