'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const role = formData.get('role') as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      // Redirect to login after successful registration
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image
              src="/carving-knife-logo.png"
              alt="Handcrafted Haven Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <span className="text-3xl font-bold text-gray-900">
              Handcrafted Haven
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Sign up to start your journey with us</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
                  role="alert"
                >
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={isLoading}
              />

              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to register as:
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="buyer"
                      name="role"
                      type="radio"
                      value="BUYER"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
                      disabled={isLoading}
                    />
                    <label htmlFor="buyer" className="ml-3 block text-sm text-gray-700">
                      Buyer - Browse and purchase handcrafted items
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="seller"
                      name="role"
                      type="radio"
                      value="SELLER"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300"
                      disabled={isLoading}
                    />
                    <label htmlFor="seller" className="ml-3 block text-sm text-gray-700">
                      Seller - Sell your handcrafted products
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

