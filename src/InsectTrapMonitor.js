import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Bug, Calendar, MapPin, TrendingUp, Plus, Edit2, Trash2, RefreshCw, QrCode, Camera, Download } from 'lucide-react';

const InsectTrapMonitor = () => {
  const [traps, setTraps] = useState([
    {
      id: 1,
      name: 'กับดักที่ 1 - โรงเรือน A',
      location: 'โรงเรือนผลไม้ ตำแหน่ง A1',
      status: 'normal',
      lastCheck: '2025-06-02',
      insectCount: 15,
      efficiency: 85,
      type: 'เหลือง',
      notes: 'สภาพดี ต้องเปลี่ยนในอีก 3 วัน',
      qrCode: 'TRAP001'
    },
    {
      id: 2,
      name: 'กับดักที่ 2 - โรงเรือน B',
      location: 'โรงเรือนผัก ตำแหน่ง B2',
      status: 'warning',
      lastCheck: '2025-06-01',
      insectCount: 45,
      efficiency: 60,
      type: 'น้ำเงิน',
      notes: 'กาวเริ่มแห้ง ควรเปลี่ยนเร็วๆ นี้',
      qrCode: 'TRAP002'
    },
    {
      id: 3,
      name: 'กับดักที่ 3 - โรงเรือน C',
      location: 'โรงเรือนไม้ดอก ตำแหน่ง C1',
      status: 'critical',
      lastCheck: '2025-05-30',
      insectCount: 78,
      efficiency: 25,
      type: 'เหลือง',
      notes: 'กาวเต็ม ต้องเปลี่ยนทันที!',
      qrCode: 'TRAP003'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrap, setEditingTrap] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [updateForm, setUpdateForm] = useState({
    insectCount: '',
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
    notes: ''
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
          insectCount: foundTrap.insectCount.toString(),
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
          insectCount: parseInt(updateForm.insectCount) || 0,
          notes: updateForm.notes,
          status: updateForm.status,
          lastCheck: new Date().toISOString().split('T')[0]
        };
        setTraps(updatedTraps);
        setScanResult('');
        setShowQRScanner(false);
        setUpdateForm({ insectCount: '', notes: '', status: 'normal' });
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

  const addTrap = () => {
    if (newTrap.name && newTrap.location) {
      const qrCode = `TRAP${String(Date.now()).slice(-6)}`;
      const trap = {
        id: Date.now(),
        ...newTrap,
        status: 'normal',
        lastCheck: new Date().toISOString().split('T')[0],
        insectCount: 0,
        efficiency: 100,
        qrCode: qrCode
      };
      setTraps([...traps, trap]);
      setNewTrap({ name: '', location: '', type: 'เหลือง', notes: '' });
      setShowAddForm(false);
    }
  };

  const updateTrap = (id, updates) => {
    setTraps(traps.map(trap => 
      trap.id === id ? { ...trap, ...updates } : trap
    ));
  };

  const deleteTrap = (id) => {
    setTraps(traps.filter(trap => trap.id !== id));
  };

  const refreshTrap = (id) => {
    updateTrap(id, {
      lastCheck: new Date().toISOString().split('T')[0],
      insectCount: Math.floor(Math.random() * 50),
      efficiency: Math.floor(Math.random() * 40) + 60
    });
  };

  const criticalTraps = traps.filter(trap => trap.status === 'critical').length;
  const warningTraps = traps.filter(trap => trap.status === 'warning').length;
  const totalInsects = traps.reduce((sum, trap) => sum + trap.insectCount, 0);
  const avgEfficiency = Math.round(traps.reduce((sum, trap) => sum + trap.efficiency, 0) / traps.length);

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
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                เพิ่มกับดักใหม่
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">กับดักทั้งหมด</p>
                <p className="text-3xl font-bold text-blue-600">{traps.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bug className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">สถานะเร่งด่วน</p>
                <p className="text-3xl font-bold text-red-600">{criticalTraps}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">แมลงที่จับได้</p>
                <p className="text-3xl font-bold text-green-600">{totalInsects}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
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
                <TrendingUp className="w-6 h-6 text-purple-600" />
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
                      type="number"
                      placeholder="จำนวนแมลงที่จับได้"
                      value={updateForm.insectCount}
                      onChange={(e) => setUpdateForm({...updateForm, insectCount: e.target.value})}
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
                        setUpdateForm({ insectCount: '', notes: '', status: 'normal' });
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

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">เพิ่มกับดักใหม่</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อกับดัก"
                  value={newTrap.name}
                  onChange={(e) => setNewTrap({...newTrap, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="ตำแหน่ง"
                  value={newTrap.location}
                  onChange={(e) => setNewTrap({...newTrap, location: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
                <select
                  value={newTrap.type}
                  onChange={(e) => setNewTrap({...newTrap, type: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="เหลือง">กับดักเหลือง</option>
                  <option value="น้ำเงิน">กับดักน้ำเงิน</option>
                  <option value="ขาว">กับดักขาว</option>
                </select>
                <textarea
                  placeholder="หมายเหตุ"
                  value={newTrap.notes}
                  onChange={(e) => setNewTrap({...newTrap, notes: e.target.value})}
                  className="w-full p-3 border rounded-lg h-20"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={addTrap}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  เพิ่ม
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Traps Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {traps.map(trap => (
            <div key={trap.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
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
                    onClick={() => setShowQRGenerator(trap)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="แสดง QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => refreshTrap(trap.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="อัปเดตข้อมูล"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTrap(trap.id)}
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
                  <div className="text-sm text-gray-600">ประเภทกับดัก</div>
                  <div className="font-semibold">{trap.type}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">แมลงที่จับได้</div>
                  <div className="font-semibold">{trap.insectCount} ตัว</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">ประสิทธิภาพ</div>
                  <div className="font-semibold">{trap.efficiency}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    ตรวจล่าสุด
                  </div>
                  <div className="font-semibold">{trap.lastCheck}</div>
                </div>
              </div>

              {/* QR Code Info */}
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

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>ประสิทธิภาพการดักแมลง</span>
                  <span>{trap.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      trap.efficiency >= 80 ? 'bg-green-500' : 
                      trap.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${trap.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {traps.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ยังไม่มีกับดัก</h3>
            <p className="text-gray-500 mb-4">เริ่มต้นด้วยการเพิ่มกับดักแรกของคุณ</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่มกับดักใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsectTrapMonitor;