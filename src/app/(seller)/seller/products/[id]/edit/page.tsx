'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  isActive: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/seller/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      
      const data = await response.json();
      setProduct(data.product);
      setImagePreview(data.product.images);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load product');
      setIsLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setImagePreview((prev) => [...prev, ...previews].slice(0, 5));
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
    setIsSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) * 100,
      stock: parseInt(formData.get('stock') as string),
      categoryId: formData.get('categoryId') as string,
      images: imagePreview,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      const response = await fetch(`/api/seller/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Something went wrong');
        setIsSaving(false);
        return;
      }

      router.push('/seller/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-terracotta animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-charcoal-400">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
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
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>Update your product details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Product Images */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Product Images
                  </label>
                  
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

                  {imagePreview.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-terracotta hover:bg-cream-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-charcoal-400 mb-2" aria-hidden="true" />
                        <p className="text-sm text-charcoal-400">
                          <span className="font-semibold">Click to upload</span> more images
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={isSaving}
                      />
                    </label>
                  )}
                </div>

                <Input
                  label="Product Name"
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={product.name}
                  required
                  disabled={isSaving}
                />

                <Textarea
                  label="Description"
                  id="description"
                  name="description"
                  defaultValue={product.description}
                  rows={6}
                  required
                  disabled={isSaving}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Price (USD)"
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={(product.price / 100).toFixed(2)}
                    required
                    disabled={isSaving}
                  />

                  <Input
                    label="Stock Quantity"
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={product.stock}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-charcoal mb-2">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={product.categoryId}
                    required
                    disabled={isSaving}
                    className="flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-base
                      focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent
                      transition-all duration-200 disabled:opacity-50"
                  >
                    <option value="pottery">Pottery & Ceramics</option>
                    <option value="jewelry">Jewelry & Accessories</option>
                    <option value="textiles">Textiles & Fiber Art</option>
                    <option value="woodwork">Woodwork & Furniture</option>
                    <option value="art">Art & Prints</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked={product.isActive}
                    disabled={isSaving}
                    className="h-4 w-4 text-terracotta focus:ring-terracotta border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-charcoal">
                    Active (visible to customers)
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isSaving || imagePreview.length === 0}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

