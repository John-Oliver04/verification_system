'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [typing, setTyping] = useState({ email: '', password: '' });
  const [form, setForm] = useState({ email: '', password: '' });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitize = (value) => {
    return value.replace(/<[^>]+>/g, '');
  };

  // ✅ Combined debounced effect for both email and password
  useEffect(() => {
    const delay = setTimeout(() => {
      setForm((prev) => {
        const newEmail = sanitize(typing.email);
        const newPassword = sanitize(typing.password);

        // 🔒 Only update if values changed
        if (prev.email !== newEmail || prev.password !== newPassword) {
          return { email: newEmail, password: newPassword };
        }
        return prev;
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [typing.email, typing.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTyping((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(sanitize(data.message || 'Login failed'));
      }

      router.push('/pages/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm" role="alert">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={typing.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={typing.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full border border-gray-300 p-2 rounded"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-300 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
