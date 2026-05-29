const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for frontend requests
app.use(express.json()); // Body parser middleware for parsing application/json

const path = require('path');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api', gameRoutes);

// Serve Static Frontend Assets in Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the Vite build output
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Handle SPA routing: any non-API route returns index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Root Route for development API documentation
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the User Registration API',
      status: 'Healthy',
      endpoints: {
        registerUser: 'POST /api/users',
        getAllUsers: 'GET /api/users'
      }
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Define Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
