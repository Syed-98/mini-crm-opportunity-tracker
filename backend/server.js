require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const opportunityRoutes = require('./src/routes/opportunityRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');

connectDB();

const app = express();

const isDev = process.env.NODE_ENV !== 'production';
const corsOrigin = process.env.CORS_ORIGIN || (isDev ? '*' : '');

const corsOptions = {
  origin:
    corsOrigin === '*'
      ? '*'
      : corsOrigin
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean),
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CRM Opportunity Tracker API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
