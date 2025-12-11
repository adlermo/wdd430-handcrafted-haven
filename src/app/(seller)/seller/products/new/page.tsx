'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImagePreview((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    // For now, using preview URLs. In production, upload to Vercel Blob first
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) * 100, // Convert to cents
      stock: parseInt(formData.get('stock') as string),
      categoryId: formData.get('categoryId') as string,
      images: imagePreview, // In production, these would be Blob URLs
    };

    try {
      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/seller/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-soft">
        <div className="container py-4">
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center space-x-2 text-charcoal-400 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Create a new product listing with photos and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                    role="alert"
                  >
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Product Images
                  </label>
                  
                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove image ${index + 1}`}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-terracotta hover:bg-cream-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-charcoal-400 mb-2" aria-hidden="true" />
                      <p className="text-sm text-charcoal-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-charcoal-400 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                  <p className="text-xs text-charcoal-400 mt-2">
                    Upload up to 5 images. First image will be the main product photo.
                  </p>
                </div>

                <Input
                  label="Product Name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Handmade Ceramic Mug"
                  required
                  disabled={isLoading}
                />

                <Textarea
                  label="Description"
                  id="description"
                  name="description"
                  placeholder="Describe your product, materials used, dimensions, care instructions..."
                  rows={6}
                  required
                  disabled={isLoading}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Price (USD)"
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    required
                    disabled={isLoading}
                  />

                  <Input
                    label="Stock Quantity"
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="10"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-charcoal mb-2">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    disabled={isLoading}
                    className="flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-base
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent
                      transition-all duration-200
                      disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50"
                  >
                    <option value="">Select a category</option>
                    <option value="pottery">Pottery & Ceramics</option>
                    <option value="jewelry">Jewelry & Accessories</option>
                    <option value="textiles">Textiles & Fiber Art</option>
                    <option value="woodwork">Woodwork & Furniture</option>
                    <option value="art">Art & Prints</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isLoading || imagePreview.length === 0}>
                    {isLoading ? 'Creating...' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>

                {imagePreview.length === 0 && (
                  <p className="text-sm text-center text-charcoal-400">
                    <ImageIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    Please upload at least one image to create your product
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

