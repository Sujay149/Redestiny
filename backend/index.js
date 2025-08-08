import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import urlRoutes from './routes/url.js';
import passport from './passport.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/urls', urlRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
