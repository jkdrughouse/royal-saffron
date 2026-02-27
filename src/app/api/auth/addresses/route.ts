import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export interface SavedAddress {
    id: string;
    label: string; // 'Home' | 'Work' | 'Other' | custom
    isDefault: boolean;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

// GET — return address book
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const users: any[] = await DB.users();
        const dbUser = users.find((u: any) => u.id === user.id);
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const addresses: SavedAddress[] = dbUser.addresses || [];
        return NextResponse.json({ addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — add a new address
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { label, name, phone, address, city, state, pincode, isDefault } = body;

        // Validate required fields
        const requiredFields = { name, phone, address, city, state, pincode };
        for (const [field, val] of Object.entries(requiredFields)) {
            if (!val || !String(val).trim()) {
                return NextResponse.json({ error: `${field} is required` }, { status: 400 });
            }
        }

        if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
        }
        if (!/^\d{6}$/.test(pincode)) {
            return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
        }

        const users: any[] = await DB.users();
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }

        const newAddress: SavedAddress = {
            id: `addr_${Date.now()}`,
            label: label?.trim() || 'Home',
            isDefault: isDefault || users[userIndex].addresses.length === 0,
            name: name.trim(),
            phone: phone.replace(/\D/g, ''),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
        };

        // If new address is default, unset others
        if (newAddress.isDefault) {
            users[userIndex].addresses = users[userIndex].addresses.map((a: SavedAddress) => ({
                ...a,
                isDefault: false,
            }));
        }

        users[userIndex].addresses.push(newAddress);

        // Keep backward-compat: sync shippingAddress with default
        syncDefaultAddress(users[userIndex]);

        await DB.saveUsers(users);

        const { passwordHash, ...userWithoutPassword } = users[userIndex];
        return NextResponse.json({ message: 'Address added', address: newAddress, user: userWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error('Add address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — update address or set default
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await request.json();
        const { id, action, ...fields } = body;
        // action: 'update' | 'setDefault'

        if (!id) {
            return NextResponse.json({ error: 'Address id is required' }, { status: 400 });
        }

        const users: any[] = await DB.users();
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const addresses: SavedAddress[] = users[userIndex].addresses || [];
        const addrIndex = addresses.findIndex((a) => a.id === id);
        if (addrIndex === -1) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        if (action === 'setDefault') {
            users[userIndex].addresses = addresses.map((a) => ({
                ...a,
                isDefault: a.id === id,
            }));
        } else {
            // update fields
            const { label, name, phone, address, city, state, pincode } = fields;
            if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
                return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
            }
            if (pincode && !/^\d{6}$/.test(pincode)) {
                return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
            }

            users[userIndex].addresses[addrIndex] = {
                ...addresses[addrIndex],
                ...(label !== undefined && { label: label.trim() }),
                ...(name !== undefined && { name: name.trim() }),
                ...(phone !== undefined && { phone: phone.replace(/\D/g, '') }),
                ...(address !== undefined && { address: address.trim() }),
                ...(city !== undefined && { city: city.trim() }),
                ...(state !== undefined && { state: state.trim() }),
                ...(pincode !== undefined && { pincode: pincode.trim() }),
            };
        }

        // Keep backward-compat
        syncDefaultAddress(users[userIndex]);

        await DB.saveUsers(users);

        const { passwordHash, ...userWithoutPassword } = users[userIndex];
        return NextResponse.json({ message: 'Address updated', user: userWithoutPassword });
    } catch (error) {
        console.error('Update address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — remove an address
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Address id is required' }, { status: 400 });
        }

        const users: any[] = await DB.users();
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const addresses: SavedAddress[] = users[userIndex].addresses || [];
        const toDelete = addresses.find((a) => a.id === id);
        if (!toDelete) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        const remaining = addresses.filter((a) => a.id !== id);

        // If deleted was default, promote first remaining
        if (toDelete.isDefault && remaining.length > 0) {
            remaining[0].isDefault = true;
        }

        users[userIndex].addresses = remaining;
        syncDefaultAddress(users[userIndex]);

        await DB.saveUsers(users);

        const { passwordHash, ...userWithoutPassword } = users[userIndex];
        return NextResponse.json({ message: 'Address deleted', user: userWithoutPassword });
    } catch (error) {
        console.error('Delete address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/** Keep legacy shippingAddress in sync with the default address */
function syncDefaultAddress(dbUser: any) {
    const addresses: SavedAddress[] = dbUser.addresses || [];
    const defaultAddr = addresses.find((a) => a.isDefault);
    if (defaultAddr) {
        dbUser.shippingAddress = {
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            address: defaultAddr.address,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
        };
    }
}
