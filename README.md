# Performance of Dosen Web Application

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Resources](#resources)
- [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
- [Getting Started](#getting-started)
- [Acknowledgments](#acknowledgments)

## Overview

Performance of Dosen is a full-stack web application that enables users to handle quesioner.

## Features

- User Authentication: All of features authentication.
- Quesioner: Users can send, and archive their quesioner.
- Performance: Users can see dashboard performance their quesioner.
- Admin: Users can manage all data like teacher, and class.

## Resources

- Page View Users (Siswa)

![home-users-siswa](public/home-users-siswa.png)

- Page View Users (Teacher)

![home-users-teacher](public/home-users-teacher.png)

- Page View Users (Admin)

![home-users-admin](public/home-users-admin.png)


## Technologies Used

### Frontend

- NodeJs
- React (Framework NextJs)
- TailwindCSS (With Shadcn UI)
- Better Auth
- React Query
- React Hook Form
- Pipeline CI/CD
- Docker

### Backend

- NodeJs
- NextJs Handler
- Kysely
- PostgreSQL
- Pipeline CI/CD
- Docker

## Getting Started

To get started with the Performance of Dosen web application project, follow the setup instructions in the respective directories:

- [Instructions](README.md)

#### Instal All Module

Note: Don't forget to install pnpm, becouse this project using pnpm for build tool.

```
pnpm install
```

#### Migrate Table

Note: Don't forget to migrate all tables.

```
pnpm better:auth:migrate
```

#### Run Dev (run development server)

```
pnpm dev
```

#### Run Build

```
pnpm build
```

## Acknowledgments

Special thanks to the developers and maintainers of the technologies used in this project. Their hard work and dedication make projects like this possible.
