import { API_CONFIG } from './apiConfig';

const getHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async <T>(route: string, token?: string): Promise<T> => {
        const response = await fetch(`${API_CONFIG.BASE_URL}${route}`, {
            method: 'GET',
            headers: getHeaders(token),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${response.status}`);
        }
        return response.json();
    },

    post: async <T>(route: string, body: unknown, token?: string): Promise<T> => {
        const response = await fetch(`${API_CONFIG.BASE_URL}${route}`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${response.status}`);
        }
        return response.json();
    },

    put: async <T>(route: string, body: unknown, token?: string): Promise<T> => {
        const response = await fetch(`${API_CONFIG.BASE_URL}${route}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${response.status}`);
        }
        return response.json();
    },

    delete: async <T>(route: string, token?: string): Promise<T> => {
        const response = await fetch(`${API_CONFIG.BASE_URL}${route}`, {
            method: 'DELETE',
            headers: getHeaders(token),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${response.status}`);
        }
        return response.json();
    },
};
