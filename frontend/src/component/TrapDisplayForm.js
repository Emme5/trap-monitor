import React, { useState } from 'react'; // Add useState import
import { Bug, MapPin, QrCode, Trash2, Download, Edit2, AlertCircle } from 'lucide-react'; // Add Download icon
import EditForm from './EditForm';
import { notifyApi } from '../api/notifyApi';

const TrapDisplayForm = ({ 
  trap, 
  onDelete,
  onUpdate,
  reportIssue,
  getStatusColor, 
  getStatusIcon, 
  getStatusText,
  calculateDaysRemaining,
  generateQRCode,
  downloadQRCode,
}) => {

  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [showQRGenerator, setShowQRGenerator] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      await notifyApi.createNotify({
        trapId: trap._id,
        trapName: trap.name,
        description: issueText,
      });
      
      setIssueText('');
      setShowIssueForm(false);
      alert('บันทึกการแจ้งปัญหาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('ไม่สามารถบันทึกการแจ้งปัญหาได้');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('คุณต้องการลบกับดักนี้ใช่หรือไม่?')) {
      try {
        await onDelete(trap._id);
      } catch (error) {
        console.error('Error deleting trap:', error);
        alert('ไม่สามารถลบกับดักได้');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{trap.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{trap.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowQRGenerator(trap)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="แสดง QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="ลบกับดัก"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(trap.status)}`}>
        {getStatusIcon(trap.status)}
        {getStatusText(trap.status)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">ประเภทกับดัก/สี</div>
          <div className="font-semibold">{trap.type}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">วันที่เหลือ</div>
          <div className={`font-semibold ${
            trap.daysRemaining <= 3 ? 'text-red-600' : 
            trap.daysRemaining <= 7 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {calculateDaysRemaining(trap.installDate, trap.expiryDate)} วัน
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">วันที่ติดตั้ง</div>
          <div className="font-semibold">
            {new Date(trap.installDate).toLocaleDateString('th-TH')}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600">วันหมดอายุ</div>
          <div className="font-semibold">
            {new Date(trap.expiryDate).toLocaleDateString('th-TH')}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-blue-600">QR Code</div>
          <div className="font-semibold text-blue-800">{trap.qrCode}</div>
        </div>
        <button
          onClick={() => setShowQRGenerator(trap)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {trap.notes && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
          <div className="text-sm text-gray-600 mb-1">หมายเหตุ:</div>
          <div className="text-sm">{trap.notes}</div>
        </div>
      )}
      <div className="flex gap-2">
        {/* ...existing buttons... */}
        <button
          onClick={() => setShowIssueForm(true)}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
          title="แจ้งปัญหา"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      </div>

      {showQRGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-4">QR Code - {showQRGenerator.name}</h3>
            <div className="text-center">
              <img 
                src={generateQRCode(showQRGenerator.qrCode)} 
                alt="QR Code" 
                className="mx-auto mb-4 border rounded-lg"
              />
              <div className="text-sm text-gray-600 mb-4">
                QR Code: {showQRGenerator.qrCode}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => downloadQRCode(generateQRCode(showQRGenerator.qrCode), showQRGenerator.name)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  ดาวน์โหลด
                </button>
                <button
                  onClick={() => setShowQRGenerator(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditForm && (
        <EditForm
          trap={trap}
          onUpdate={onUpdate}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">แจ้งปัญหากับดัก - {trap.name}</h3>
            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">รายละเอียดปัญหา</label>
                <textarea
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="กรุณาระบุรายละเอียดของปัญหาที่พบ"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg"
                >
                  ส่งรายงาน
                </button>
                <button
                  type="button"
                  onClick={() => setShowIssueForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrapDisplayForm;