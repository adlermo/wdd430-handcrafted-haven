import Link from 'next/link';
import { Heart, Users, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us - Handcrafted Haven',
  description: 'Learn about Handcrafted Haven and our mission to connect artisans with customers who appreciate handmade quality.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="handcrafted-gradient section-padding">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <Image
              src="/carving-knife-logo.png"
              alt="Handcrafted Haven Logo"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <h1 className="text-handcrafted-heading mb-6">
              About <span className="text-terracotta">Handcrafted Haven</span>
            </h1>
            <p className="text-xl text-charcoal-400 leading-relaxed">
              A marketplace where artisans and creators connect with people who value the beauty,
              quality, and story behind handmade products.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-handcrafted-subheading text-center mb-8">Our Mission</h2>
            <div className="prose prose-lg max-w-none text-center">
              <p className="text-xl text-charcoal-400 leading-relaxed mb-6">
                We believe in the power of handmade. Every product tells a story, carries the
                passion of its maker, and represents hours of dedicated craftsmanship.
              </p>
              <p className="text-xl text-charcoal-400 leading-relaxed">
                Handcrafted Haven exists to celebrate these stories and make it easier for talented
                artisans to share their work with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding handcrafted-gradient">
        <div className="container">
          <h2 className="text-handcrafted-subheading text-center mb-12">Our Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Authenticity */}
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Sparkles className="h-10 w-10 text-terracotta" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                Authenticity
              </h3>
              <p className="text-charcoal-400 leading-relaxed">
                Every item is genuinely handmade by skilled artisans, ensuring unique quality and
                character.
              </p>
            </div>

            {/* Community */}
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Users className="h-10 w-10 text-sage" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal mb-3">Community</h3>
              <p className="text-charcoal-400 leading-relaxed">
                We foster connections between makers and customers, building a supportive community
                of craft enthusiasts.
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Shield className="h-10 w-10 text-wine" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal mb-3">Quality</h3>
              <p className="text-charcoal-400 leading-relaxed">
                We maintain high standards to ensure every purchase meets expectations and
                celebrates craftsmanship.
              </p>
            </div>

            {/* Passion */}
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Heart className="h-10 w-10 text-terracotta" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal mb-3">Passion</h3>
              <p className="text-charcoal-400 leading-relaxed">
                Behind every product is an artisan who loves what they do, pouring heart and soul
                into their craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-handcrafted-subheading text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-charcoal-400 leading-relaxed mb-4">
                Handcrafted Haven was born from a simple observation: in a world of mass production,
                there's something special about items made by hand. Each piece carries the
                personality, skill, and dedication of its creator.
              </p>
              <p className="text-charcoal-400 leading-relaxed mb-4">
                We started this platform to give artisans a dedicated space to showcase their work,
                tell their stories, and reach customers who truly appreciate the value of handmade
                goods. Whether it's pottery, woodwork, textiles, or jewelry, every category
                represents a craft passed down through generations or reimagined by modern creators.
              </p>
              <p className="text-charcoal-400 leading-relaxed">
                Today, we're proud to support a growing community of talented makers and connect
                them with customers who understand that when you buy handmade, you're not just
                purchasing a product—you're supporting a person, a passion, and a craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding handcrafted-gradient">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-handcrafted-subheading mb-4">Join Our Community</h2>
            <p className="text-xl text-charcoal-400 mb-8">
              Whether you're an artisan looking to share your craft or a customer seeking unique,
              handmade treasures, there's a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                Browse Products
              </Link>
              <Link href="/register" className="btn-outline">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-handcrafted-subheading mb-6">Get in Touch</h2>
            <p className="text-charcoal-400 mb-6 leading-relaxed">
              Have questions? Want to learn more about selling on Handcrafted Haven? We'd love to
              hear from you.
            </p>
            <div className="card-soft p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Email Us</h3>
                  <a
                    href="mailto:hello@handcraftedhaven.com"
                    className="text-terracotta hover:underline"
                  >
                    hello@handcraftedhaven.com
                  </a>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-charcoal mb-2">Follow Our Journey</h3>
                  <p className="text-sm text-charcoal-400">
                    Connect with us on social media to see the latest from our artisan community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

