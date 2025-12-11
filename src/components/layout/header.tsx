'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, User, Menu, X, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-soft">
      <nav className="container mx-auto px-4 py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image
              src="/carving-knife-logo.png"
              alt="Handcrafted Haven"
              width={150}
              height={150}
              className="h-8 w-auto"
              priority
            />
            <span className="text-2xl font-display font-bold text-charcoal">Handcrafted Haven</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
            >
              Browse Products
            </Link>
            <Link
              href="/sellers"
              className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
            >
              Our Artisans
            </Link>
            <Link
              href="/about"
              className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-charcoal-400 hover:text-terracotta transition-colors hidden sm:block"
              aria-label="View favorites"
            >
              <Heart className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* User Menu */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                className="p-2 text-charcoal-400 hover:text-terracotta transition-colors"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <User className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-soft-lg border border-gray-200 py-2 z-50">
                  {status === 'loading' ? (
                    <div className="px-4 py-3 text-sm text-charcoal-400">Loading...</div>
                  ) : session ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-charcoal">{session.user.name}</p>
                        <p className="text-xs text-charcoal-400 truncate">{session.user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {session.user.role === 'SELLER' || session.user.role === 'ADMIN' ? (
                          <Link
                            href="/seller/dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-charcoal hover:bg-cream-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                            <span>Seller Dashboard</span>
                          </Link>
                        ) : null}

                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-charcoal hover:bg-cream-100 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle className="h-4 w-4" aria-hidden="true" />
                          <span>My Profile</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-charcoal-400 hover:text-terracotta transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Products
              </Link>
              <Link
                href="/sellers"
                className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Artisans
              </Link>
              <Link
                href="/about"
                className="text-charcoal-400 hover:text-terracotta transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <>
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-charcoal">{session.user.name}</p>
                      <p className="text-xs text-charcoal-400">{session.user.email}</p>
                    </div>

                    {session.user.role === 'SELLER' || session.user.role === 'ADMIN' ? (
                      <Link
                        href="/seller/dashboard"
                        className="flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors mb-4"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                        <span>Seller Dashboard</span>
                      </Link>
                    ) : null}

                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors mb-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5" aria-hidden="true" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-5 w-5" aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors mb-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" aria-hidden="true" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" aria-hidden="true" />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Link
                  href="/favorites"
                  className="flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  <span>Favorites</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

