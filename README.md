# Description

This is a demo recreating the [Tesla hop](https://shop.tesla.com/category/apparel) using Next.js

## Run on dev

- Clone the repository.
- Create a copy of the `.env.template` and rename it to `.env` and change the environment variables.
- Install dependencies `npm install`
- Get the database up `docker compose up -d`
- Run Primsa migrations `npx prisma migrate dev`
- Run seed `npm run seed`
- Run the project `npm run dev`
- Clean localstorage

## Run on prod
