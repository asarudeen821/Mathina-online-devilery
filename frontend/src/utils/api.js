import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data),
  generateQR: (id) => api.post(`/products/${id}/qr-code`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  processPayment: (id, paymentData) => api.post(`/orders/${id}/payment`, paymentData),
  // Admin
  getAll: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: (params) => api.get('/orders/stats', { params }),
};

// Subscription APIs
export const subscriptionAPI = {
  create: (data) => api.post('/subscriptions', data),
  getMySubscriptions: (params) => api.get('/subscriptions/my-subscriptions', { params }),
  getById: (id) => api.get(`/subscriptions/${id}`),
  pause: (id, reason) => api.put(`/subscriptions/${id}/pause`, { reason }),
  resume: (id) => api.put(`/subscriptions/${id}/resume`),
  cancel: (id) => api.put(`/subscriptions/${id}/cancel`),
  skipDelivery: (id, date) => api.put(`/subscriptions/${id}/skip`, { date }),
  // Admin
  getAll: (params) => api.get('/subscriptions/admin/all', { params }),
  process: () => api.post('/subscriptions/process'),
};

// AI APIs
export const aiAPI = {
  generateRecipe: (data) => api.post('/ai/chat/recipe', data),
  getSuggestions: () => api.get('/ai/suggestions'),
  chat: (message) => api.post('/ai/chat', { message }),
  recommend: (data) => api.post('/ai/recommend', data),
};

// Notification APIs
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  send: (data) => api.post('/notifications/send', data),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (orderId, data) => api.post(`/feedback/${orderId}`, data),
  getMyFeedback: () => api.get('/feedback/my'),
  getAll: () => api.get('/feedback/admin/all'),
};

// QR Code APIs
export const qrAPI = {
  scan: (qrCodeString) => api.get(`/qr/scan/${qrCodeString}`),
  // Admin
  getAll: (params) => api.get('/qr', { params }),
  getById: (id) => api.get(`/qr/${id}`),
  deactivate: (id) => api.put(`/qr/${id}/deactivate`),
  getAnalytics: () => api.get('/qr/analytics'),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: (params) => api.get('/dashboard/stats', { params }),
  getRevenue: (params) => api.get('/dashboard/revenue', { params }),
  getCustomers: (params) => api.get('/dashboard/customers', { params }),
  getProducts: () => api.get('/dashboard/products'),
  getAIInsights: (params) => api.get('/dashboard/ai-insights', { params }),
};

// Coupon APIs
export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: (params) => api.get('/coupons', { params }),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  deactivate: (id) => api.put(`/coupons/${id}/deactivate`),
};

// Chat APIs
export const chatAPI = {
  getChat: (orderId) => api.get(`/chat/order/${orderId}`),
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/message`, { message }),
  markAsRead: (chatId) => api.put(`/chat/${chatId}/read`),
  // Admin
  getAll: () => api.get('/chat'),
  closeChat: (chatId) => api.put(`/chat/${chatId}/close`),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount, orderId) => api.post('/payment/create-order', { amount, orderId }),
  verify: (paymentData) => api.post('/payment/verify', paymentData),
  getStatus: (paymentId) => api.get(`/payment/status/${paymentId}`),
  // Admin
  test: () => api.get('/payment/test'),
};

export default api;

