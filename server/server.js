require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes mounting
app.use('/api', apiRoutes);

// Root verification route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduSphere Cyber-LMS API Portal.' });
});

// Port configuration
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`EduSphere Cyber-LMS API Server Running`);
  console.log(`PORT   : ${PORT}`);
  console.log(`ENV    : ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================`);
});
