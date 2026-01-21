import axios from 'axios'

// Hardcode API URL based on environment - NO ENV VARS
let API_URL = 'https://gigflow-bd.onrender.com/api'

// Override ONLY if running locally
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  API_URL = 'http://localhost:4000/api'
}

console.log('🌍 API Hostname:', window.location.hostname)
console.log('🔗 API URL:', API_URL)

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // This sends cookies with every request
})

// Add a response interceptor to handle auth errors
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
}

export const gigsAPI = {
  getAll: (search = '') => API.get('/gigs', { params: { search } }),
  getUserHistory: (userId) => API.get('/gigs/user/history', { params: { userId } }),
  create: (data) => API.post('/gigs', data),
}

export const bidsAPI = {
  submit: (data) => API.post('/bids', data),
  getByGigId: (gigId) => API.get(`/bids/${gigId}`),
  hire: (bidId) => API.patch(`/bids/${bidId}/hire`),
}

export default API
