import axios from 'axios';

// For local development
// axios.defaults.baseURL = 'http://localhost:8088/api/';

// For deployment
axios.defaults.baseURL = 'https://azure-oop-smux-gateway.azuremicroservices.io/api';