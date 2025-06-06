import express from "express";
import { 
    getAllTraps, 
    createTrap, 
    updateTrap, 
    deleteTrap,
    getTrapByQR,
    getTrapsByStatus 
} from "./trapController.js";
import Trap from "./trapModel.js"

const router = express.Router();

router.get("/", getAllTraps);
router.post("/", createTrap);

router.get("/qr/:qrCode", getTrapByQR);
router.put("/qr/:qrCode", updateTrap);
router.get("/status/:status", getTrapsByStatus);

router.delete('/traps/:id', deleteTrap);

// Update trap endpoint
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, type, notes } = req.body;

    // Validate required fields
    if (!name || !location || !type) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const updatedTrap = await Trap.findByIdAndUpdate(
      id,
      { 
        name, 
        location, 
        type, 
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedTrap) {
      return res.status(404).json({ message: 'ไม่พบกับดักที่ต้องการแก้ไข' });
    }

    res.json(updatedTrap);
  } catch (error) {
    console.error('Error updating trap:', error);
    res.status(500).json({ message: 'ไม่สามารถแก้ไขข้อมูลได้', error: error.message });
  }
});

export default router;