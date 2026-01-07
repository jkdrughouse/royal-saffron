"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
    className?: string;
}

export function WhatsAppButton({ 
    phoneNumber, 
    message = "Hello! I'm interested in your products.",
    className = ""
}: WhatsAppButtonProps) {
    // Format phone number (remove any non-digit characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 ${className}`}
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
    );
}

// Utility function to send WhatsApp message
export function sendWhatsAppMessage(phoneNumber: string, message: string) {
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Utility function for order confirmation message
export function createOrderMessage(orderDetails: {
    orderId?: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
}) {
    let message = "Hello! I'd like to place an order:\n\n";
    
    orderDetails.items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\nTotal: ₹${orderDetails.total}`;
    
    if (orderDetails.orderId) {
        message += `\nOrder ID: ${orderDetails.orderId}`;
    }
    
    message += "\n\nPlease confirm availability and delivery details.";
    
    return message;
}
