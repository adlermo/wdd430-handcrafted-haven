'use client';

import { useState, useEffect } from 'react';
import ReviewForm from './review-form';
import ReviewList from './review-list';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsSectionProps {
  productSlug: string;
}

export default function ProductReviewsSection({ productSlug }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReviewSubmitted() {
    fetchReviews();
  }

  return (
    <section className="container pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-display font-bold text-charcoal">Customer Reviews</h2>

        {/* Review Form */}
        <ReviewForm productSlug={productSlug} onReviewSubmitted={handleReviewSubmitted} />

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta" />
          </div>
        ) : (
          <ReviewList reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
        )}
      </div>
    </section>
  );
}

