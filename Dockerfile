FROM node:18
WORKDIR /api
COPY package.json package.json
RUN npm install
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build
WORKDIR /etc/ssl/certs/
COPY public.crt ./public.crt
COPY private.key ./private.key
WORKDIR /api
COPY .envdocker .env
CMD npm start
EXPOSE 8000