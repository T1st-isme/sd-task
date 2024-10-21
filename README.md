# Project Overview

## Requirements

- Node.js v20.11.0
- VS Code or Any Code Editor
- **npm** or **yarn** or **bun**
- MongoDB Atlas or Local MongoDB

## Installation

### Clone the repository

```bash
git clone https://github.com/T1st-isme/sd-task.git
```

### Go to the server directory

```bash
cd server
```

### Install dependencies

```bash
npm install
yarn install
```

### Start the development server

```bash
npm run start:dev
yarn start:dev
```

### Go to the client directory

```bash
cd ..\client\
```

### Install dependencies

```bash
npm install
yarn install
bun install
```

### Start the development server

```bash
npm run dev
yarn dev
bun dev
```

## Client-Side

The client-side of this application is built using [Next.js](https://nextjs.org), a React framework that enables server-side rendering and static site generation. It is bootstrapped with `create-next-app` and utilizes a variety of UI components and libraries to enhance the user experience.

### Key Features

- **Check Auth and Role**: Check auth and role with JWT
- **Managment State by Zustand**: Managment state by Zustand
- **Enable 2FA**: Enable 2FA with Google Authenticator
- **Reset Password**: Reset password by link in mail.

## Server-Side

The server-side is powered by [NestJS](https://nestjs.com), a progressive Node.js framework for building efficient and scalable server-side applications. It is structured to support a variety of features including authentication, logging, and more.

### Key Features

- **Rate Limit**: Rate limit Login.
- **Swagger API Documentation**: Automatically generated API documentation available at `/api`.
- **Activity Log**: Activity log with Prisma.
- **User Roles and Permissions**: User roles and permissions with Prisma.
- **Password Hashing**: Password hashing with bcrypt.
- **Send Mail**: Send mail with nestjs-modules/mailer.

## Database

The application uses Prisma as an ORM to interact with a MongoDB database, providing a type-safe database client and migrations.

## Environment Variables

```bash
DATABASE_URL=
JWT_SECRET=
JWT_PASSWORD_SECRET=
COOKIE_EXPIRES_TIME=
FRONTEND_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Getting Started

To get started with this project, clone the repository and follow the setup instructions in the respective `README.md` files located in the `client` and `server` directories.

## Deployment

I have deployed the project on Vercel.
Demo: https://sd-task-nine.vercel.app


## Note

- This project is only for educational purposes.
- This project is not for commercial use.
- I just deploy the FE on Vercel, BE need to run on local.

I hope you find this project useful and welcome any feedback or contributions!
