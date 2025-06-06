import express from 'express';
import { createNotify, getAllNotifies, updateNotifyStatus } from './notifyController.js';

const router = express.Router();

router.post('/', createNotify);
router.get('/', getAllNotifies);
router.put('/:id', updateNotifyStatus);

export default router;