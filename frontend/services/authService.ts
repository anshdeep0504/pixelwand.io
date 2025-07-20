import { User } from '../types';

// NOTE: This service simulates a backend using localStorage for a functional prototype.

const API_URL = 'http://localhost:5000/api'; // Change if backend runs elsewhere

export const signup = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Signup failed');
    }
    const data = await res.json();
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
};

export const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
};

export const logout = async (): Promise<void> => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};
