FROM node:alpine

WORKDIR /app

ADD . .

RUN apk add --no-cache dumb-init bash whois git && yarn install --production

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT 3000

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["yarn", "start"]
