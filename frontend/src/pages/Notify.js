import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, MapPin, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifyApi } from '../api/notifyApi';
import { trapApi } from '../api/trapApi';

const Notify = () => {
  const [issues, setIssues] = useState([]);
  const [traps, setTraps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // เรียก API ที่มีการ populate ข้อมูลกับดัก
        const response = await fetch('http://localhost:5001/api/notify');
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getTrapDetails = (trapId) => {
    return traps.find(trap => trap._id === trapId) || {};
  };

  // ฟังก์ชันคำนวณวันที่เหลือ
  const calculateDaysRemaining = (installDate, expiryDate) => {
    if (!installDate || !expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                รายการแจ้งปัญหา
              </h1>
              <p className="text-gray-600 mt-2">รายการปัญหาที่ได้รับแจ้งทั้งหมด</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              กลับ
            </button>
          </div>

          <div className="space-y-4">
            {issues.map((issue) => (
        <div key={issue._id} className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{issue.trapName}</h3>
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  {issue.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ตำแหน่ง</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{issue.trapId?.location || 'ไม่ระบุ'}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">ประเภท/สี</p>
                  <p className="mt-1">{issue.trapId?.type || 'ไม่ระบุ'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">วันที่เหลือ</p>
                  <p className="mt-1 font-semibold text-green-600">
                    {calculateDaysRemaining(
                      issue.trapId?.installDate,
                      issue.trapId?.expiryDate
                    )} วัน
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">รหัส QR Code</p>
                  <div className="flex items-center gap-2 mt-1">
                    <QrCode className="w-4 h-4 text-gray-500" />
                    <span>{issue.trapId?.qrCode || 'ไม่ระบุ'}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">รายละเอียดปัญหา</p>
                <p className="mt-1 text-gray-800">{issue.description}</p>
              </div>

              {issue.trapId?.qrCode && (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${issue.trapId.qrCode}`}
                  alt="QR Code"
                  className="mt-2 border rounded"
                />
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            แจ้งเมื่อ: {new Date(issue.createdAt).toLocaleString('th-TH')}
          </div>
        </div>
      ))}

            {issues.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>ไม่มีรายการแจ้งปัญหา</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;