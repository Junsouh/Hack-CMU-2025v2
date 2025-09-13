import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const listItems = () => axios.get(`${API_BASE}/items`).then(r => r.data)
export const addItem = (payload) => axios.post(`${API_BASE}/items`, payload).then(r => r.data)
export const updateItem = (id, payload) => axios.put(`${API_BASE}/items/${id}`, payload).then(r => r.data)
export const deleteItem = (id) => axios.delete(`${API_BASE}/items/${id}`).then(r => r.data)
