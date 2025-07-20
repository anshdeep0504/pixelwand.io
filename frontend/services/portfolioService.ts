
import { Portfolio, AccessLog } from '../types';

// NOTE: This service simulates a backend using localStorage for a functional prototype.

type PortfolioCreationPayload = Omit<Portfolio, 'id' | 'createdAt' | 'ownerId'>;

const PORTFOLIOS_KEY = 'value-metrix-portfolios';
const LOGS_KEY = 'value-metrix-logs';
const SESSION_KEY = 'value-metrix-session';

const API_URL = 'http://localhost:5000/api/portfolios';

function getAuthHeaders() {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : undefined;
}

export const createPortfolio = async (payload: any): Promise<{ id: string }> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const authHeaders = getAuthHeaders();
    if (authHeaders) Object.assign(headers, authHeaders);
    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create portfolio');
    }
    return await res.json();
};

export const updatePortfolio = async (id: string, payload: any): Promise<any> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const authHeaders = getAuthHeaders();
    if (authHeaders) Object.assign(headers, authHeaders);
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update portfolio');
    }
    return await res.json();
};

export const getPortfolio = async (id: string): Promise<any> => {
    const token = localStorage.getItem('jwt_token');
    let url = `${API_URL}/${id}`;
    let headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    let res = await fetch(url, { headers });
    if (res.ok) {
        const portfolio = await res.json();
        // If the current user is the owner, return the protected data
        const userStr = localStorage.getItem('user');
        let isOwner = false;
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                isOwner = user.id === portfolio.ownerId || user._id === portfolio.ownerId;
            } catch {}
        }
        if (isOwner) {
            return { portfolio, viewCount: portfolio.views || 0 };
        }
    }
    // For non-owners or if protected endpoint fails, use the public endpoint (increments views)
    url = `${API_URL}/public/${id}`;
    res = await fetch(url);
    if (!res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to fetch portfolio');
        } else {
            throw new Error('Failed to fetch portfolio');
        }
    }
    return { portfolio: await res.json(), viewCount: 0 };
};

export const deletePortfolio = async (id: string): Promise<{ success: true }> => {
    const headers: Record<string, string> = {};
    const authHeaders = getAuthHeaders();
    if (authHeaders) Object.assign(headers, authHeaders);
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete portfolio');
    }
    return await res.json();
};

export const getUserPortfolios = async (): Promise<any[]> => {
    const headers: Record<string, string> = {};
    const authHeaders = getAuthHeaders();
    if (authHeaders) Object.assign(headers, authHeaders);
    const res = await fetch(`${API_URL}/mine`, {
        headers,
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch portfolios');
    }
    return await res.json();
};
