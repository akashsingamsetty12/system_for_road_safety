import axios from 'axios';

// API Configuration
// Backend: http://10.104.154.182:8082/api (Spring Boot)
// YOLO API (Model): http://10.104.154.182:8087 (FastAPI)
// Frontend: Expo on phone at 10.104.154.182:8081

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.104.154.182:8082/api';
export const MODEL_BASE_URL = process.env.REACT_APP_MODEL_URL || 'http://10.104.154.182:8087';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const modelClient = axios.create({
  baseURL: MODEL_BASE_URL,
  timeout: 30000,
});

// Add request/response interceptors for logging
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: Date.now() };
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(`📥 API Response: ${response.status} ${response.config.url} [${duration}ms]`);
    return response;
  },
  (error) => {
    if (error.config?.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      console.error(`❌ API Error: ${error.config.url} [${duration}ms]`, error.message);
    }
    return Promise.reject(error);
  }
);

export const uploadAndDetect = async (imageUri) => {
  try {
    // Convert URI to FormData for multipart upload
    const formData = new FormData();
    
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'detection.jpg',
    });

    const response = await apiClient.post('/potholes/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Detection error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getPotholes = async () => {
  try {
    const response = await apiClient.get('/potholes');
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getPotholeById = async (id) => {
  try {
    const response = await apiClient.get(`/potholes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Direct model detection endpoint (Python YOLO API)
export const detectWithModel = async (imageUri) => {
  try {
    const formData = new FormData();
    
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'detection.jpg',
    });

    const response = await modelClient.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Model detection error:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Health check endpoints
export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ Backend Health:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend Health Check Failed:', error.message);
    throw error;
  }
};

export const checkDetailedHealth = async () => {
  try {
    const response = await apiClient.get('/health/detailed');
    console.log('✅ Detailed Health Check:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Detailed Health Check Failed:', error.message);
    throw error;
  }
};

export const checkImageDetectionReady = async () => {
  try {
    const response = await apiClient.get('/health/test-image-detection');
    console.log('✅ Image Detection Endpoint Ready:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Image Detection Check Failed:', error.message);
    throw error;
  }
};

export const checkVideoDetectionReady = async () => {
  try {
    const response = await apiClient.get('/health/test-video-detection');
    console.log('✅ Video Detection Endpoint Ready:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Video Detection Check Failed:', error.message);
    throw error;
  }
};

export default apiClient;
