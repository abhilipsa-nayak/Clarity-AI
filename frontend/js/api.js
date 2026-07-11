// Clarity AI — API Client Wrapper

const API_BASE = window.location.origin; // Fits relative endpoints when hosted from FastAPI

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('clarity_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 204) {
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        // Log out user on token expiration
        localStorage.removeItem('clarity_token');
        window.location.hash = '#/login';
        throw new Error('Your session has expired. Please log in again.');
      }
      throw new Error(data.detail || 'An unexpected error occurred');
    }
    
    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}

// --- AUTH API ---
export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  localStorage.setItem('clarity_token', data.access_token);
  return data;
}

export async function signup(email, password, name) {
  return await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name })
  });
}

export async function getProfile() {
  return await request('/api/auth/me');
}

// --- CONVERSATIONS / CHATS API ---
export async function getConversations(search = '', favoritesOnly = false) {
  let params = new URLSearchParams();
  if (search) params.append('search', search);
  if (favoritesOnly) params.append('favorites_only', 'true');
  
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return await request(`/api/conversations${queryStr}`);
}

export async function createConversation(title = 'Thinking Session') {
  return await request('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ title })
  });
}

export async function updateConversation(id, updates) {
  return await request(`/api/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
}

export async function deleteConversation(id) {
  return await request(`/api/conversations/${id}`, {
    method: 'DELETE'
  });
}

export async function getMessages(conversationId) {
  return await request(`/api/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId, content) {
  return await request(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content })
  });
}

// --- SETTINGS API ---
export async function updateProfile(updates) {
  return await request('/api/settings/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function deleteAccount() {
  return await request('/api/settings/account', {
    method: 'DELETE'
  });
}
