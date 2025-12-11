'use client';

import { Star, User as UserIcon } from 'lucide-react';

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

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-display font-bold text-charcoal">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(averageRating)
                    ? 'fill-terracotta text-terracotta'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-charcoal-400 mt-1">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="flex-grow">
          {/* Star Distribution */}
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-charcoal-400 w-6">{star}★</span>
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-charcoal-400 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card-soft p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name || 'User'}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-cream-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-charcoal-400" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-charcoal">{review.user.name || 'Anonymous'}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-terracotta text-terracotta'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <time className="text-xs text-charcoal-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="text-charcoal-400 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 card-soft">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" aria-hidden="true" />
          <p className="text-charcoal-400">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}

