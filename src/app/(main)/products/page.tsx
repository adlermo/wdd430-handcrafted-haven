'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  seller: {
    shopName: string;
  };
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Debounce price inputs (500ms delay)
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const categories = [
    { slug: 'pottery', name: 'Pottery & Ceramics' },
    { slug: 'jewelry', name: 'Jewelry & Accessories' },
    { slug: 'textiles', name: 'Textiles & Fiber Art' },
    { slug: 'woodwork', name: 'Woodwork & Furniture' },
    { slug: 'art', name: 'Art & Prints' },
    { slug: 'other', name: 'Other' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, debouncedMinPrice, debouncedMaxPrice, sortBy]);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (debouncedMinPrice) params.append('minPrice', debouncedMinPrice);
      if (debouncedMaxPrice) params.append('maxPrice', debouncedMaxPrice);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (debouncedMinPrice) params.append('minPrice', debouncedMinPrice);
    if (debouncedMaxPrice) params.append('maxPrice', debouncedMaxPrice);
    if (sortBy) params.append('sort', sortBy);

    router.push(`/products?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    router.push('/products', { scroll: false });
  }

  const hasActiveFilters = searchQuery || selectedCategory || minPrice || maxPrice;

  return (
    <>
      {/* Hero Section */}
      <section className="handcrafted-gradient section-padding">
          <div className="container text-center">
            <h1 className="text-handcrafted-heading mb-4">
              Browse <span className="text-terracotta">Handcrafted</span> Products
            </h1>
            <p className="text-xl text-charcoal-400 max-w-2xl mx-auto mb-8">
              Discover one-of-a-kind treasures made with love by talented artisans
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-lg border-2 border-gray-200 bg-white text-base
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                    transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="section-padding bg-white">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="lg:hidden w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-soft mb-4"
                  >
                    <span className="font-semibold text-charcoal flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                      Filters
                    </span>
                    {hasActiveFilters && (
                      <span className="px-2 py-1 bg-terracotta text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </button>

                  {/* Filters */}
                  <div className={`space-y-6 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="card-soft p-6">
                      <h3 className="font-display font-semibold text-charcoal mb-4">Filters</h3>

                      {/* Category Filter */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          Category
                        </label>
                        <div className="space-y-2">
                          {categories.map((cat) => (
                            <label key={cat.slug} className="flex items-center cursor-pointer group">
                              <input
                                type="radio"
                                name="category"
                                value={cat.slug}
                                checked={selectedCategory === cat.slug}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="h-4 w-4 text-sage border-gray-300 focus:ring-sage"
                              />
                              <span className="ml-3 text-sm text-charcoal-400 group-hover:text-charcoal">
                                {cat.name}
                              </span>
                            </label>
                          ))}
                          {selectedCategory && (
                            <button
                              onClick={() => setSelectedCategory('')}
                              className="text-xs text-terracotta hover:underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          Price Range
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-white text-sm
                              placeholder:text-gray-400
                              focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                              transition-all duration-200"
                          />
                          <span className="text-charcoal-400">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-white text-sm
                              placeholder:text-gray-400
                              focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                              transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Sort By */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          Sort By
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-white text-sm
                            focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
                            transition-all duration-200"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="name-asc">Name: A to Z</option>
                          <option value="name-desc">Name: Z to A</option>
                        </select>
                      </div>

                      {/* Clear All */}
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-charcoal-400">
                    {isLoading ? (
                      'Loading...'
                    ) : (
                      <>
                        Showing <span className="font-semibold text-charcoal">{products.length}</span>{' '}
                        {products.length === 1 ? 'product' : 'products'}
                      </>
                    )}
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta" />
                  </div>
                ) : products.length > 0 ? (
                  <div className="product-grid">
                    {products.map((product) => (
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
                          <h3 className="font-semibold text-charcoal mb-1 group-hover:text-terracotta transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-charcoal-400 mb-2">
                            by {product.seller.shopName}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-display font-bold text-terracotta">
                              ${(product.price / 100).toFixed(2)}
                            </p>
                            <span className="text-xs text-charcoal-400 bg-cream-200 px-2 py-1 rounded">
                              {product.category.name}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 card-soft">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-charcoal mb-2">No products found</h3>
                    <p className="text-charcoal-400 mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
