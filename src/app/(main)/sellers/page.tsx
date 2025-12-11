import Link from 'next/link';
import { MapPin, Package, User as UserIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Our Artisans - Handcrafted Haven',
  description: 'Meet the talented artisans who create unique handcrafted products with love and care.',
};

export default async function SellersPage() {
  // Fetch all sellers with their product count
  const sellers = await prisma.sellerProfile.findMany({
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
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="handcrafted-gradient section-padding">
          <div className="container text-center">
            <h1 className="text-handcrafted-heading mb-4">
              Meet Our <span className="text-terracotta">Artisans</span>
            </h1>
            <p className="text-xl text-charcoal-400 max-w-2xl mx-auto">
              Discover the talented creators behind every unique piece. Each artisan brings their own
              story, passion, and craftsmanship to the marketplace.
            </p>
          </div>
        </section>

        {/* Sellers Grid */}
        <section className="section-padding bg-white">
          <div className="container">
            {sellers.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-charcoal-400">
                    Showing <span className="font-semibold text-charcoal">{sellers.length}</span>{' '}
                    {sellers.length === 1 ? 'artisan' : 'artisans'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sellers.map((seller) => (
                    <Link
                      key={seller.id}
                      href={`/sellers/${seller.id}`}
                      className="card-soft overflow-hidden group hover:shadow-soft-lg transition-all duration-300"
                    >
                      {/* Header with Avatar */}
                      <div className="relative h-32 bg-gradient-to-br from-terracotta-100 to-cream-200">
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                          {seller.user.image ? (
                            <img
                              src={seller.user.image}
                              alt={seller.shopName}
                              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-soft"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-sage-200 flex items-center justify-center shadow-soft">
                              <UserIcon className="h-12 w-12 text-sage-700" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pt-16 px-6 pb-6 text-center">
                        <h3 className="text-xl font-display font-bold text-charcoal mb-1 group-hover:text-terracotta transition-colors">
                          {seller.shopName}
                        </h3>
                        <p className="text-sm text-charcoal-400 mb-3">
                          by {seller.user.name}
                        </p>

                        {/* Location */}
                        {seller.location && (
                          <div className="flex items-center justify-center gap-1 text-sm text-charcoal-400 mb-4">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span>{seller.location}</span>
                          </div>
                        )}

                        {/* Bio Preview */}
                        {seller.bio && (
                          <p className="text-sm text-charcoal-400 leading-relaxed mb-4 line-clamp-3">
                            {seller.bio}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sage">
                            <Package className="h-5 w-5" aria-hidden="true" />
                            <span className="font-semibold">
                              {seller.products.length}
                            </span>
                            <span className="text-sm text-charcoal-400">
                              {seller.products.length === 1 ? 'Product' : 'Products'}
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-4">
                          <span className="text-terracotta text-sm font-medium group-hover:underline">
                            Visit Shop →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 card-soft">
                <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-charcoal mb-2">No artisans yet</h3>
                <p className="text-charcoal-400 mb-6">
                  Be the first to join our community of talented creators!
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-terracotta text-white rounded-lg font-semibold hover:bg-terracotta-600 transition-colors"
                >
                  Become a Seller
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        {sellers.length > 0 && (
          <section className="section-padding handcrafted-gradient">
            <div className="container text-center">
              <h2 className="text-handcrafted-subheading mb-4">
                Join Our Community
              </h2>
              <p className="text-xl text-charcoal-400 mb-8 max-w-2xl mx-auto">
                Are you an artisan? Share your craft with the world and connect with customers who
                appreciate handmade quality.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-terracotta text-white rounded-lg font-semibold text-lg hover:bg-terracotta-600 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
              >
                Become a Seller
              </Link>
            </div>
          </section>
        )}
    </>
  );
}

