import axios from 'axios';
const api = axios.create({
  baseURL: "/api", // ✅ Netlify pe yehi kaam karega!
});
export default api;