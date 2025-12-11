import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).min(1).max(5).optional(),
  isActive: z.boolean().optional(),
});

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: sellerProfile.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Return categoryId as slug for the form
    return NextResponse.json({
      product: {
        ...product,
        categoryId: product.category.slug,
      },
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// UPDATE product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productUpdateSchema.parse(body);

    const { id } = await params;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    // Verify product belongs to seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        sellerId: sellerProfile.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get category if categoryId provided
    let categoryId = existingProduct.categoryId;
    if (validatedData.categoryId) {
      const category = await prisma.category.findFirst({
        where: { slug: validatedData.categoryId },
      });
      if (category) {
        categoryId = category.id;
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        images: validatedData.images,
        isActive: validatedData.isActive,
        categoryId,
      },
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 });
    }

    // Verify product belongs to seller
    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: sellerProfile.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

