const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = {
    async get(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    async post(endpoint: string, body: unknown, options: RequestInit = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    async put(endpoint: string, body: unknown, options: RequestInit = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    async delete(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    async request(endpoint: string, options: RequestInit = {}) {
        if (!API_BASE_URL) {
            console.error("[API Error] NEXT_PUBLIC_API_URL is not defined in environment variables.");
            throw new Error("API configuration mismatch");
        }

        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`[API Request] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : "");

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            console.log(`[API Fetching] ${url}...`);
            const response = await fetch(url, { ...options, headers });
            console.log(`[API Response Status] ${response.status} ${response.ok ? 'OK' : 'Error'}`);

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Something went wrong');
            }

            return await response.json();
        } catch (err: any) {
            console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err);
            throw err;
        }
    },
};
