import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, User as UserIcon, Star, Settings, Edit } from 'lucide-react';
import DeleteProductButton from '@/components/seller/delete-product-button';

export default async function SellerDashboardPage() {
  const session = await auth();

  // Redirect if not authenticated or not a seller
  if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
    redirect('/login');
  }

  // Fetch seller profile and products
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

  // Calculate stats
  const totalProducts = sellerProfile?.products.length || 0;
  const activeProducts = sellerProfile?.products.filter((p) => p.isActive).length || 0;
  const totalReviews = sellerProfile?.products.reduce((acc, p) => acc + p.reviews.length, 0) || 0;
  
  // Calculate average rating across all products with reviews
  const productsWithReviews = sellerProfile?.products.filter((p) => p.reviews.length > 0) || [];
  const averageRating =
    productsWithReviews.length > 0
      ? productsWithReviews.reduce((acc, p) => {
          const productAvg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length;
          return acc + productAvg;
        }, 0) / productsWithReviews.length
      : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-soft">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-charcoal">Seller Dashboard</h1>
              <p className="text-charcoal-400 mt-1">Welcome back, {session.user.name}!</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-charcoal-400 hover:text-terracotta transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-soft p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-charcoal-400">Total Products</h3>
              <Package className="h-5 w-5 text-terracotta" aria-hidden="true" />
            </div>
            <p className="text-3xl font-display font-bold text-charcoal">{totalProducts}</p>
            <p className="text-xs text-charcoal-400 mt-1">{activeProducts} active</p>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-charcoal-400">Total Reviews</h3>
              <Star className="h-5 w-5 text-sage" aria-hidden="true" />
            </div>
            <p className="text-3xl font-display font-bold text-charcoal">{totalReviews}</p>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-charcoal-400">Average Rating</h3>
              <Star className="h-5 w-5 text-wine" aria-hidden="true" />
            </div>
            <p className="text-3xl font-display font-bold text-charcoal">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= averageRating ? 'text-wine fill-wine' : 'text-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-charcoal-400">Profile Status</h3>
              <UserIcon className="h-5 w-5 text-sage" aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold text-sage">Active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/seller/products/new" className="card-soft p-8 hover:shadow-soft-md transition-shadow group">
            <div className="flex items-start space-x-4">
              <div className="bg-terracotta-100 p-3 rounded-lg group-hover:bg-terracotta-200 transition-colors">
                <Package className="h-6 w-6 text-terracotta" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-charcoal mb-1">
                  Add New Product
                </h3>
                <p className="text-charcoal-400 text-sm">
                  Create a new product listing with photos and details
                </p>
              </div>
            </div>
          </Link>

          <Link href="/seller/profile/edit" className="card-soft p-8 hover:shadow-soft-md transition-shadow group">
            <div className="flex items-start space-x-4">
              <div className="bg-sage-100 p-3 rounded-lg group-hover:bg-sage-200 transition-colors">
                <Settings className="h-6 w-6 text-sage" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-charcoal mb-1">
                  Edit Profile
                </h3>
                <p className="text-charcoal-400 text-sm">
                  Update your shop information, bio, and contact details
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Products List */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-charcoal">Your Products</h2>
            {totalProducts > 0 && (
              <Link
                href="/seller/products"
                className="text-sm text-terracotta hover:underline font-medium"
              >
                View All
              </Link>
            )}
          </div>

          {totalProducts > 0 ? (
            <div className="product-grid">
              {sellerProfile!.products.slice(0, 6).map((product) => (
                <div key={product.id} className="card-soft overflow-hidden group">
                  {/* Product Image */}
                  <div className="aspect-square bg-cream-200 relative overflow-hidden">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-charcoal-400 mb-2">{product.category.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-display font-bold text-terracotta">
                        ${(product.price / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-charcoal-400">Stock: {product.stock}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-sage text-white rounded-lg hover:bg-sage-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-charcoal mb-2">No products yet</h3>
              <p className="text-charcoal-400 mb-6 max-w-md mx-auto">
                Start by adding your first handcrafted product to your shop. Share your creativity with
                the world!
              </p>
              <Link href="/seller/products/new" className="btn-primary inline-block">
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

