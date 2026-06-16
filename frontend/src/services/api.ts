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
    get: async <T = any>(route: string, token?: string): Promise<T> => {
        const url = `${API_CONFIG.BASE_URL}${route}`;

        console.log('GET URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(token),
        });

        console.log('GET STATUS:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.log('GET ERROR:', error);
            throw new Error(error.message || `Erro ${response.status}`);
        }

        return response.json() as Promise<T>;
    },

    post: async <T = any>(route: string, body: unknown, token?: string): Promise<T> => {
        const url = `${API_CONFIG.BASE_URL}${route}`;

        console.log('POST URL:', url);
        console.log('POST BODY:', JSON.stringify(body));

        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(body),
        });

        console.log('POST STATUS:', response.status);

        const text = await response.text();
        console.log('POST RESPONSE:', text);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${text}`);
        }

        return (text ? JSON.parse(text) : {}) as T;
    },

    put: async <T = any>(route: string, body: unknown, token?: string): Promise<T> => {
        const url = `${API_CONFIG.BASE_URL}${route}`;

        console.log('PUT URL:', url);
        console.log('PUT BODY:', JSON.stringify(body));

        const response = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(body),
        });

        console.log('PUT STATUS:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.log('PUT ERROR:', error);
            throw new Error(error.message || `Erro ${response.status}`);
        }

        return response.json() as Promise<T>;
    },

    delete: async <T = any>(route: string, token?: string): Promise<T> => {
        const url = `${API_CONFIG.BASE_URL}${route}`;

        console.log('DELETE URL:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders(token),
        });

        console.log('DELETE STATUS:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.log('DELETE ERROR:', error);
            throw new Error(error.message || `Erro ${response.status}`);
        }

        return response.json() as Promise<T>;
    },
};