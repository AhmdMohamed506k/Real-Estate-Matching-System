# Real Estate Matching System: Backend API

Backend API for a centralized real estate platform that connects property **offers** with client **requests** through automatic matching. Built as a paid freelance project for a client in Saudi Arabia; this repository contains the backend delivered to the client.

> **Draft:** items marked `TODO` still need your input.

## The Problem

Real estate brokers match supply and demand manually. The client wanted a system that links offers to requests automatically, notifies the brokers involved, and gives management one place to see market activity.

## Core Concepts

- **Offers:** land, plans, or projects for sale, with classification (residential, commercial, industrial, investment), condition (raw / developed), location, area range, price, exclusivity, and the responsible broker.
- **Requests:** what a client is looking for (type, usage, location, area, budget, priority) and the broker who owns the request.
- **Matching engine:** compares offers and requests on property type, usage, location, area, and price/budget, and returns possible matches with a compatibility score and both brokers.
- **Roles:** Admin, Manager, Broker. Each broker sees only their own offers, requests, and matches.

## Features

- [x] Authentication (JWT) and role-based access control (Admin / Manager / Broker)
- [x] Offers management (CRUD, classification, exclusivity)
- [x] Requests management (CRUD, priority levels)
- [x] Matching engine with compatibility percentage
- [x] Match notifications to both brokers, with status tracking (new, contacted, deal in progress, closed)
- [x] Dashboard statistics (counts, most active brokers, most requested areas)
- [x] Advanced search and filtering
- [x] Reports and export (Excel / PDF)
- [x] Unlimited user management

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB with Mongoose |
| Caching | Redis (`ioredis`) |
| Auth | JSON Web Tokens and `bcrypt` |
| Email | Nodemailer |
| IDs | nanoid |
| Process manager | PM2 |
| Config | dotenv |

## How Matching Works

`TODO:` 3-5 lines on how the score is calculated (which fields, any weights, any thresholds).

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis

### Installation

```bash
git clone https://github.com/AhmdMohamed506k/<repo-name>.git
cd <repo-name>
npm install
```

### Environment variables

```env
# TODO: replace with the exact names used in the code
PORT=
MONGO_URI=
REDIS_URL=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

### Run

```bash
# development
npx nodemon index.js

# production
pm2 start index.js --name real-estate-api
```

## API Endpoints

`TODO:` a short table is enough.

| Method | Endpoint | Description | Role |
|---|---|---|---|
| | | | |

## Project Structure

`TODO:` paste the output of `tree -I node_modules -L 2`.

## Scope Note

Delivered as a backend-only commercial project. `TODO:` mention anything out of scope or planned (for example WhatsApp/SMS integration, AI pricing).

## Author

**Ahmed Mohamed**: [GitHub](https://github.com/AhmdMohamed506k)
