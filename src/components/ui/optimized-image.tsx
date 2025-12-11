import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { Package } from 'lucide-react';

interface OptimizedImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string;
  fallback?: React.ReactNode;
}

export default function OptimizedImage({
  src,
  alt,
  fallback,
  className,
  ...props
}: OptimizedImageProps) {
  // If no src, show fallback
  if (!src) {
    return (
      fallback || (
        <div className={`flex items-center justify-center bg-cream-200 ${className || ''}`}>
          <Package className="h-16 w-16 text-gray-300" aria-hidden="true" />
        </div>
      )
    );
  }

  // Check if it's an external URL (starts with http)
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      unoptimized={isExternal} // Unoptimized for external URLs for now
      {...props}
    />
  );
}

