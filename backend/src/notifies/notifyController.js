import Notify from './notifyModel.js';
import '../traps/trapModel.js';

export const createNotify = async (req, res) => {
  try {
    const notify = new Notify(req.body);
    await notify.save();
    res.status(201).json(notify);
  } catch (error) {
    console.error('Create notify error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllNotifies = async (req, res) => {
  try {
    const notifies = await Notify.find()
      .sort({ createdAt: -1 })
      .populate('trapId', 'name location type qrCode installDate expiryDate');
    res.json(notifies);
  } catch (error) {
    console.error('Get all notifies error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateNotifyStatus = async (req, res) => {
  try {
    const notify = await Notify.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!notify) {
      return res.status(404).json({ message: 'ไม่พบการแจ้งเตือนนี้' });
    }
    res.json(notify);
  } catch (error) {
    console.error('Update notify status error:', error);
    res.status(400).json({ message: error.message });
  }
};