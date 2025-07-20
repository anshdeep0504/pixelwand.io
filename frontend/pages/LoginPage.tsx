import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card title="Login to your Account">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-brand-text-secondary mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-primary border border-brand-border rounded-md px-3 py-2 placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent disabled:bg-brand-text-secondary disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
         <p className="mt-6 text-center text-sm text-brand-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-brand-accent hover:text-brand-accent-hover">
              Sign up
            </Link>
          </p>
      </Card>
    </div>
  );
};

export default LoginPage;