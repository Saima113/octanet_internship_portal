const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path : './backend/.env'});
console.log("Loaded secret:", process.env.JWT_SECRET);
const axios = require('axios');
const protect = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//middleware protection
app.get('/dashboard', protect, (req, res)=>{
  res.json({ message : 'Hello ${req.user.name}, Welcome to dashboard.'})
});

//root route 
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the InternKaksha API!' });
});


// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InternKaksha API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});



// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('./generated/prisma');
    const prisma = new PrismaClient();
    
    // Test the connection
    await prisma.$connect();
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful!',
      database: 'Connected to PlanetScale'
    });
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// 404 handler - fix the wildcard route
// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


app.listen(PORT, async () => {
  const baseUrl = `http://localhost:${PORT}`;

//   console.log(` Server running on ${baseUrl}`);
//   console.log(` API health check: ${baseUrl}/api/health`);
//   console.log(`  Database test: ${baseUrl}/api/test-db`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);

  // Internal checks after server starts
  try{
    const ser= await axios.get(`${baseUrl}`);
    console.log('\n Server is running succesfully');
    console.log(ser.data);

  }catch(err){
    console.error('\n Server is not running')
    console.error(err.respone ? err.response.data : err.message);

  }
  try {
    const healthRes = await axios.get(`${baseUrl}/api/health`);
    console.log('\n Health Check Response:');
    console.log(healthRes.data);
  } catch (err) {
    console.error('\n Health Check Failed:');
    console.error(err.response ? err.response.data : err.message);
  }

  try {
    const dbRes = await axios.get(`${baseUrl}/api/test-db`);
    console.log('\n DB Connection Response:');
    console.log(dbRes.data);
  } catch (err) {
    console.error('\n DB Connection Failed:');
    console.error(err.response ? err.response.data : err.message);
  }
});
