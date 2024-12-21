# Blog Platform Backend

This is the backend for a **Blogging Platform** where users can register, log in, and create, update, and delete their own blogs. Admin users can manage other users and blogs. This project is built using **TypeScript**, **Node.js**, **Express.js**, and **MongoDB** with **Mongoose** for database operations.

---

## 🚀 **Features**

### **User Roles**

- **Admin**:
  - Manage users (Block and delete blogs)
  - Cannot update blogs
- **User**:
  - Register and log in
  - Create, update, and delete their own blogs
  - Cannot perform admin actions

### **Blog API**

- Users can perform CRUD operations on blogs (create, read, update, delete).
- Admin can manage blogs and block users.
- Public API for fetching blogs with search, sort, and filter capabilities.

### **Authentication & Authorization**

- JWT-based authentication for secure login.
- Role-based access control for **admin** and **user** roles.

---

## 🛠 **Technologies Used**

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database for storing user and blog data
- **Mongoose**: ODM for MongoDB
- **TypeScript**: Typed superset of JavaScript
- **JWT**: JSON Web Tokens for secure user authentication

---

## 📋 **Installation**

### **Clone the Repository**

```bash
git clone https://github.com/your-username/blog-platform-backend.git
cd blog-platform-backend
```

### **Install Dependencies**

Make sure you have **Node.js** installed. Then, install the required dependencies:

```bash
npm install
```

### **Environment Variables**

Create a `.env` file in the root directory and add the following variables:

```
MONGO_URI=mongodb://localhost:27017/blogPlatform
JWT_SECRET=your_jwt_secret
PORT=5000
```

### **Run the Application**

To run the server locally:

```bash
npm start
```

The server will be running at `http://localhost:5000`.

---

## **API Endpoints**

### **1. Authentication**

#### 1.1 Register User

**POST** `/api/auth/register`

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 1.2 Login User

**POST** `/api/auth/login`

Request Body:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token"
  }
}
```

### **2. Blog Management**

#### 2.1 Create Blog

**POST** `/api/blogs`

Request Header:

```
Authorization: Bearer <token>
```

Request Body:

```json
{
  "title": "My First Blog",
  "content": "This is the content of my blog."
}
```

Response:

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "blog_id",
    "title": "My First Blog",
    "content": "This is the content of my blog.",
    "author": { "name": "John Doe" }
  }
}
```

#### 2.2 Update Blog

**PATCH** `/api/blogs/:id`

Request Header:

```
Authorization: Bearer <token>
```

Request Body:

```json
{
  "title": "Updated Blog Title",
  "content": "Updated content"
}
```

#### 2.3 Delete Blog

**DELETE** `/api/blogs/:id`

Request Header:

```
Authorization: Bearer <token>
```

#### 2.4 Get All Blogs (Public)

**GET** `/api/blogs`

Query Parameters:

- `search`: Search by title or content
- `sortBy`: Sort blogs by fields like `createdAt`
- `sortOrder`: Sort in ascending or descending order
- `filter`: Filter by author ID

Example URL:

```
/api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=author_id
```

### **3. Admin Actions**

#### 3.1 Block User

**PATCH** `/api/admin/users/:userId/block`

Request Header:

```
Authorization: Bearer <admin_token>
```

#### 3.2 Delete Blog

**DELETE** `/api/admin/blogs/:id`

Request Header:

```
Authorization: Bearer <admin_token>
```

---

## 🔒 **Authentication & Authorization**

- **JWT Authentication**: All routes (except public ones) require a valid JWT token.
- **Admin Role**: Admin has access to manage users and blogs, and block users.
- **User Role**: Users can create, update, and delete their own blogs.

---

## 📂 **File Structure**

```
/blog-platform-backend
│
├── /src
│   ├── /controllers       # Controller functions
│   ├── /models            # Mongoose models (User, Blog)
│   ├── /routes            # API routes
│   ├── /middleware        # Middleware (Authentication, Authorization)
│   ├── /utils             # Helper functions and utilities
│   └── app.ts             # Main entry point for the server
│
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

---

## 🗣 **Admin Login Credentials**

For testing purposes, use the following admin credentials:

- **Email**: `admin@example.com`
- **Password**: `adminpassword`

---

## 🌐 **Live Deployment**

You can access the live deployment of the blog platform backend here:

[Live Server Link](link_to_live_server)

---
