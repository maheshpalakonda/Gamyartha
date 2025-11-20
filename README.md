# Gamyartha - AI Financial Companion

A comprehensive financial management application with AI-powered insights, built with a modern tech stack. 

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Transaction Management**: Track income and expenses with categories
- **Financial Goals**: Set and monitor savings goals
- **Obligations Tracking**: Manage bills and payment due dates
- **AI Chat Assistant**: Get financial advice and insights
- **Email Notifications**: Automated alerts for transactions and reminders
- **Admin Panel**: Complete administrative dashboard
- **3D Animations**: Smooth login/logout animations

## 🏗️ Architecture

The application is organized into three main components:

### Backend (`/backend`)
- **Framework**: Node.js with Express.js
- **Database**: MySQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **Email**: Nodemailer for notifications
- **API**: RESTful endpoints for all operations

### Frontend (`/frontend`)
- **UI**: Vanilla JavaScript with Tailwind CSS
- **3D Graphics**: Three.js for login/logout animations
- **Responsive**: Mobile-first design
- **Real-time**: Live updates via API polling

### Admin Panel (`/admin-panel`)
- **Dashboard**: Analytics and system overview
- **User Management**: Admin controls for users
- **Transaction Monitoring**: View all system transactions
- **Charts**: Visual analytics with Chart.js
- **Settings**: System configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Gamyartha
```

### 2. Database Setup
```bash
# Import the database schema 
mysql -u root -p < database_setup.sql 
```

### 3. Backend Setup
```bash
cd backend
npm install
# Configure .env file (see .env.example)
npm start
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 5. Admin Panel Setup
```bash
cd ../admin-panel
npm install
npm start
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Gamyartha

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=3001
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd backend && npm start

# Frontend (Terminal 2)
cd frontend && npm start

# Admin Panel (Terminal 3)
cd admin-panel && npm start
```

### Production Mode
```bash
# Backend
cd backend && npm start

# Frontend & Admin (serve static files)
cd frontend && python3 -m http.server 8000
cd admin-panel && python3 -m http.server 8080
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Add new transaction

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Add new goal
- `PUT /api/goals/:id/progress` - Update goal progress

### Obligations
- `GET /api/obligations` - Get user obligations
- `POST /api/obligations` - Add new obligation
- `PUT /api/obligations/:id/pay` - Mark obligation as paid

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Save chat message

### Admin (Admin only)
- `GET /api/admin/users` - Get all users

## 🎨 Features Overview

### User Features
- **Dashboard**: Overview of financial status
- **Transaction Tracking**: Add/edit income and expenses
- **Goal Setting**: Create and track savings goals
- **Bill Management**: Track upcoming payments
- **AI Assistant**: Chat for financial advice
- **Email Alerts**: Notifications for important events

### Admin Features
- **User Management**: View and manage all users
- **System Analytics**: Charts and statistics
- **Transaction Monitoring**: View all transactions
- **Settings Management**: Configure system settings

### 3D Animations
- Smooth cube rotation on login/logout
- Non-intrusive background animations
- Performance optimized

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS protection
- Admin role-based access control

## 📊 Database Schema

### Tables
- `users` - User accounts
- `admins` - Admin permissions
- `transactions` - Financial transactions
- `goals` - Savings goals
- `obligations` - Payment obligations
- `password_reset_codes` - Password recovery
- `chat_history` - AI chat conversations
- `user_settings` - User preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.



**Made with ❤️ for better financial management**
