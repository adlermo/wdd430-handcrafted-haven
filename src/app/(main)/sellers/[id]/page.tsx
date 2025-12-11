import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MapPin, Globe, Package, Star } from 'lucide-react';

interface SellerPublicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: SellerPublicPageProps) {
  const { id } = await params;
  const profile = await prisma.sellerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!profile) {
    return {
      title: 'Seller Not Found',
    };
  }

  return {
    title: `${profile.shopName} - Handcrafted Haven`,
    description: profile.bio || `Shop handcrafted items from ${profile.shopName}`,
  };
}

export default async function SellerPublicPage({ params }: SellerPublicPageProps) {
  const { id } = await params;
  const profile = await prisma.sellerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      products: {
        where: {
          isActive: true,
        },
        include: {
          reviews: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 12,
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Calculate total reviews and average rating
  const totalReviews = profile.products.reduce((acc, p) => acc + p.reviews.length, 0);
  const productsWithReviews = profile.products.filter((p) => p.reviews.length > 0);
  const averageRating =
    productsWithReviews.length > 0
      ? productsWithReviews.reduce((acc, p) => {
          const productAvg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length;
          return acc + productAvg;
        }, 0) / productsWithReviews.length
      : 0;

  return (
    <>
      {/* Banner */}
      <div className="profile-banner relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-400 to-sage-600" />
        </div>

        {/* Profile Info */}
        <section className="container -mt-16 relative z-10">
          <div className="card-soft p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-cream-300 border-4 border-white shadow-soft-md flex items-center justify-center">
                  {profile.user.image ? (
                    <img
                      src={profile.user.image}
                      alt={profile.shopName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-display font-bold text-charcoal">
                      {profile.shopName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow">
                <h1 className="text-3xl font-display font-bold text-charcoal mb-2">
                  {profile.shopName}
                </h1>
                <p className="text-charcoal-400 mb-4">by {profile.user.name}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-terracotta" aria-hidden="true" />
                    <span className="text-sm text-charcoal">
                      <span className="font-semibold">{profile.products.length}</span> Products
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-wine" aria-hidden="true" />
                    <span className="text-sm text-charcoal">
                      <span className="font-semibold">{averageRating.toFixed(1)}</span> Rating{' '}
                      <span className="text-charcoal-400">({totalReviews} reviews)</span>
                    </span>
                  </div>

                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-sage" aria-hidden="true" />
                      <span className="text-sm text-charcoal">{profile.location}</span>
                    </div>
                  )}

                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-terracotta hover:underline"
                    >
                      <Globe className="h-5 w-5" aria-hidden="true" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="prose max-w-none">
                    <p className="text-charcoal-400 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="section-padding">
          <div className="container">
            <h2 className="text-handcrafted-subheading mb-8">Products from this Shop</h2>

            {profile.products.length > 0 ? (
              <div className="product-grid">
                {profile.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="card-soft overflow-hidden group"
                  >
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
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-charcoal mb-1 group-hover:text-terracotta transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-display font-bold text-terracotta">
                        ${(product.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-charcoal mb-2">No products yet</h3>
                <p className="text-charcoal-400">
                  This seller hasn't added any products to their shop yet.
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

