import axios from 'axios';

// For local development
// axios.defaults.baseURL = 'http://localhost:3000';


// --- analytics-api port connection --- //
const instance = axios.create({
    baseURL: 'http://localhost:8082',
});
  
export default instance;