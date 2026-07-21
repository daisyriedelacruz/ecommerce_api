# E-Commerce Backend API

This repository contains the RESTful API service for **Crafty Club PH**, a handcrafted floral business e-commerce platform. Built with Node.js, Express, and MongoDB, this API manages user authentication, dynamic product catalog searching, shopping cart operations, and order processing.

---

## Tech Stack & Dependencies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcrypt (for password hashing)
- **File Uploads / Images:** MulteR

---

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=400
MONGODB_STRING=<your_mongodb_string>
JWT_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB database instance (Local or MongoDB Atlas)
- Cloudinary Account

### Installation

1. **Clone the repository:**

   ```bash
   https://github.com/daisyriedelacruz/ecommerce_api.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   node index.js
   ```
   The API will run on `http://localhost:4000` by default.

---

## Authentication Middleware

Protected endpoints require a Bearer token sent via the `Authorization` header:

```text
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## API Endpoints Summary

### User & Auth Routes

| Method  | Endpoint                   | Auth Required | Description                             |
| :------ | :------------------------- | :------------ | :-------------------------------------- |
| `POST`  | `/users/register`          | Public        | Register a new customer account         |
| `POST`  | `/users/login`             | Public        | Authenticate user and return JWT token  |
| `GET`   | `/users/details`           | User / Admin  | Retrieve current logged-in user details |
| `GET`   | `/users/reset-password`    | User / Admin  | Update user password                    |
| `PATCH` | `/users/set-admin/:id`     | Admin         | Update role to admin                    |
| `PATCH` | `/users/set-non-admin/:id` | Admin         | Update role to non-admin                |
| `POST`  | `/users/add-to-cart`       | Admin         | Add product to cart                     |
| `GET`   | `/users/my-orders`         | User          | Retrieve logged-in user's orders        |
| `GET`   | `/users/all-orders`        | Admin         | Retrieve all users' orders              |

---

### Product Routes

| Method  | Endpoint                        | Auth Required | Description                                         |
| :------ | :------------------------------ | :------------ | :-------------------------------------------------- |
| `GET`   | `/products`                     | Public        | Fetch all active products                           |
| `GET`   | `/products/all`                 | Admin         | Fetch all products (including archived items)       |
| `GET`   | `/products/:productId`          | Public        | Retrieve details of a single product                |
| `PUT`   | `/products/:productId`          | Admin         | Update product details                              |
| `POST`  | `/products/search`              | Public        | Search products by name or description              |
| `POST`  | `/products/search-price`        | Public        | Search products by price                            |
| `POST`  | `/products`                     | Admin         | Add a new product (handles FormData / Image upload) |
| `PATCH` | `/products/archive/:productId`  | Admin         | Archive product                                     |
| `PATCH` | `/products/activate/:productId` | Admin         | Activate product                                    |

### 3. Cart Routes

| Method   | Endpoint                     | Auth Required | Description                                       |
| :------- | :--------------------------- | :------------ | :------------------------------------------------ |
| `GET`    | `/cart`                      | User          | Get current user's active cart items and subtotal |
| `PATCH`  | `/cart/update-cart-quantity` | User          | Modify item quantity in the cart                  |
| `DELETE` | `/cart/:productId/remove`    | User          | Remove a specific item from the cart              |
| `POST`   | `/cart/checkout`             | User          | Process checkout for items currently in cart      |

---

## Project Structure

```text
ecommerce_api
├── controllers/
│   ├── userControllers.js
│   ├── productControllers.js
│   ├── cartControllers.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│
├── auth.js
├── index.js
├── cloudinary.js
├── .env
└── package.json
```

---

# Test Credentials

## Admin

```
Email:
admin@mail.com

Password:
admin123
```

---

## User

```
Email:
user@mail.com

Password:
user123
```

---

This project is intended for educational purposes.

---
