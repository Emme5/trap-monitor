import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Bug, Calendar, MapPin, MessageCircleWarning, Plus, Trash2, QrCode, Camera, Download, FileChartColumnIncreasing } from 'lucide-react';
import { notifyApi } from './api/notifyApi';
import { trapApi } from './api/trapApi';
import AddTrapButton from './component/AddTrapButton';
import TrapDisplayForm from './component/TrapDisplayForm';
import { useNavigate } from 'react-router-dom';

const InsectTrapMonitor = () => {

const navigate = useNavigate();
 
  const getIssueCount = async () => {
  try {
    const notifyData = await notifyApi.getAllNotifies();
    return notifyData.length;
  } catch (error) {
    console.error('Error fetching notify count:', error);
    return 0;
  }
};

// เพิ่ม state สำหรับเก็บจำนวนแจ้งเตือน
const [notifyCount, setNotifyCount] = useState(0);

// เพิ่ม useEffect เพื่อโหลดข้อมูลแจ้งเตือน
useEffect(() => {
  const fetchNotifyCount = async () => {
    const count = await getIssueCount();
    setNotifyCount(count);
  };
  fetchNotifyCount();
}, []);

  const reportIssue = (trapId, issueData) => {
  // Get existing issues from localStorage
  const existingIssues = JSON.parse(localStorage.getItem('trapIssues') || '[]');
  
  // Add new issue
  const newIssues = [...existingIssues, issueData];
  
  // Save to localStorage
  localStorage.setItem('trapIssues', JSON.stringify(newIssues));
  
  // Optional: Show success message
  alert('บันทึกการแจ้งปัญหาเรียบร้อยแล้ว');
};

  const updateTrap = async (id, updateData) => {
  try {
    // เรียก API เพื่ออัพเดทข้อมูล
    await trapApi.updateTrap(id, updateData);
    
    // อัพเดท state หลังจากบันทึกสำเร็จ
    setTraps(prevTraps => 
      prevTraps.map(trap => 
        trap._id === id ? { ...trap, ...updateData } : trap
      )
    );
    
    alert('บันทึกข้อมูลเรียบร้อย');
  } catch (error) {
    console.error('Error:', error);
    throw error; // ส่ง error ไปให้ component ลูกจัดการ
  }
};

  const calculateDaysRemaining = (installDate, expiryDate) => {
  if (!installDate || !expiryDate) return 0;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

  const [traps, setTraps] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrap, setEditingTrap] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [updateForm, setUpdateForm] = useState({
    notes: '',
    status: 'normal'
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [newTrap, setNewTrap] = useState({
    name: '',
    location: '',
    type: 'เหลือง',
    notes: '',
    installDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'ปกติ';
      case 'warning': return 'ต้องติดตาม';
      case 'critical': return 'เร่งด่วน';
      default: return 'ไม่ทราบ';
    }
  };

  // QR Code Functions
  const generateQRCode = (text) => {
    // Simple QR code generation using a free API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาต');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  const captureQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      // In a real app, you'd use a QR code detection library here
      // For demo purposes, we'll simulate QR code detection
      const simulatedQRCodes = ['TRAP001', 'TRAP002', 'TRAP003'];
      const randomQR = simulatedQRCodes[Math.floor(Math.random() * simulatedQRCodes.length)];
      setScanResult(randomQR);
      
      // Find trap by QR code
      const foundTrap = traps.find(trap => trap.qrCode === randomQR);
      if (foundTrap) {
        setUpdateForm({
          notes: foundTrap.notes,
          status: foundTrap.status
        });
      }
      
      stopCamera();
    }
  };

  const updateTrapFromQR = () => {
    if (scanResult) {
      const trapIndex = traps.findIndex(trap => trap.qrCode === scanResult);
      if (trapIndex !== -1) {
        const updatedTraps = [...traps];
        updatedTraps[trapIndex] = {
          ...updatedTraps[trapIndex],
          notes: updateForm.notes,
          status: updateForm.status,
          lastCheck: new Date().toISOString().split('T')[0]
        };
        setTraps(updatedTraps);
        setScanResult('');
        setShowQRScanner(false);
        setUpdateForm({ notes: '', status: 'normal' });
        alert('อัปเดตข้อมูลกับดักเรียบร้อยแล้ว!');
      }
    }
  };

  const downloadQRCode = (qrUrl, trapName) => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QR-${trapName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <Bug className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTraps = async () => {
      try {
        setLoading(true);
        const data = await trapApi.getAllTraps();
        setTraps(data);
      } catch (error) {
        setError('Failed to fetch traps');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraps();
  }, []);

  const addTrap = async () => {
  if (newTrap.name && newTrap.location) {
    try {
      setLoading(true);
      const qrCode = `TRAP${String(Date.now()).slice(-6)}`;
      const daysRemaining = calculateDaysRemaining(newTrap.installDate, newTrap.expiryDate);
      
      const trapData = {
        ...newTrap,
        status: 'normal',
        lastCheck: new Date().toISOString().split('T')[0],
        daysRemaining,
        efficiency: 100,
        qrCode
      };
      
      const createdTrap = await trapApi.createTrap(trapData);
      setTraps([...traps, createdTrap]);
      setNewTrap({
        name: '',
        location: '',
        type: 'เหลือง',
        notes: '',
        installDate: new Date().toISOString().split('T')[0],
        expiryDate: ''
      });
      setShowAddForm(false);
    } catch (error) {
      setError('Failed to create trap');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }
};

  const deleteTrap = async (id) => {
  try {
    await trapApi.deleteTrap(id);
    setTraps(prevTraps => prevTraps.filter(trap => trap._id !== id));
    alert('ลบกับดักเรียบร้อยแล้ว');
  } catch (error) {
    console.error('Error:', error);
    throw error; // ส่ง error ไปให้ component ลูกจัดการ
  }
};

  const criticalTraps = traps.filter(trap => trap.status === 'critical').length;
  const warningTraps = traps.filter(trap => trap.status === 'warning').length;
  const totalInsects = traps.reduce
  const avgEfficiency = Math.round(traps.reduce((sum, trap) => sum + trap.efficiency, 0) / traps.length);
  const expiringTraps = traps.filter(trap => {
  const daysRemaining = calculateDaysRemaining(trap.installDate, trap.expiryDate);
  return daysRemaining <= 1; }).length;

  const handleAddTrap = async (trapData) => {
  try {
    setLoading(true);
    const createdTrap = await trapApi.createTrap(trapData);
    setTraps([...traps, createdTrap]);
  } catch (error) {
    setError('Failed to create trap');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Bug className="w-8 h-8 text-green-600" />
                ระบบติดตามกาวดักแมลง
              </h1>
              <p className="text-gray-600 mt-2">จัดการและติดตามสถานะกับดักแมลงทั้งหมด</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Camera className="w-5 h-5" />
                สแกน QR Code
              </button>
                <AddTrapButton onAdd={handleAddTrap} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">ทั้งหมด</p>
              <p className="text-3xl font-bold text-orange-600">{traps.length}</p> {/* แก้จาก expiringTraps เป็น traps.length */}
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => window.open ('/notify', '_blank')}
          className="cursor-pointer hover:shadow-lg transition-shadow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">แจ้งเตือน</p>
                <p className="text-3xl font-bold text-red-600">{notifyCount}</p>
              </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
       </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">หมดอายุ</p>
              <p className="text-3xl font-bold text-green-600">{expiringTraps}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageCircleWarning className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">ประสิทธิภาพเฉลี่ย</p>
              <p className="text-3xl font-bold text-purple-600">{avgEfficiency}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileChartColumnIncreasing className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">สแกน QR Code กับดัก</h3>
              
              {!scanResult ? (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="flex gap-3">
                    {!isScanning ? (
                      <button
                        onClick={startCamera}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        เปิดกล้อง
                      </button>
                    ) : (
                      <button
                        onClick={captureQRCode}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      >
                        สแกน QR Code
                      </button>
                    )}
                    <button
                      onClick={() => {
                        stopCamera();
                        setShowQRScanner(false);
                        setScanResult('');
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-600 mb-1">QR Code ที่สแกนได้:</div>
                    <div className="font-bold text-green-800">{scanResult}</div>
                    {traps.find(t => t.qrCode === scanResult) && (
                      <div className="text-sm text-gray-600 mt-1">
                        {traps.find(t => t.qrCode === scanResult).name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                    
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="normal">ปกติ</option>
                      <option value="warning">ต้องติดตาม</option>
                      <option value="critical">เร่งด่วน</option>
                    </select>
                    
                    <textarea
                      placeholder="หมายเหตุ"
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                      className="w-full p-3 border rounded-lg h-20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={updateTrapFromQR}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                    >
                      อัปเดตข้อมูล
                    </button>
                    <button
                      onClick={() => {
                        setScanResult('');
                        setShowQRScanner(false);
                        setUpdateForm({notes: '', status: 'normal' });
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Code Generator Modal */}
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

        {/* Traps Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {traps.map(trap => (
            <TrapDisplayForm
              key={trap._id}
              trap={trap}
              onDelete={deleteTrap}
              onUpdate={updateTrap}
              reportIssue={reportIssue}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
              calculateDaysRemaining={calculateDaysRemaining}
              generateQRCode={generateQRCode}
              downloadQRCode={downloadQRCode}     
            />
          ))}
        </div>

        {traps.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ยังไม่มีกับดัก</h3>
            <p className="text-gray-500 mb-4">เริ่มต้นด้วยการเพิ่มกับดักแรกของคุณ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsectTrapMonitor;