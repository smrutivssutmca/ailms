import React, { useState } from 'react';
import Input from './Input';
import { Button } from './Button';
import { LoginForm } from '../types/auth';

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }
      const data = await res.json();
      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Login</h2>
        <p className="text-center text-gray-500 mb-6">Sign in to your SkillShift account</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <Button type="submit" className="w-full rounded-full bg-sky-600 hover:bg-sky-700 text-lg py-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
        <div className="text-center text-gray-500 text-sm mt-4">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-sky-600 hover:underline font-medium">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
