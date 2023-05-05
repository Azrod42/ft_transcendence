FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN ls -la && sh -c yarn install 

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "yarn install --non-interactive && yarn run build && yarn global add serve && serve -s build -l 3000" ]
