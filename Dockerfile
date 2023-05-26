# Build the app
FROM node AS builder
LABEL stage=dockerbuilder
RUN apt-get update && apt-get install -y jq
WORKDIR /usr/app
COPY . .
COPY ["package.json", "package-lock.json*", ".eslintrc.json", "./"]
RUN jq 'del(.scripts.prepare)' package.json > temp.json && mv temp.json package.json
ARG APP_HOST
ARG APP_PORT
ARG DATABASE_NAME
ARG DATABASE_HOST
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ENV DATABASE_NAME=$DATABASE_NAME
ENV DATABASE_HOST=$DATABASE_HOST
ENV DATABASE_USER=$DATABASE_USER
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD
RUN npm install --silent && mv node_modules ../
RUN npm run build

FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/production/app
COPY --from=builder ["/usr/app/package.json", "/usr/app/package-lock.json*", "./"] 
ENV APP_HOST=$APP_HOST
ENV APP_PORT=$APP_PORT
ENV DATABASE_NAME=$DATABASE_NAME
ENV DATABASE_HOST=$DATABASE_HOST
ENV DATABASE_USER=$DATABASE_USER
ENV DATABASE_PASSWORD=$DATABASE_PASSWORD
ENV DATABASE_URL="postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}"
RUN npm install --production --silent && mv node_modules ../
COPY --from=builder /usr/app . 
EXPOSE 8000
RUN chown -R node /usr/production/app
USER node
CMD ["npm", "start"]
