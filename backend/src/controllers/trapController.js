import Trap from '../models/trapModel.js';

// Get all traps
export const getAllTraps = async (req, res) => {
  try {
    const traps = await Trap.find();
    res.status(200).json(traps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new trap
export const createTrap = async (req, res) => {
  try {
    const trap = new Trap(req.body);
    const savedTrap = await trap.save();
    res.status(201).json(savedTrap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update trap by QR code
export const updateTrap = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const updatedTrap = await Trap.findOneAndUpdate(
      { qrCode },
      { ...req.body, lastCheck: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedTrap) {
      return res.status(404).json({ message: 'ไม่พบกับดักที่ระบุ' });
    }

    res.status(200).json(updatedTrap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete trap
export const deleteTrap = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrap = await Trap.findByIdAndDelete(id);
    
    if (!deletedTrap) {
      return res.status(404).json({ message: 'ไม่พบกับดักที่ต้องการลบ' });
    }

    res.status(200).json({ message: 'ลบกับดักเรียบร้อยแล้ว', id });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบกับดัก' });
  }
};

// Get trap by QR code
export const getTrapByQR = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const trap = await Trap.findOne({ qrCode });

    if (!trap) {
      return res.status(404).json({ message: 'ไม่พบกับดักที่ระบุ' });
    }

    res.status(200).json(trap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get traps by status
export const getTrapsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const traps = await Trap.find({ status });
    res.status(200).json(traps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};