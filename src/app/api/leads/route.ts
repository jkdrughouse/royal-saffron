import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/app/lib/db';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  query: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, query } = body;

    // Validation
    if (!name || !email || !phone || !query) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Create lead
    const lead: Lead = {
      id: `LEAD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\D/g, ''),
      query: query.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const leads: Lead[] = await DB.leads();
    leads.push(lead);
    await DB.saveLeads(leads);

    // Send WhatsApp notification
    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919876543210";
    const message = `🎯 New Lead - Jhelum Kesar Co.\n\n` +
      `Name: ${lead.name}\n` +
      `Email: ${lead.email}\n` +
      `Phone: ${lead.phone}\n` +
      `Query: ${lead.query}\n\n` +
      `Lead ID: ${lead.id}\n` +
      `Time: ${new Date(lead.createdAt).toLocaleString('en-IN')}`;

    // Return success (WhatsApp will be handled client-side)
    return NextResponse.json(
      { 
        message: 'Lead submitted successfully',
        lead,
        whatsappUrl: `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
