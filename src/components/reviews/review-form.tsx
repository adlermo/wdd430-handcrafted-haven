'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  productSlug: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productSlug, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Reset form
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session) {
    return (
      <div className="card-soft p-6 text-center">
        <p className="text-charcoal-400 mb-4">Sign in to leave a review</p>
        <Button asChild variant="outline">
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft p-6 space-y-4">
      <h3 className="text-xl font-display font-semibold text-charcoal">Write a Review</h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-terracotta text-terracotta'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium text-charcoal mb-2">
          Your Review (Optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent
            transition-all duration-200 resize-none"
        />
        <p className="text-xs text-charcoal-400 mt-1">{comment.length}/1000 characters</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}

