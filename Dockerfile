FROM keymetrics/pm2:latest-alpine
ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /usr/src/app

# Bundle APP files
COPY . .

# Install app dependencies
RUN npm install --production --slient

# Expose the listening port of your app
EXPOSE 8181

# Show current folder structure in logs
# -a, –all 列出目录下的所有文件，包括以 . 开头的隐含文件
RUN ls -a

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
