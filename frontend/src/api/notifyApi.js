const BASE_URL = 'http://localhost:5001/api/notify';

export const notifyApi = {
  getAllNotifies: async () => {
    try {
      console.log('Fetching notifications...');
      
      const response = await fetch(BASE_URL);
      
      // Log response status for debugging
      console.log('Response status:', response.status);

      // ถ้า response ไม่ ok ให้โยน error พร้อมข้อความ
      if (!response.ok) {
        let errorMessage = 'Failed to fetch notifications';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // ถ้า parse json ไม่ได้ ใช้ statusText แทน
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Notifications data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', {
        message: error.message,
        stack: error.stack
      });
      // ส่ง error กลับไปให้ component จัดการ
      throw error;
    }
  },

  createNotify: async (notifyData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifyData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create notification');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  updateNotifyStatus: async (id, status) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating notification status:', error);
      throw error;
    }
  }
};