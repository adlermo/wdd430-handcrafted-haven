// User role types
export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

// User interface
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Seller profile interface
export interface SellerProfile {
  id: string;
  userId: string;
  bio: string | null;
  shopName: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents
  images: string[];
  category: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  seller?: SellerProfile;
}

// Review interface
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  product?: Product;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

