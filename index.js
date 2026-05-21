import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://bridgemee-frontend.vercel.app/',
];
const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api', (_, res) =>
  res.json({
    message: 'BridgeMee API is running. Use route paths under /api (e.g. GET /api/health, POST /api/auth/login).',
    docs: 'See repository README for the full endpoint list.',
  })
);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.use((_, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

const start = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/subscription_portal';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
