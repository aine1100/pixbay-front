const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface CustomRequestInit extends RequestInit {
    _isRetry?: boolean;
    params?: Record<string, any>;
}

export const api = {
    async get(endpoint: string, options: CustomRequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    async post(endpoint: string, body: unknown, options: CustomRequestInit = {}) {
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: isFormData ? body : JSON.stringify(body),
        });
    },

    async put(endpoint: string, body: unknown, options: CustomRequestInit = {}) {
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: isFormData ? body : JSON.stringify(body),
        });
    },

    async patch(endpoint: string, body: unknown, options: CustomRequestInit = {}) {
        const isFormData = body instanceof FormData;
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: isFormData ? body : JSON.stringify(body),
        });
    },

    async delete(endpoint: string, options: CustomRequestInit = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    async request(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
        if (!API_BASE_URL) {
            console.error("[API Error] NEXT_PUBLIC_API_URL is not defined in environment variables.");
            throw new Error("API configuration mismatch");
        }

        let url = `${API_BASE_URL}${endpoint}`;
        
        if (options.params) {
            const queryParams = new URLSearchParams();
            Object.entries(options.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
            const queryString = queryParams.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        }

        // Only log body if it's NOT FormData (otherwise it might log binary or large objects)
        const bodyLog = options.body instanceof FormData ? "[FormData]" : (options.body ? JSON.parse(options.body as string) : "");
        console.log(`[API Request] ${options.method || 'GET'} ${url}`, bodyLog);

        const accessToken = typeof window !== "undefined" ? localStorage.getItem("pixbay_access_token") : null;

        const headers: Record<string, string> = {
            ...options.headers as Record<string, string>,
        };

        // Automatic Content-Type handling
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        try {
            console.log(`[API Fetching] ${url}...`);
            const response = await fetch(url, { ...options, headers });
            console.log(`[API Response Status] ${response.status} ${response.ok ? 'OK' : 'Error'}`);

            if (response.status === 401) {
                const refreshToken = typeof window !== "undefined" ? localStorage.getItem("pixbay_refresh_token") : null;
                const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";
                
                // If we have a refresh token and we're NOT already trying to refresh/login
                if (refreshToken && !options._isRetry && !endpoint.includes("/refresh-token") && !isLoginPage) {
                    console.log("[API 401] Attempting to refresh token...");
                    
                    try {
                        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken })
                        });

                        if (refreshResponse.ok) {
                            const { data } = await refreshResponse.json();
                            if (data?.accessToken) {
                                console.log("[API] Token refreshed successfully. Retrying original request...");
                                localStorage.setItem("pixbay_access_token", data.accessToken);
                                
                                // Retry the original request with new token
                                return this.request(endpoint, { ...options, _isRetry: true } as any);
                            }
                        }
                    } catch (refreshErr) {
                        console.error("[API] Token refresh failed:", refreshErr);
                    }
                }

                console.warn("[API 401] Unauthorized. Clearing tokens and redirecting...");
                
                if (typeof window !== "undefined") {
                    localStorage.removeItem("pixbay_access_token");
                    localStorage.removeItem("pixbay_refresh_token");
                    
                    if (!isLoginPage) {
                        window.location.href = "/login?expired=true";
                    }
                }
                // throw new Error("Session expired. Please log in again.");
            }

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
