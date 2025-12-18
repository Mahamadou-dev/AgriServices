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

// Crop API (SOAP)
export const cropAPI = {
  // SOAP service wrapper - sends XML requests
  callSOAP: async (operation: string, params: any) => {
    let soapBody = '';
    
    switch (operation) {
      case 'listCrops':
        soapBody = '<crop:listCrops/>';
        break;
      case 'getCrop':
        soapBody = `<crop:getCrop><id>${params.id}</id></crop:getCrop>`;
        break;
      case 'createCrop':
        soapBody = `<crop:createCrop>
          <name>${params.name}</name>
          <type>${params.type}</type>
          <diseaseStatus>${params.diseaseStatus}</diseaseStatus>
        </crop:createCrop>`;
        break;
      case 'updateCrop':
        soapBody = `<crop:updateCrop>
          <id>${params.id}</id>
          <name>${params.name}</name>
          <type>${params.type}</type>
          <diseaseStatus>${params.diseaseStatus}</diseaseStatus>
        </crop:updateCrop>`;
        break;
      case 'deleteCrop':
        soapBody = `<crop:deleteCrop><id>${params.id}</id></crop:deleteCrop>`;
        break;
    }

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    ${soapBody}
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await fetch(`${API_BASE_URL}/crop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': operation,
      },
      body: soapEnvelope,
    });

    const text = await response.text();
    return text;
  },

  listCrops: async () => {
    const result = await cropAPI.callSOAP('listCrops', {});
    return cropAPI.parseListCropsResponse(result);
  },

  getCrop: async (id: number) => {
    return await cropAPI.callSOAP('getCrop', { id });
  },

  createCrop: async (data: { name: string; type: string; diseaseStatus: string }) => {
    return await cropAPI.callSOAP('createCrop', data);
  },

  updateCrop: async (id: number, data: { name: string; type: string; diseaseStatus: string }) => {
    return await cropAPI.callSOAP('updateCrop', { id, ...data });
  },

  deleteCrop: async (id: number) => {
    return await cropAPI.callSOAP('deleteCrop', { id });
  },

  // Parse SOAP response for list of crops
  parseListCropsResponse: (xml: string) => {
    try {
      // Extract the return content from SOAP response
      const returnMatch = xml.match(/<return>([\s\S]*?)<\/return>/);
      if (!returnMatch) return [];
      
      const content = returnMatch[1];
      const lines = content.split('\n').map(l => l.trim()).filter(l => l);
      
      const crops = [];
      for (const line of lines) {
        // Match pattern: ID: 1, Name: Winter Wheat, Type: Cereal, Disease Status: Healthy
        const match = line.match(/ID:\s*(\d+),\s*Name:\s*([^,]+),\s*Type:\s*([^,]+),\s*Disease Status:\s*(.+)/);
        if (match) {
          crops.push({
            id: parseInt(match[1]),
            name: match[2].trim(),
            type: match[3].trim(),
            diseaseStatus: match[4].trim(),
          });
        }
      }
      return crops;
    } catch (error) {
      console.error('Error parsing crops response:', error);
      return [];
    }
  },
};

// Billing API (SOAP)
export const billingAPI = {
  callSOAP: async (operation: string, params: any) => {
    let soapBody = '';
    
    switch (operation) {
      case 'GetInvoiceDetailsAsync':
        soapBody = `<tem:GetInvoiceDetailsAsync>
          <tem:invoiceId>${params.invoiceId}</tem:invoiceId>
        </tem:GetInvoiceDetailsAsync>`;
        break;
      case 'GenerateNewInvoiceAsync':
        soapBody = `<tem:GenerateNewInvoiceAsync>
          <tem:farmerName>${params.farmerName}</tem:farmerName>
          <tem:amount>${params.amount}</tem:amount>
        </tem:GenerateNewInvoiceAsync>`;
        break;
    }

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    ${soapBody}
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await fetch(`${API_BASE_URL}/billing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': `http://tempuri.org/IBillingService/${operation}`,
      },
      body: soapEnvelope,
    });

    const text = await response.text();
    return text;
  },

  getInvoiceDetails: async (invoiceId: number) => {
    const result = await billingAPI.callSOAP('GetInvoiceDetailsAsync', { invoiceId });
    return billingAPI.parseInvoiceDetailsResponse(result);
  },

  generateNewInvoice: async (farmerName: string, amount: number) => {
    const result = await billingAPI.callSOAP('GenerateNewInvoiceAsync', { farmerName, amount });
    return billingAPI.parseGenerateInvoiceResponse(result);
  },

  // Parse SOAP response for invoice details
  parseInvoiceDetailsResponse: (xml: string) => {
    try {
      const idMatch = xml.match(/<Id>(\d+)<\/Id>/);
      const nameMatch = xml.match(/<FarmerName>([^<]+)<\/FarmerName>/);
      const amountMatch = xml.match(/<Amount>([\d.]+)<\/Amount>/);
      const dateMatch = xml.match(/<IssueDate>([^<]+)<\/IssueDate>/);
      
      if (idMatch && nameMatch && amountMatch && dateMatch) {
        return {
          id: parseInt(idMatch[1]),
          farmerName: nameMatch[1],
          amount: parseFloat(amountMatch[1]),
          issueDate: dateMatch[1],
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing invoice details:', error);
      return null;
    }
  },

  // Parse SOAP response for generate invoice
  parseGenerateInvoiceResponse: (xml: string) => {
    try {
      const resultMatch = xml.match(/<GenerateNewInvoiceAsyncResult>([^<]+)<\/GenerateNewInvoiceAsyncResult>/);
      if (resultMatch) {
        return resultMatch[1].trim();
      }
      return 'Invoice generated successfully';
    } catch (error) {
      console.error('Error parsing generate invoice response:', error);
      return 'Invoice generated';
    }
  },
};
