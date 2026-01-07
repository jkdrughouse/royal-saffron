/**
 * WhatsApp Integration Utilities
 * 
 * This file contains utilities for WhatsApp Business API integration
 * For production use, you'll need to set up WhatsApp Business API via:
 * - Meta Business (https://business.facebook.com)
 * - WhatsApp Cloud API
 * - Or use a service like Twilio, MessageBird, etc.
 */

// Environment variable for WhatsApp Business phone number
// Format: Country code + number (e.g., "919876543210" for India)
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

/**
 * Create a WhatsApp click-to-chat URL
 */
export function createWhatsAppURL(phoneNumber: string, message: string): string {
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Send order confirmation via WhatsApp (using click-to-chat)
 * For automated sending, you'll need WhatsApp Business API
 */
export function sendOrderViaWhatsApp(orderDetails: {
    customerPhone: string;
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    customerName?: string;
}) {
    if (typeof window === 'undefined') return;
    
    let message = `🎉 Order Confirmation - Jhelum Kesar Co.\n\n`;
    message += `Order ID: ${orderDetails.orderId}\n`;
    if (orderDetails.customerName) {
        message += `Customer: ${orderDetails.customerName}\n`;
    }
    message += `\nItems:\n`;
    
    orderDetails.items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\nTotal: ₹${orderDetails.total}`;
    message += `\n\nThank you for your order! We'll process it shortly.`;
    
    const url = createWhatsAppURL(orderDetails.customerPhone, message);
    window.open(url, '_blank');
}

/**
 * WhatsApp Business API Integration (requires API setup)
 * 
 * Example using fetch (you'll need to set up your API endpoint):
 */
export async function sendWhatsAppMessageAPI(
    phoneNumber: string,
    message: string,
    apiEndpoint: string,
    apiToken: string
): Promise<boolean> {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
                to: phoneNumber,
                message: message,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('WhatsApp API Error:', error);
        return false;
    }
}

/**
 * Template messages for common scenarios
 */
export const WhatsAppTemplates = {
    orderConfirmation: (orderId: string, total: number) => 
        `🎉 Order Confirmed!\n\nOrder ID: ${orderId}\nTotal: ₹${total}\n\nThank you for choosing Jhelum Kesar Co.!`,
    
    shippingUpdate: (orderId: string, trackingNumber?: string) => 
        `📦 Shipping Update\n\nOrder ID: ${orderId}\n${trackingNumber ? `Tracking: ${trackingNumber}\n` : ''}Your order is on the way!`,
    
    customerSupport: () => 
        `Hello! I need help with my order.`,
    
    productInquiry: (productName: string) => 
        `Hello! I'm interested in ${productName}. Could you provide more details?`,
};
