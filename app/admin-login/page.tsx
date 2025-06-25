 "use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLogin() {
  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // If already logged in, sign out first
        await supabase.auth.signOut();
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }
      router.replace('/admin');
    }
  };

  if (!mounted || checkingAuth) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-terracotta-50 to-ivy-50">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center font-playfair text-terracotta-700 mb-2">Admin Login</CardTitle>
          <p className="text-center text-gray-500">Sign in to manage The Corner House</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-terracotta-500 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 focus:border-terracotta-500 focus:ring-terracotta-500"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full btn-primary py-2 text-lg font-semibold mt-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}