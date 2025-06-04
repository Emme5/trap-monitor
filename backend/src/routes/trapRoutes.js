import express from "express";
import { 
    getAllTraps, 
    createTrap, 
    updateTrap, 
    deleteTrap,
    getTrapByQR,
    getTrapsByStatus 
} from "../controllers/trapController.js";

const router = express.Router();

// Base routes
router.get("/", getAllTraps);
router.post("/", createTrap);

// QR code routes
router.get("/qr/:qrCode", getTrapByQR);
router.put("/qr/:qrCode", updateTrap);

// Status routes
router.get("/status/:status", getTrapsByStatus);

// ID routes
router.delete("/:id", deleteTrap);

export default router;