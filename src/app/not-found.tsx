import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - Handcrafted Haven',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-charcoal mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-charcoal mb-4">
          Page Not Found
        </h2>
        <p className="text-charcoal-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-terracotta text-white font-semibold rounded-lg hover:bg-terracotta-600 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

