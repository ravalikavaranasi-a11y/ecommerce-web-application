# E-Commerce Web Application

A submission-ready full-stack e-commerce application built with **Node.js, Express, MongoDB, HTML/CSS/JavaScript**.

## Features

- Product catalog with search and category filters
- Add to cart, quantity controls and checkout
- User registration and login
- JWT authentication
- Role-based access: `User` and `Admin`
- Admin product create/update/delete
- Admin order status management
- REST APIs for products, users and orders
- MongoDB database integration
- Responsive modern UI
- Demo seed data and demo accounts

## Tech stack

- Frontend: Vanilla HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Run locally

1. Install Node.js 18+ and MongoDB.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` and `JWT_SECRET`.
4. Install dependencies:

```bash
npm install
```

5. Add demo products/users:

```bash
npm run seed
```

6. Start the application:

```bash
npm start
```

Open `http://localhost:5000`.

## Demo accounts

- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (Admin)
- `PUT /api/products/:id` (Admin)
- `DELETE /api/products/:id` (Admin)

### Orders
- `POST /api/orders` (authenticated)
- `GET /api/orders/my` (authenticated)
- `GET /api/orders` (Admin)
- `PUT /api/orders/:id/status` (Admin)

## Project structure

```text
ecommerce-web-app/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   ├── auth.js
│   ├── models.js
│   └── routes.js
├── server.js
├── seed.js
├── package.json
├── .env.example
└── README.md
```

This project is intentionally dependency-light so it is easy to run, explain and submit.
