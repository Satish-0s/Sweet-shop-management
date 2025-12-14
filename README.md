# Sweet Shop Management System

> **⚠️ ADMIN ACCESS CREDENTIALS**  
> **Email:** `satishkr4548@gmail.com`  
> **Password:** `password1234`

## Description
A comprehensive full-stack web application designed for managing a sweet shop inventory and sales. This system allows users to browse a delectable collection of sweets, filter them by category or price, and make purchases. Administrators have a dedicated dashboard to manage product listings, update stock levels, and oversee the shop's operations.

## Features
- **User Authentication**: Secure login and registration for users and admins using JWT.
- **Product Catalog**: visually appealing display of available sweets with details like price and category.
- **Advanced Search & Filter**: Find specific sweets by name, category, or price range.
- **Shopping**: Integrated purchase functionality that automatically updates inventory.
- **Admin Dashboard**: Complete control for admins to Add, Edit, Delete, and Restock sweets.
- **Responsive UI**: Built with React and modern CSS for a seamless experience on all devices.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation & Usage

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Backend Setup**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   Start the backend server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

3. **Frontend Setup**
   Open a new terminal, navigate to the frontend directory:
   ```bash
   cd "sweet shop"
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```
    The application will be accessible at `http://localhost:5173`.

## Admin Access
Use the following credentials to access the Admin Panel:

**Email: satishkr4548@gmail.com**  
**Password: password1234**

---

## Deployment on Vercel

This project is set up to be deployed on **Vercel**. Since it consists of a separate frontend and backend, the recommended approach is to deploy them as two separate projects linked together.

### 1. Database Setup (MongoDB Atlas)
Before deploying, you need a cloud-hosted MongoDB database.
1.  Create a free account on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2.  Create a new Cluster and get your **Connection String**.
    *   It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/sweetshop?retryWrites=true&w=majority`

### 2. Backend Deployment
1.  Go to your Vercel Dashboard and **Add New Project**.
2.  Import this repository.
3.  **Configure Project**:
    *   **Project Name**: `sweet-shop-backend` (or similar)
    *   **Framework Preset**: Select **Other** (or let it detect).
    *   **Root Directory**: **Edit** this and select `backend`.
    *   **Environment Variables**: Add the following:
        *   `MONGODB_URI`: Paste your MongoDB Atlas connection string.
4.  Click **Deploy**.
5.  Once deployed, copy the **Deployment URL** (e.g., `https://sweet-shop-backend.vercel.app`).

### 3. Frontend Deployment
1.  Go to your Vercel Dashboard and **Add New Project**.
2.  Import the **same repository** again.
3.  **Configure Project**:
    *   **Project Name**: `sweet-shop-frontend`
    *   **Framework Preset**: **Vite** (should be auto-detected).
    *   **Root Directory**: **Edit** this and select `sweet shop`.
    *   **Environment Variables**: Add the following:
        *   `VITE_API_URL`: Paste your **Backend Deployment URL** (from step 2), e.g., `https://sweet-shop-backend.vercel.app`.
4.  Click **Deploy**.

Your Sweet Shop Management System is now live!