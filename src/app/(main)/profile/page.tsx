'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield, Trash2, AlertTriangle, Store } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  sellerProfile?: {
    shopName: string;
  } | null;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [pendingRole, setPendingRole] = useState<'BUYER' | 'SELLER' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRoleChange(newRole: 'BUYER' | 'SELLER') {
    if (newRole === profile?.role) return;

    // Show warning if changing from SELLER to BUYER
    if (profile?.role === 'SELLER' && newRole === 'BUYER') {
      setPendingRole(newRole);
      setShowRoleWarning(true);
      return;
    }

    // Otherwise, proceed with role change
    await executeRoleChange(newRole);
  }

  async function executeRoleChange(newRole: 'BUYER' | 'SELLER') {
    setIsChangingRole(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to change role');
        setIsChangingRole(false);
        return;
      }

      // Update session
      await update();
      
      // Refresh profile
      await fetchProfile();
      
      // Redirect to appropriate dashboard
      if (newRole === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsChangingRole(false);
    }
  }

  function confirmRoleChange() {
    if (pendingRole) {
      setShowRoleWarning(false);
      executeRoleChange(pendingRole);
      setPendingRole(null);
    }
  }

  function cancelRoleChange() {
    setShowRoleWarning(false);
    setPendingRole(null);
  }

  async function handleDeleteAccount() {
    // Validate email matches
    if (deleteEmailInput.toLowerCase() !== profile?.email.toLowerCase()) {
      setError('Email does not match. Please enter your email correctly.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete account');
        setIsDeleting(false);
        return;
      }

      // Sign out and redirect
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta mx-auto mb-4" />
          <p className="text-charcoal-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-charcoal-400">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal mb-2">My Profile</h1>
            <p className="text-charcoal-400">Manage your account settings and preferences</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-charcoal-400" />
                <div>
                  <p className="text-sm text-charcoal-400">Name</p>
                  <p className="font-medium text-charcoal">{profile.name || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-charcoal-400" />
                <div>
                  <p className="text-sm text-charcoal-400">Email</p>
                  <p className="font-medium text-charcoal">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-charcoal-400" />
                <div>
                  <p className="text-sm text-charcoal-400">Member Since</p>
                  <p className="font-medium text-charcoal">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-charcoal-400" />
                <div>
                  <p className="text-sm text-charcoal-400">Account Type</p>
                  <p className="font-medium text-charcoal">
                    {profile.role === 'SELLER' ? 'Seller' : 'Buyer'}
                    {profile.role === 'ADMIN' && ' (Admin)'}
                  </p>
                </div>
              </div>

              {profile.role === 'SELLER' && profile.sellerProfile && (
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-charcoal-400" />
                  <div>
                    <p className="text-sm text-charcoal-400">Shop Name</p>
                    <p className="font-medium text-charcoal">{profile.sellerProfile.shopName}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Management */}
          {profile.role !== 'ADMIN' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Type</CardTitle>
                <CardDescription>
                  Switch between buyer and seller accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Role Warning Modal */}
                {showRoleWarning && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-grow">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">
                          Important: Switching to Buyer Account
                        </p>
                        <p className="text-sm text-yellow-700 mb-3">
                          When you switch from Seller to Buyer:
                        </p>
                        <ul className="text-sm text-yellow-700 space-y-1 mb-4 list-disc list-inside">
                          <li>Your shop profile will be <strong>preserved</strong></li>
                          <li>All your products will be marked as <strong>inactive</strong></li>
                          <li>Your products will not appear in public listings</li>
                          <li>You can switch back to Seller anytime to reactivate them</li>
                        </ul>
                        <div className="flex gap-3">
                          <Button
                            onClick={confirmRoleChange}
                            disabled={isChangingRole}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            {isChangingRole ? 'Switching...' : 'I Understand, Continue'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelRoleChange}
                            disabled={isChangingRole}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Buyer Card */}
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      profile.role === 'BUYER'
                        ? 'border-sage bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                    onClick={() => handleRoleChange('BUYER')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sage-100 rounded-lg">
                        <User className="h-5 w-5 text-sage" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-charcoal mb-1">Buyer</h3>
                        <p className="text-sm text-charcoal-400">
                          Browse and purchase handcrafted items
                        </p>
                        {profile.role === 'BUYER' && (
                          <span className="inline-block mt-2 text-xs font-medium text-sage">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seller Card */}
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      profile.role === 'SELLER'
                        ? 'border-terracotta bg-terracotta-50'
                        : 'border-gray-200 hover:border-terracotta-300'
                    }`}
                    onClick={() => handleRoleChange('SELLER')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-terracotta-100 rounded-lg">
                        <Store className="h-5 w-5 text-terracotta" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-charcoal mb-1">Seller</h3>
                        <p className="text-sm text-charcoal-400">
                          Create and sell your handcrafted products
                        </p>
                        {profile.role === 'SELLER' && (
                          <span className="inline-block mt-2 text-xs font-medium text-terracotta">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isChangingRole && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto mb-2" />
                    <p className="text-sm text-charcoal-400">Switching account type...</p>
                  </div>
                )}

                {profile.role === 'SELLER' && (
                  <div className="pt-4 border-t">
                    <Link href="/seller/dashboard" className="btn-primary">
                      Go to Seller Dashboard
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm ? (
                <div>
                  <p className="text-sm text-charcoal-400 mb-4">
                    Once you delete your account, there is no going back. This will permanently
                    delete your profile, products, and all associated data.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    Are you absolutely sure?
                  </p>
                  <p className="text-sm text-red-700 mb-4">
                    This action cannot be undone. This will permanently delete your account and
                    remove all your data from our servers.
                  </p>
                  
                  {/* Email confirmation input */}
                  <div className="mb-4">
                    <label htmlFor="confirmEmail" className="block text-sm font-medium text-red-800 mb-2">
                      Please type <strong>{profile.email}</strong> to confirm:
                    </label>
                    <input
                      id="confirmEmail"
                      type="email"
                      value={deleteEmailInput}
                      onChange={(e) => setDeleteEmailInput(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isDeleting}
                      className="w-full px-4 py-2 rounded-lg border-2 border-red-300 bg-white text-charcoal
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteEmailInput.toLowerCase() !== profile.email.toLowerCase()}
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteEmailInput('');
                        setError(null);
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

