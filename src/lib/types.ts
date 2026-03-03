// Airport navigation graph types and data

export interface NavNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'gate' | 'amenity' | 'junction' | 'entrance' | 'security';
  amenityType?: 'washroom' | 'cafe' | 'lounge' | 'restaurant' | 'shop' | 'prayer_room';
  terminal?: string;
  floor?: number;
  // Amenity metadata
  rating?: number;        // 0-5 stars
  busyness?: 'low' | 'medium' | 'high';
  openHours?: string;     // e.g. "06:00-22:00"
  distanceFromGate?: number; // metres, computed dynamically
}

export interface NavEdge {
  from: string;
  to: string;
  distance: number; // meters
}

export interface PathResult {
  path: string[];
  distance: number;
  walkingTime: number; // seconds
}

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  departureTerminal: string;
  departureGate: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  arrivalGate: string;
  arrivalTime: string;
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'delayed';
}

// Two-flight layover journey
export interface LayoverJourney {
  flight1: FlightInfo;        // Origin → Layover airport
  flight2: FlightInfo;        // Layover airport → Destination
  layoverAirport: string;     // Auto-detected common airport
  layoverMinutes: number;     // Flight2 departure - Flight1 arrival
  isInternationalTransfer: boolean; // drives security/immigration logic
  healthScore: number;        // 0-100 safety score
}

export interface LayoverRecommendation {
  availableTime: number; // minutes
  usableTime: number;
  safeBuffer: number;
  recommendation: string;
  suggestedAmenities: NavNode[];
  timeToLeave: string;
  optimizedRoute: PathResult | null;
}

// Walking speed in m/s
export const WALKING_SPEED = 1.2;
export const SAFE_BUFFER_MINUTES = 15;
