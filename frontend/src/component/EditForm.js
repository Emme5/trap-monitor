import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const EditForm = ({ trap, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: trap.name,
    location: trap.location,
    type: trap.type,
    notes: trap.notes || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!formData.name || !formData.location || !formData.type) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      await onUpdate(trap._id, formData);
      onCancel(); 
    } catch (error) {
      console.error('Error updating trap:', error);
      alert('ไม่สามารถแก้ไขข้อมูลได้');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">แก้ไขข้อมูลกับดัก</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">ชื่อกับดัก</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">ตำแหน่ง</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">ประเภท/สี</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">หมายเหตุ</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border rounded-lg h-24"
              placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              บันทึก
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg"
            >
              ยกเลิก
            </button>
          </div>
        </form>

        {/* แสดงข้อมูลที่ไม่สามารถแก้ไขได้ */}
        <div className="mt-6 space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">วันที่ติดตั้ง</div>
            <div className="font-semibold">
              {new Date(trap.installDate).toLocaleDateString('th-TH')}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">วันหมดอายุ</div>
            <div className="font-semibold">
              {new Date(trap.expiryDate).toLocaleDateString('th-TH')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;