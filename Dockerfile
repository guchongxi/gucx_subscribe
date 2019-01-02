FROM keymetrics/pm2:latest-alpine

LABEL description="顾重(gucx_subscribe) 订阅号自动AI回复" \
  maintainer=guchongxi@gmail.com

ENV NODE_ENV=production \
  NPM_CONFIG_LOGLEVEL=warn

WORKDIR /usr/src/app

COPY . .

RUN npm install --production --slient \
  && ls -a

EXPOSE 8181

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
