const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const BACKEND_API = 'http://localhost:8082/api';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Proxy Routes
app.get('/api/potholes/locations', async (req, res) => {
  try {
    console.log('📍 Fetching potholes from backend...');
    const response = await axios.get(`${BACKEND_API}/potholes/locations`, {
      timeout: 10000,
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching potholes:', error.message);
    res.status(500).json({ error: 'Failed to fetch potholes' });
  }
});

app.get('/api/potholes', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_API}/potholes`, {
      timeout: 10000,
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching all potholes:', error.message);
    res.status(500).json({ error: 'Failed to fetch potholes' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Admin Dashboard Running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`
🌐 Admin Dashboard running on http://localhost:${PORT}
🔗 Backend API: ${BACKEND_API}
📍 Map View: http://localhost:${PORT}/map.html
  `);
});
