FROM node:18
WORKDIR /api
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
RUN npm run build
COPY public.crt public.crt
COPY private.key private.key
COPY .envdocker .env
CMD npm start
EXPOSE 8000
