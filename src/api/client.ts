import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL configured via environment variable, defaulting to standard Spring Boot port 8080
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Centralized Axios client configured for Java Spring Boot REST microservices.
 * Includes auth bearer token interceptor and graceful error handling.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach bearer token if user is signed in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexora_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthenticated, etc.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Graceful logging for development
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.info(
        `[Nexora API] Spring Boot server unreachable at ${API_BASE_URL}. Falling back to client mock provider.`
      );
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API caller that attempts the live Spring Boot endpoint first,
 * and seamlessly falls back to the client-side mock provider if the Spring Boot server is offline.
 */
export async function executeApiCall<T>(
  networkRequest: () => Promise<AxiosResponse<T>>,
  mockFallback: () => Promise<T> | T
): Promise<T> {
  // Check if live API mode is explicitly disabled or offline
  const isLiveApiEnabled = import.meta.env.VITE_ENABLE_LIVE_SPRING_BOOT === 'true';

  if (!isLiveApiEnabled) {
    return await mockFallback();
  }

  try {
    const res = await networkRequest();
    return res.data;
  } catch (err) {
    // If Spring Boot is not running on 8080, provide fallback data so app never breaks
    console.warn('[Nexora API Fallback] Invoking mock service fallback:', err);
    return await mockFallback();
  }
}
