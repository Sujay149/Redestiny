import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  domain: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

export default mongoose.model('Url', UrlSchema);
