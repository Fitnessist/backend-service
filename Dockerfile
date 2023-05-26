# Build the app
FROM node AS builder
LABEL stage=dockerbuilder
RUN apt-get update && apt-get install -y jq
WORKDIR /usr/app
COPY . .
COPY ["package.json", "package-lock.json*", ".eslintrc.json", "./"]
RUN jq 'del(.scripts.prepare)' package.json > temp.json && mv temp.json package.json
RUN npm install --silent && mv node_modules ../
RUN npm run build

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/production/app
COPY --from=builder ["/usr/app/package.json", "/usr/app/package-lock.json*", "./"] 
RUN npm install --production --silent && mv node_modules ../
COPY --from=builder /usr/app . 
EXPOSE 8000
RUN chown -R node /usr/production/app
USER node
CMD ["npm", "start"]
