import { User } from 'firebase/auth';

// Base API URL
const API_BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  // Verify a Firebase ID token
  verifyToken: async (idToken: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    return handleResponse(response);
  },

  // Get user by ID
  getUser: async (uid: string, idToken: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${uid}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    return handleResponse(response);
  },
};

// Firestore API
export const firestoreAPI = {
  // Get a document
  getDocument: async (collection: string, id: string, idToken: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/firestore/${collection}/${id}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    return handleResponse(response);
  },

  // Query documents
  queryDocuments: async (collection: string, query: any, idToken: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/firestore/${collection}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(query),
    });
    return handleResponse(response);
  },

  // Create a document
  createDocument: async (collection: string, data: any, idToken: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/firestore/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update a document
  updateDocument: async (collection: string, id: string, data: any, idToken: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/firestore/${collection}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete a document
  deleteDocument: async (collection: string, id: string, idToken: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/firestore/${collection}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    return handleResponse(response);
  },
};

// MapTiler API
export const mapTilerAPI = {
  // Get the map style
  getMapStyle: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/maptiler/style`);
    return handleResponse(response);
  },
};
