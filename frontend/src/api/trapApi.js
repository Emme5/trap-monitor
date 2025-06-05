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

updateTrap: async (id, updateData) => {
  try {
    console.log('Updating trap with data:', updateData); // Debug log

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update trap');
    }

    return data;
  } catch (error) {
    console.error('Error updating trap:', error);
    throw error;
  }
},

  deleteTrap: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/traps/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete trap');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting trap:', error);
      throw error;
    }
  },

  getTrapByQR: async (qrCode) => {
    const response = await fetch(`${BASE_URL}/qr/${qrCode}`);
    return response.json();
  }
};