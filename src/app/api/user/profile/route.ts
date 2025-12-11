import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        sellerProfile: {
          select: {
            shopName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!['BUYER', 'SELLER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Get current user role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // If changing from SELLER to BUYER, deactivate all products
    if (currentUser?.role === 'SELLER' && role === 'BUYER') {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (sellerProfile) {
        await prisma.product.updateMany({
          where: { sellerId: sellerProfile.id },
          data: { isActive: false },
        });
      }
    }

    // If changing to SELLER, create seller profile if it doesn't exist
    if (role === 'SELLER') {
      const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!existingProfile) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true },
        });

        await prisma.sellerProfile.create({
          data: {
            userId: session.user.id,
            shopName: `${user?.name || 'My'}'s Shop`,
          },
        });
      }
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete user (cascade will delete related data)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

