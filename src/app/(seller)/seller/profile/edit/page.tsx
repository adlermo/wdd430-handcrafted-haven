'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ProfileData {
  shopName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<ProfileData>({
    shopName: '',
    bio: '',
    location: '',
    website: '',
  });

  // Fetch existing profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/seller/profile');
        const data = await response.json();

        if (response.ok && data.profile) {
          setFormData({
            shopName: data.profile.shopName || '',
            bio: data.profile.bio || '',
            location: data.profile.location || '',
            website: data.profile.website || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsFetching(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/seller/dashboard');
      }, 1500);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4" />
          <p className="text-charcoal-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-soft">
        <div className="container py-4">
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
              <CardDescription>
                Update your shop information to help customers get to know you better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm">Profile updated successfully! Redirecting...</p>
                  </div>
                )}

                <Input
                  label="Shop Name"
                  id="shopName"
                  name="shopName"
                  type="text"
                  placeholder="e.g., Sarah's Pottery Studio"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <Textarea
                  label="Bio"
                  id="bio"
                  name="bio"
                  placeholder="Tell customers about yourself and your craft..."
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={5}
                  disabled={isLoading}
                />

                <Input
                  label="Location"
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., Portland, Oregon"
                  value={formData.location || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <Input
                  label="Website"
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://your-website.com"
                  value={formData.website || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
