import axios from 'axios'

const API = axios.create({
  baseURL: 'https://gigflow-bd.onrender.com/api',
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
