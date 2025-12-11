import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, Edit, Trash2, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  stock: number;
  isActive: boolean;
  category: {
    name: string;
  };
}

export const metadata = {
  title: 'My Products - Seller Dashboard',
  description: 'Manage all your products',
};

export default async function AllProductsPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    redirect('/login');
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          reviews: true,
        },
      },
    },
  });

  const products = sellerProfile?.products || [];

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-white border-b border-gray-200 shadow-soft">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>Back to Dashboard</span>
            </Link>

            <Link href="/seller/products/new" className="btn-primary">
              <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Product
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-charcoal mb-2">My Products</h1>
          <p className="text-charcoal-400">
            Manage all your products ({products.length} total)
          </p>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product: Product) => (
              <div key={product.id} className="card-soft overflow-hidden">
                <div className="aspect-square bg-cream-200 relative overflow-hidden">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-300" aria-hidden="true" />
                    </div>
                  )}
                  {!product.isActive && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                      Inactive
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-charcoal mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-charcoal-400 mb-2">{product.category.name}</p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-display font-bold text-terracotta">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-charcoal-400">Stock: {product.stock}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-sage text-white rounded-lg hover:bg-sage-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Link>
                    <button
                      className="px-3 py-2 text-sm text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-soft p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">No products yet</h3>
            <p className="text-charcoal-400 mb-6 max-w-md mx-auto">
              Start by adding your first handcrafted product to your shop.
            </p>
            <Link href="/seller/products/new" className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Your First Product
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

