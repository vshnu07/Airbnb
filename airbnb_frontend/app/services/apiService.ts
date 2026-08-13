import { getAccessToken } from "../lib/actions";

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

const apiService = {
    get: async function (url: string): Promise<any> {
        const token = await getAccessToken();
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'GET',
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.get error:', error);
            throw error;
        }
    },

    post: async function (url: string, data: any): Promise<any> {
        const token = await getAccessToken();
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const headers: Record<string, string> = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const body = isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'POST',
                body: body,
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.post error:', error);
            throw error;
        }
    },

    put: async function (url: string, data: any): Promise<any> {
        const token = await getAccessToken();
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const headers: Record<string, string> = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const body = isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'PUT',
                body: body,
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.put error:', error);
            throw error;
        }
    },

    patch: async function (url: string, data: any): Promise<any> {
        const token = await getAccessToken();
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const headers: Record<string, string> = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const body = isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'PATCH',
                body: body,
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.patch error:', error);
            throw error;
        }
    },

    delete: async function (url: string): Promise<any> {
        const token = await getAccessToken();
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'DELETE',
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.delete error:', error);
            throw error;
        }
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
        const headers: Record<string, string> = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = 'application/json';
        }

        const body = isFormData ? data : (typeof data === 'string' ? data : JSON.stringify(data));

        try {
            const response = await fetch(`${getBaseUrl()}${url}`, {
                method: 'POST',
                body: body,
                headers: headers
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error('apiService.postWithoutToken error:', error);
            throw error;
        }
    }
};

export default apiService;