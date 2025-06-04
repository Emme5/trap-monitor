const BASE_URL = 'http://localhost:5001/api/traps';

export const trapApi = {
  getAllTraps: async () => {
    const response = await fetch(BASE_URL);
    return response.json();
  },

  createTrap: async (trapData) => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trapData)
    });
    return response.json();
  },

  updateTrapByQR: async (qrCode, updates) => {
    const response = await fetch(`${BASE_URL}/qr/${qrCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteTrap: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  getTrapByQR: async (qrCode) => {
    const response = await fetch(`${BASE_URL}/qr/${qrCode}`);
    return response.json();
  }
};