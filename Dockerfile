FROM node:18
WORKDIR /api
COPY . .
RUN npm install
RUN npm run build
WORKDIR /etc/ssl/certs/
COPY ./public.crt ./public.crt
COPY ./private.key ./private.key
WORKDIR /api
COPY .envdocker .env
CMD npm run vant-api & npm run vant-recorder
EXPOSE 8000