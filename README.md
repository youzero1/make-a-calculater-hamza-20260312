# Calculator App

A fullstack calculator web application built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- Fully functional calculator with digits, arithmetic operations, decimal, equals, and clear
- Chaining multiple operations
- Live display of current input and expression
- Calculation history stored in SQLite database
- History page showing past calculations
- Ability to clear all history
- Division by zero error handling

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Database:** SQLite via TypeORM + better-sqlite3
- **Styling:** Tailwind CSS

## Getting Started

### Local Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Using Docker

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable        | Default                   | Description              |
|-----------------|---------------------------|---------------------------|
| DATABASE_PATH   | `./data/calculator.db`    | Path to SQLite database  |

## API Endpoints

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | /api/calculations  | Fetch calculation history  |
| POST   | /api/calculations  | Save a new calculation     |
| DELETE | /api/calculations  | Clear all history          |
