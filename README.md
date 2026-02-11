# BusBooker - Bus Reservation System

A modern bus reservation system built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Register, login, and manage profiles
- **Bus Search**: Search buses by route, date, and preferences
- **Seat Selection**: Interactive seat selection with real-time availability
- **Booking Management**: View, cancel, and manage bookings
- **Admin Dashboard**: Manage buses, routes, and view analytics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP Client
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **TypeScript** - Type Safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

## 📋 Prerequisites

Before running this project, ensure you have installed:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** - [Sign up for free](https://www.mongodb.com/atlas)
- **Git** - [Download Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nezukoo9408/Bus-Booker.git
cd Bus-Booker
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

#### Frontend Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001
```

#### Backend Environment Variables
Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/bus?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=5001
```

### 4. MongoDB Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (M0 Sandbox is free)

2. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Username: `busbooker_admin`
   - Password: Create a strong password
   - Click "Add User"

3. **Whitelist IP Address**:
   - Go to Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**:
   - Go to Database → Connect → Drivers
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Update the `MONGODB_URI` in your `.env` file

## 🏃‍♂️ Running the Application

### Method 1: Run Both Frontend and Backend Together

```bash
npm run dev:all
```

This will start both the frontend and backend concurrently.

### Method 2: Run Separately

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
Backend will run on `http://localhost:5001`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🌐 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 📁 Project Structure

```
Bus-Booker/
├── public/                 # Static assets
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Entry point
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── controllers/       # Route controllers
│   ├── config/            # Configuration files
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
├── .env                   # Frontend environment variables
├── .gitignore            # Git ignore file
├── package.json          # Frontend dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── README.md             # This file
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
cd server
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure your MongoDB URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Verify your database user credentials

2. **Port Already in Use**:
   - The backend will automatically try the next available port
   - You can also kill the process using the port:
   ```bash
   # On Windows
   netstat -ano | findstr :5001
   taskkill /PID <PID> /F
   
   # On Mac/Linux
   lsof -ti:5001 | xargs kill -9
   ```

3. **CORS Issues**:
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
   - For development, you can set it to `http://localhost:5173`

4. **White Screen on Frontend**:
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Try clearing browser cache

### Getting Help

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the terminal for backend error messages
3. Ensure all environment variables are set correctly
4. Verify MongoDB connection and credentials

## 🚀 Deployment

### Frontend Deployment

#### GitHub Pages
```bash
npm run build
gh-pages --dist dist
```

#### Render
1. Connect your GitHub repository to Render
2. Render will automatically detect the static site
3. Set `VITE_API_URL` environment variable to your backend URL

### Backend Deployment

#### Render
1. Connect your GitHub repository to Render
2. Render will detect the Node.js service
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`

## 📝 Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
```

### Backend (server/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_random_jwt_secret
FRONTEND_URL=http://localhost:5173
PORT=5001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub Profile](https://github.com/yourusername)

## 📞 Support

If you have any questions or need support, please:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact the development team

---

**Happy Coding! 🎉**
