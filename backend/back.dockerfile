FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN apk update && apk upgrade

EXPOSE 4000
EXPOSE 4042

# ENTRYPOINT [ "/bin/sh", "-c", "npx prisma migrate deploy && yarn run start" ]

#ENTRYPOINT [ "/bin/sh", "-c", "arn add @nestjs/cli &&  yarn run start" ]

ENTRYPOINT [ "/bin/sh", "-c", "yarn && yarn add @nestjs/cli &&  yarn run start" ]
# npx prisma migrate deploy && yarn run start" ]
