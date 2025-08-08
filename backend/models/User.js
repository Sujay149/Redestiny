import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
