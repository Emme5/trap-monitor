import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import './traps/trapModel.js';
import './notifies/notifyModel.js';
import trapRoutes from './traps/trapRoutes.js';
import notifyRoutes from './notifies/notifyRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/traps', trapRoutes);
app.use('/api/notify', notifyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'ไม่สามารถดำเนินการได้', error: err.message });
});

 

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});