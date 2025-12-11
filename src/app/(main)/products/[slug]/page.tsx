import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, Star, MapPin, User } from 'lucide-react';
import ProductReviewsSection from '@/components/reviews/product-reviews-section';

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      seller: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Handcrafted Haven`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      seller: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Calculate average rating
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="bg-cream-50">
      {/* Back Button */}
      <div className="container py-4">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Product Details */}
        <section className="container pb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg shadow-soft overflow-hidden">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-300" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1).map((image, index) => (
                    <button
                      key={index}
                      className="aspect-square bg-white rounded-lg shadow-soft overflow-hidden hover:ring-2 hover:ring-terracotta transition-all"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="card-soft p-8 space-y-6">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 text-sm font-medium bg-cream-200 text-charcoal rounded-full">
                  {product.category.name}
                </span>

                {/* Product Name */}
                <h1 className="text-4xl font-display font-bold text-charcoal">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= averageRating ? 'text-terracotta fill-terracotta' : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-charcoal-400">
                    {averageRating.toFixed(1)} ({product.reviews.length}{' '}
                    {product.reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {/* Price */}
                <div>
                  <p className="text-4xl font-display font-bold text-terracotta">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                  {product.stock > 0 ? (
                    <p className="text-sm text-sage mt-1">
                      In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-display font-semibold text-charcoal mb-3">
                    Description
                  </h2>
                  <p className="text-charcoal-400 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Seller Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-display font-semibold text-charcoal mb-4">
                    About the Seller
                  </h2>
                  <Link
                    href={`/sellers/${product.seller.id}`}
                    className="flex items-start space-x-4 p-4 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-sage-700" aria-hidden="true" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                        {product.seller.shopName}
                      </h3>
                      <p className="text-sm text-charcoal-400">by {product.seller.user.name}</p>
                      {product.seller.location && (
                        <p className="text-sm text-charcoal-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                          {product.seller.location}
                        </p>
                      )}
                    </div>
                    <span className="text-terracotta text-sm font-medium">
                      View Shop →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Reviews Section - Client Component */}
      <ProductReviewsSection productSlug={slug} />
    </div>
  );
}
