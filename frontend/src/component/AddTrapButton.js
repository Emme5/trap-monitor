import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddTrapButton = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTrap, setNewTrap] = useState({
    name: '',
    location: '',
    type: 'เหลือง',
    notes: '',
    installDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'normal',
    efficiency: 100,
    qrCode: `TRAP${String(Date.now()).slice(-6)}`
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTrap.name && newTrap.location) {
      try {
        await onAdd(newTrap);
        setShowForm(false);
        setNewTrap({
          name: '',
          location: '',
          type: 'เหลือง',
          notes: '',
          installDate: new Date().toISOString().split('T')[0],
          expiryDate: '',
          status: 'normal',
          efficiency: 100
        });
      } catch (error) {
        console.error('Error adding trap:', error);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        เพิ่มกับดักใหม่
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">เพิ่มกับดักใหม่</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อกับดัก"
                value={newTrap.name}
                onChange={(e) => setNewTrap({...newTrap, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="ตำแหน่ง"
                value={newTrap.location}
                onChange={(e) => setNewTrap({...newTrap, location: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <select
                value={newTrap.type}
                onChange={(e) => setNewTrap({...newTrap, type: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="เหลือง">เหลือง</option>
                <option value="น้ำเงิน">น้ำเงิน</option>
                <option value="ขาว">ขาว</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">วันที่ติดตั้ง</label>
                  <input
                    type="date"
                    value={newTrap.installDate}
                    onChange={(e) => setNewTrap({...newTrap, installDate: e.target.value})}
                    className="w-full p-3 border rounded-lg mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">วันหมดอายุ</label>
                  <input
                    type="date"
                    value={newTrap.expiryDate}
                    onChange={(e) => setNewTrap({...newTrap, expiryDate: e.target.value})}
                    className="w-full p-3 border rounded-lg mt-1"
                    required
                  />
                </div>
              </div>

              <textarea
                placeholder="หมายเหตุ"
                value={newTrap.notes}
                onChange={(e) => setNewTrap({...newTrap, notes: e.target.value})}
                className="w-full p-3 border rounded-lg h-20"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  เพิ่ม
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTrapButton;