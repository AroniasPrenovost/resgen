# Build a SaaS AI Platform with Next.js 13, React, Tailwind, Prisma, Stripe | Full Tutorial 2023

This is a repository for Build a SaaS AI Platform with Next.js 13, React, Tailwind, Prisma, Stripe | Full Tutorial 2023.

[VIDEO TUTORIAL](https://www.youtube.com/watch?v=ffJ38dBzrlY)

Features:

- Tailwind design
- Tailwind animations and effects
- Full responsiveness
- Clerk Authentication (Email, Google, 9+ Social Logins)
- Client form validation and handling using react-hook-form
- Server error handling using react-toast
- Image Generation Tool (Open AI)
- Video Generation Tool (Replicate AI)
- Conversation Generation Tool (Open AI)
- Music Generation Tool (Replicate AI)
- Page loading state
- Stripe monthly subscription
- Free tier with API limiting
- How to write POST, DELETE, and GET routes in route handlers (app/api)
- How to fetch data in server react components by directly accessing database (WITHOUT API! like Magic!)
- How to handle relations between Server and Child components!
- How to reuse layouts
- Folder structure in Next 13 App Router

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/next13-ai-saas.git
```

### Install packages

```shell
npm i
```

### Setup .env file
```shell
cp .env-sample .env
```

### Setup Prisma

Add Prisma 

```shell
npm i -D prisma
```

Add MySQL Database 
--> via PlanetScale DB: https://app.planetscale.com/your_github_account

```shell
npx prisma db push

```

if things are busted and prisma studio isn't working..

```shell
npx prisma migrate reset && npx prisma generate && npx prisma db push 
```

### Start the app [MUST BE RUNNING]

```shell
npm run dev
```

### Prisma studio [MUST BE RUNNING]
```shell
npx prisma studio # runs at http://localhost:5555/
```


### Stripe  [MUST BE RUNNING] (log shows webhook signing secret ('whsec_...'))

```shell
stripe listen --forward-to localhost:3000/api/webhook

```
 
4:25:30 discussing webhooks setup for dev and prod (one-time setup (I think))

https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local


### Crisp (chatbot) @ 5:02:00

- add prod URL to this interface

https://app.crisp.chat/initiate/signup/?locale=en

(has to go in /components/crisp-chat.tsx)

```
<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="48750f03-61e3-42f0-b0db-b100d21cf9f7";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
```

### Running locally checklist

1. PlanetScale DB is running
2. have `npm run dev` running
3. have Stripe running


## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
