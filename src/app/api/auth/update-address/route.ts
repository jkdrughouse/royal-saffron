import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, address } = body; // type: 'shipping' | 'billing'

    if (!type || !address) {
      return NextResponse.json(
        { error: 'Type and address are required' },
        { status: 400 }
      );
    }

    if (type !== 'shipping' && type !== 'billing') {
      return NextResponse.json(
        { error: 'Invalid address type' },
        { status: 400 }
      );
    }

    // Validate address fields
    const requiredFields = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!address[field] || !address[field].trim()) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate phone
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Validate pincode
    if (!/^\d{6}$/.test(address.pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode' },
        { status: 400 }
      );
    }

    const users: any[] = await DB.users();
    const userIndex = users.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update address
    users[userIndex][`${type}Address`] = {
      name: address.name.trim(),
      phone: address.phone.replace(/\D/g, ''),
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };

    await DB.saveUsers(users);

    // Return updated user
    const { passwordHash, ...userWithoutPassword } = users[userIndex];
    return NextResponse.json({
      message: 'Address updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
