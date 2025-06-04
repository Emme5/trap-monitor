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

router.get("/", getAllTraps);
router.post("/", createTrap);

router.get("/qr/:qrCode", getTrapByQR);
router.put("/qr/:qrCode", updateTrap);

router.get("/status/:status", getTrapsByStatus);

router.delete("/:id", deleteTrap);

export default router;