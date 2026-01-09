// Order tracking integration for Indian courier services

export interface TrackingInfo {
  status: string;
  location?: string;
  timestamp?: string;
  description?: string;
}

export interface CourierService {
  name: string;
  trackingUrl: string;
  apiUrl?: string;
}

// Major Indian courier services
export const COURIER_SERVICES: Record<string, CourierService> = {
  'delhivery': {
    name: 'Delhivery',
    trackingUrl: 'https://www.delhivery.com/track/package/{trackingNumber}',
  },
  'bluedart': {
    name: 'Blue Dart',
    trackingUrl: 'https://www.bluedart.com/trackdart?trackNo={trackingNumber}',
  },
  'dtdc': {
    name: 'DTDC',
    trackingUrl: 'https://www.dtdc.in/tracking/tracking_results.asp?Ttype=awb_no&strCnno={trackingNumber}',
  },
  'fedex': {
    name: 'FedEx',
    trackingUrl: 'https://www.fedex.com/apps/fedextrack/?tracknumbers={trackingNumber}',
  },
  'aramex': {
    name: 'Aramex',
    trackingUrl: 'https://www.aramex.com/track/results?ShipmentNumber={trackingNumber}',
  },
  'ekart': {
    name: 'Ekart',
    trackingUrl: 'https://ekartlogistics.com/track/{trackingNumber}',
  },
  'xpressbees': {
    name: 'Xpressbees',
    trackingUrl: 'https://www.xpressbees.com/track/{trackingNumber}',
  },
  'shiprocket': {
    name: 'Shiprocket',
    trackingUrl: 'https://shiprocket.co/tracking/{trackingNumber}',
  },
  'pickrr': {
    name: 'Pickrr',
    trackingUrl: 'https://pickrr.com/track/{trackingNumber}',
  },
  'indiapost': {
    name: 'India Post',
    trackingUrl: 'https://www.indiapost.gov.in/_layouts/15/DPM.Portal/Tracking/ConsignmentTracking.aspx?trackingNumber={trackingNumber}',
  },
};

export function getTrackingUrl(courierService: string, trackingNumber: string): string {
  const service = COURIER_SERVICES[courierService.toLowerCase()];
  if (!service) {
    // Default to generic search
    return `https://www.google.com/search?q=track+${trackingNumber}`;
  }
  return service.trackingUrl.replace('{trackingNumber}', trackingNumber);
}

export function getCourierName(courierService: string): string {
  const service = COURIER_SERVICES[courierService.toLowerCase()];
  return service?.name || courierService;
}

// Simulate tracking status (in production, integrate with actual APIs)
export async function getTrackingStatus(
  courierService: string,
  trackingNumber: string
): Promise<TrackingInfo[]> {
  // This is a mock implementation
  // In production, you would integrate with actual courier APIs
  // Most courier services provide REST APIs for tracking
  
  const statuses: TrackingInfo[] = [
    {
      status: 'Order Confirmed',
      description: 'Your order has been confirmed',
      timestamp: new Date().toISOString(),
    },
    {
      status: 'Processing',
      description: 'Your order is being prepared',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      status: 'Shipped',
      description: 'Your order has been shipped',
      location: 'Warehouse',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  return statuses;
}
