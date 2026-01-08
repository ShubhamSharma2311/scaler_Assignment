// Environment variable should be set in Vercel dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set');
}

export const api = {
  eventTypes: {
    getAll: () => fetch(`${API_BASE_URL}/event-types`).then(res => res.json()),
    getBySlug: (slug) => fetch(`${API_BASE_URL}/event-types/${slug}`).then(res => res.json()),
    create: (data) => fetch(`${API_BASE_URL}/event-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_BASE_URL}/event-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/event-types/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },
  
  availability: {
    getAll: () => fetch(`${API_BASE_URL}/availability`).then(res => res.json()),
    bulkUpdate: (data) => fetch(`${API_BASE_URL}/availability/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  bookings: {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE_URL}/bookings?${query}`).then(res => res.json());
    },
    getById: (id) => fetch(`${API_BASE_URL}/bookings/${id}`).then(res => res.json()),
    getSlots: (params) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE_URL}/bookings/slots?${query}`).then(res => res.json());
    },
    create: (data) => fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    cancel: (id) => fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PATCH'
    }).then(res => res.json()),
    reschedule: (id, data) => fetch(`${API_BASE_URL}/bookings/${id}/reschedule`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },
  
  dateOverrides: {
    getAll: () => fetch(`${API_BASE_URL}/date-overrides`).then(res => res.json()),
    create: (data) => fetch(`${API_BASE_URL}/date-overrides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE_URL}/date-overrides/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  }
};
