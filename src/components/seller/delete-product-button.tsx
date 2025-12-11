'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated products
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete product');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('An error occurred while deleting the product');
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-2 text-sm text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Delete ${productName}`}
    >
      {isDeleting ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      ) : (
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

