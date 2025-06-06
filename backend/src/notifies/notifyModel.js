import mongoose from 'mongoose';

const notifySchema = new mongoose.Schema({
  trapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InsectTrap',
    required: true
  },
  trapName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notify = mongoose.model('Notify', notifySchema);
export default Notify;