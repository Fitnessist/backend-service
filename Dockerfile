# Build the app
FROM node:lts-alpine as build
LABEL stage=dockerbuilder
WORKDIR /usr/app
COPY . .
RUN npm install --production --silent && mv node_modules ../
COPY ["package.json", "package-lock.json*", "./"]
RUN npm run lint && npm run test:staged
RUN npm run build

# Create the production image
FROM node:lts-alpine 
ENV NODE_ENV=production
WORKDIR /usr/production/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY --from=builder /usr .
CMD ["npm", "start"]