## What is this?
simple blogging service

## Features
- Built with [Fastify](https://github.com/fastify/fastify), [Prisma](https://github.com/prisma/prisma), and SQLite
- Token based authentication/authorization (**NOT** JWT)
- Json schema validation (auto-generated from prisma schema using [prisma-json-schema-generator](https://github.com/valentinpalkovic/prisma-json-schema-generator))

### Authenticated users can
- Create post
- Publish post
- Post comment
- View their unpublished posts (alongside others published posts)

### Unauthenticated users can
- View published posts

## How to run
- `npm install`
- `npx prisma generate`
- `npm start`
- Install [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VSCode
- Open `client.http` in VSCode and click around
- Hit the `Login` endpoint to get a token to use in subsequent requests
