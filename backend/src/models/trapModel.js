import mongoose from 'mongoose';

const trapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณาระบุชื่อกับดัก'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'กรุณาระบุตำแหน่ง'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'กรุณาระบุประเภทกับดัก/สี'],
    enum: ['เหลือง', 'น้ำเงิน', 'ขาว']
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  installDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  daysRemaining: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  },
  efficiency: {
    type: Number,
    default: 100
  },
  notes: {
    type: String,
    trim: true
  },
  lastCheck: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// สร้าง Index สำหรับการค้นหา
trapSchema.index({ qrCode: 1 });
trapSchema.index({ status: 1 });

const Trap = mongoose.model('InsectTrap', trapSchema);

trapSchema.pre('save', function(next) {
  if (this.expiryDate) {
    const now = new Date();
    const expiry = new Date(this.expiryDate);
    this.daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  }
  next();
});

export default Trap;