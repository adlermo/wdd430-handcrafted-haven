import Link from 'next/link';
import { Heart, User } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import KnifeIcon from '@/components/icons/knife-icon';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="handcrafted-gradient section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-gentle">
              <h1 className="text-handcrafted-heading mb-6">
                Discover Unique <span className="text-terracotta">Handcrafted</span> Treasures
              </h1>
              <p className="text-xl text-charcoal-400 mb-8 leading-relaxed">
                Support talented artisans and find one-of-a-kind items made with love and care. Every
                purchase tells a story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn-primary">
                  Shop Now
                </Link>
                <Link href="/register" className="btn-outline">
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-white">
          <div className="container">
            <h2 className="text-handcrafted-subheading text-center mb-12">
              Why Choose Handcrafted Haven?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center card-soft p-8">
                <div className="bg-terracotta-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KnifeIcon className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                  Unique Products
                </h3>
                <p className="text-charcoal-400 leading-relaxed">
                  Every item is carefully handcrafted, ensuring you get something truly special and unique.
                </p>
              </div>

              <div className="text-center card-soft p-8">
                <div className="bg-sage-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-sage" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                  Support Artisans
                </h3>
                <p className="text-charcoal-400 leading-relaxed">
                  Your purchases directly support talented creators and help them continue their craft.
                </p>
              </div>

              <div className="text-center card-soft p-8">
                <div className="bg-wine-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-wine" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                  Quality Assured
                </h3>
                <p className="text-charcoal-400 leading-relaxed">
                  All sellers are verified and products are reviewed to ensure the highest quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-sage-600">
          <div className="container text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-cream-200 mb-8 max-w-2xl mx-auto">
              Join our community of artisans and craft enthusiasts today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-sage-600 font-semibold rounded-lg hover:bg-cream-100 transition-colors shadow-soft-md"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

