// API Configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

// Auth token management
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// API call wrapper with auth
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { username: string; password: string }) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      setAuthToken(response.token);
      setUser({ username: data.username });
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },
};

// Farmer API
export const farmerAPI = {
  getAll: () => apiCall('/api/farmers'),
  
  getById: (id: string) => apiCall(`/api/farmers/${id}`),
  
  create: (data: any) => apiCall('/api/farmers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiCall(`/api/farmers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiCall(`/api/farmers/${id}`, {
    method: 'DELETE',
  }),
};

// Prediction API
export const predictionAPI = {
  predictYield: (data: {
    crop_type: string;
    area_hectares: number;
    soil_type: string;
    rainfall_mm?: number;
    temperature_c?: number;
    fertilizer_used?: boolean;
  }) => apiCall('/api/predict/yield', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  assessRisk: (data: {
    crop_type: string;
    area_hectares: number;
    soil_type: string;
    rainfall_mm?: number;
    temperature_c?: number;
    fertilizer_used?: boolean;
  }) => apiCall('/api/predict/risk', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getHistory: () => apiCall('/api/predict/history'),
};
