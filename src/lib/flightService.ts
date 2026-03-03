import { NavNode, FlightInfo, LayoverRecommendation, PathResult, SAFE_BUFFER_MINUTES, LayoverJourney } from './types';
import { AirportConfig, gateToNodeId } from './airportData';
import { buildGraph, dijkstra } from './navigation';

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = 'https://api.aviationstack.com/v1';

interface AviationStackFlight {
  flight_status: string;
  flight: { iata: string; icao: string; number: string };
  airline: { name: string; iata: string };
  departure: { iata: string; terminal: string | null; gate: string | null; scheduled: string; estimated: string | null; actual: string | null };
  arrival:   { iata: string; terminal: string | null; gate: string | null; scheduled: string; estimated: string | null; actual: string | null };
}

function mapStatus(s: string): FlightInfo['status'] {
  const m: Record<string, FlightInfo['status']> = { scheduled:'scheduled', active:'active', landed:'landed', cancelled:'cancelled', incident:'delayed', diverted:'delayed' };
  return m[s] ?? 'scheduled';
}

function parseApiResponse(f: AviationStackFlight): FlightInfo {
  return {
    flightNumber: f.flight.iata ?? f.flight.icao,
    airline: f.airline.name,
    departureAirport: f.departure.iata,
    departureTerminal: f.departure.terminal ?? 'T1',
    departureGate: f.departure.gate ?? 'A1',
    departureTime: f.departure.estimated ?? f.departure.scheduled,
    arrivalAirport: f.arrival.iata,
    arrivalTerminal: f.arrival.terminal ?? 'T1',
    arrivalGate: f.arrival.gate ?? 'B1',
    arrivalTime: f.arrival.estimated ?? f.arrival.scheduled,
    status: mapStatus(f.flight_status),
  };
}

// ─── Real Flight Pairs ────────────────────────────────────────────
export interface FlightPair {
  pairId: string;
  description: string;
  flight1: FlightInfo;
  flight2: FlightInfo;
}

export function getRealFlightPairs(travelDate?: string): FlightPair[] {
  let base: Date;
  if (travelDate) {
    // Parse as local date to avoid UTC offset shifting the day
    const [y, mo, d] = travelDate.split('-').map(Number);
    base = new Date(y, mo - 1, d, 0, 0, 0, 0);
  } else {
    base = new Date();
    base.setHours(0, 0, 0, 0);
  }
  const t = (h: number, m = 0) =>
    new Date(base.getTime() + h * 3_600_000 + m * 60_000).toISOString();

  return [
    {
      pairId: 'DEL-LHR-JFK',
      description: 'New Delhi → London Heathrow → New York JFK',
      flight1: { flightNumber:'AI111', airline:'Air India',        departureAirport:'DEL', departureTerminal:'T3',          departureGate:'A2', departureTime:t(2,30),  arrivalAirport:'LHR', arrivalTerminal:'T5A',         arrivalGate:'A3', arrivalTime:t(10,45), status:'scheduled' },
      flight2: { flightNumber:'BA178', airline:'British Airways',  departureAirport:'LHR', departureTerminal:'T5B',         departureGate:'B2', departureTime:t(13,15), arrivalAirport:'JFK', arrivalTerminal:'T7',          arrivalGate:'A1', arrivalTime:t(16,30), status:'scheduled' },
    },
    {
      pairId: 'BOM-DXB-JFK',
      description: 'Mumbai → Dubai → New York JFK',
      flight1: { flightNumber:'EK501', airline:'Emirates',         departureAirport:'BOM', departureTerminal:'T2',          departureGate:'A3', departureTime:t(3,20),  arrivalAirport:'DXB', arrivalTerminal:'Concourse A', arrivalGate:'A2', arrivalTime:t(5,30),  status:'active'    },
      flight2: { flightNumber:'EK201', airline:'Emirates',         departureAirport:'DXB', departureTerminal:'Concourse B', departureGate:'B3', departureTime:t(8,45),  arrivalAirport:'JFK', arrivalTerminal:'T4',          arrivalGate:'B1', arrivalTime:t(14,20), status:'scheduled' },
    },
    {
      pairId: 'DEL-BOM-DXB',
      description: 'New Delhi → Mumbai → Dubai',
      flight1: { flightNumber:'AI665', airline:'Air India',        departureAirport:'DEL', departureTerminal:'T1',          departureGate:'A1', departureTime:t(6,0),   arrivalAirport:'BOM', arrivalTerminal:'T2',          arrivalGate:'B3', arrivalTime:t(8,10),  status:'scheduled' },
      flight2: { flightNumber:'EK508', airline:'Emirates',         departureAirport:'BOM', departureTerminal:'T2',          departureGate:'A4', departureTime:t(11,30), arrivalAirport:'DXB', arrivalTerminal:'Concourse A', arrivalGate:'A1', arrivalTime:t(13,45), status:'scheduled' },
    },
    {
      pairId: 'BOM-DXB-LHR',
      description: 'Mumbai → Dubai → London Heathrow',
      flight1: { flightNumber:'EK503', airline:'Emirates',         departureAirport:'BOM', departureTerminal:'T2',          departureGate:'A2', departureTime:t(14,10), arrivalAirport:'DXB', arrivalTerminal:'Concourse A', arrivalGate:'A4', arrivalTime:t(16,20), status:'scheduled' },
      flight2: { flightNumber:'EK003', airline:'Emirates',         departureAirport:'DXB', departureTerminal:'Concourse B', departureGate:'B4', departureTime:t(21,30), arrivalAirport:'LHR', arrivalTerminal:'T5B',         arrivalGate:'B1', arrivalTime:t(25,50), status:'scheduled' },
    },
    {
      pairId: 'JNB-LHR-JFK',
      description: 'Johannesburg → London Heathrow → New York JFK',
      flight1: { flightNumber:'BA055', airline:'British Airways',  departureAirport:'JNB', departureTerminal:'T_Intl',      departureGate:'A3', departureTime:t(18,0),  arrivalAirport:'LHR', arrivalTerminal:'T5A',         arrivalGate:'A5', arrivalTime:t(30,15), status:'scheduled' },
      flight2: { flightNumber:'BA117', airline:'British Airways',  departureAirport:'LHR', departureTerminal:'T5A',         departureGate:'A2', departureTime:t(33,30), arrivalAirport:'JFK', arrivalTerminal:'T7',          arrivalGate:'B3', arrivalTime:t(38,45), status:'scheduled' },
    },
    {
      pairId: 'MAA-KUL-MEL',
      description: 'Chennai → Kuala Lumpur → Melbourne',
      flight1: { flightNumber:'MH181', airline:'Malaysia Airlines', departureAirport:'MAA', departureTerminal:'Intl',       departureGate:'A2', departureTime:t(1,30),  arrivalAirport:'KUL', arrivalTerminal:'Main',        arrivalGate:'A3', arrivalTime:t(7,15),  status:'scheduled' },
      flight2: { flightNumber:'MH149', airline:'Malaysia Airlines', departureAirport:'KUL', departureTerminal:'Satellite',  departureGate:'B2', departureTime:t(9,45),  arrivalAirport:'MEL', arrivalTerminal:'T2',          arrivalGate:'B1', arrivalTime:t(19,30), status:'scheduled' },
    },
    {
      pairId: 'BOM-ZRH-LHR',
      description: 'Mumbai → Zurich → London Heathrow',
      flight1: { flightNumber:'LX155', airline:'SWISS',             departureAirport:'BOM', departureTerminal:'T2',       departureGate:'A1', departureTime:t(2,15),  arrivalAirport:'ZRH', arrivalTerminal:'Pier B',   arrivalGate:'B3', arrivalTime:t(8,45),  status:'scheduled' },
      flight2: { flightNumber:'LX316', airline:'SWISS',             departureAirport:'ZRH', departureTerminal:'Pier A',   departureGate:'A2', departureTime:t(10,20), arrivalAirport:'LHR', arrivalTerminal:'T2',       arrivalGate:'A1', arrivalTime:t(11,35), status:'scheduled' },
    },
    {
      pairId: 'AUS-LAX-NRT',
      description: 'Austin → Los Angeles → Tokyo Narita',
      flight1: { flightNumber:'UA357', airline:'United Airlines',   departureAirport:'AUS', departureTerminal:'T_Main',   departureGate:'A1', departureTime:t(6,0),   arrivalAirport:'LAX', arrivalTerminal:'T7',       arrivalGate:'B3', arrivalTime:t(8,15),  status:'scheduled' },
      flight2: { flightNumber:'UA32',  airline:'United Airlines',   departureAirport:'LAX', departureTerminal:'TBIT',     departureGate:'A2', departureTime:t(11,30), arrivalAirport:'NRT', arrivalTerminal:'T1',       arrivalGate:'B1', arrivalTime:t(36,45), status:'scheduled' },
    },
  ];
}

export function buildLayoverJourney(f1: FlightInfo, f2: FlightInfo): LayoverJourney | null {
  if (f1.arrivalAirport !== f2.departureAirport) return null;
  const layoverAirport = f1.arrivalAirport;
  const arr = new Date(f1.arrivalTime).getTime();
  const dep = new Date(f2.departureTime).getTime();
  const layoverMinutes = Math.round((dep - arr) / 60_000);
  const intlHubs = ['DEL','BOM','JNB','DXB','LHR','JFK','SYD','SXR'];
  const isInternationalTransfer = intlHubs.includes(f1.departureAirport) && intlHubs.includes(f2.arrivalAirport);
  const freeTime = layoverMinutes - 15 - (isInternationalTransfer ? 20 : 10) - 15;
  const healthScore = Math.max(0, Math.min(100, Math.round((freeTime / 90) * 100)));
  return { flight1: f1, flight2: f2, layoverAirport, layoverMinutes, isInternationalTransfer, healthScore };
}

export function lookupFlightPair(fn1: string, fn2: string, travelDate?: string): FlightPair | null {
  const a = fn1.toLowerCase(), b = fn2.toLowerCase();
  return getRealFlightPairs(travelDate).find(
    p => p.flight1.flightNumber.toLowerCase() === a && p.flight2.flightNumber.toLowerCase() === b
  ) ?? null;
}

function lookupMockFlight(flightNumber: string, travelDate?: string): FlightInfo | null {
  const fn = flightNumber.toLowerCase();
  for (const pair of getRealFlightPairs(travelDate)) {
    if (pair.flight1.flightNumber.toLowerCase() === fn) return pair.flight1;
    if (pair.flight2.flightNumber.toLowerCase() === fn) return pair.flight2;
  }
  return null;
}

export async function lookupFlight(flightNumber: string, travelDate?: string): Promise<FlightInfo | null> {
  if (API_KEY && API_KEY !== 'your_api_key_here') {
    try {
      const url = `${BASE_URL}/flights?access_key=${API_KEY}&flight_iata=${flightNumber.toUpperCase()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.error && data.data?.length > 0) return parseApiResponse(data.data[0]);
    } catch (err) { console.warn('AviationStack failed, using mock:', err); }
  }
  return lookupMockFlight(flightNumber, travelDate);
}

export async function pollFlightUpdate(flightNumber: string): Promise<FlightInfo | null> {
  return lookupFlight(flightNumber);
}

export function optimizeLayover(
  arrivalTime: string, departureTime: string,
  arrivalGate: string, departureGate: string,
  airport: AirportConfig
): LayoverRecommendation {
  const arrival   = new Date(arrivalTime);
  const departure = new Date(departureTime);
  const availableMinutes = (departure.getTime() - arrival.getTime()) / 60_000;
  const usableTime = availableMinutes - SAFE_BUFFER_MINUTES;
  const graph = buildGraph(airport.edges);
  const departureNodeId = gateToNodeId(departureGate);

  let recommendation: string;
  let suggestedAmenities: NavNode[] = [];
  if (usableTime < 30) {
    recommendation = 'Limited time — visit a nearby washroom only. Head to your gate soon.';
    suggestedAmenities = airport.nodes.filter(n => n.amenityType === 'washroom');
  } else if (usableTime < 60) {
    recommendation = "Time for a quick coffee or snack. Don't wander too far!";
    suggestedAmenities = airport.nodes.filter(n => n.amenityType === 'cafe' || n.amenityType === 'washroom');
  } else {
    recommendation = 'Plenty of time! Visit the lounge, grab a meal, or do some shopping.';
    suggestedAmenities = airport.nodes.filter(n =>
      n.amenityType === 'lounge' || n.amenityType === 'restaurant' || n.amenityType === 'cafe' || n.amenityType === 'shop'
    );
  }

  let optimizedRoute: PathResult | null = null;
  const arrivalNodeId = gateToNodeId(arrivalGate);
  if (arrivalNodeId && departureNodeId && suggestedAmenities.length > 0) {
    let bestRoute: PathResult | null = null;
    for (const amenity of suggestedAmenities) {
      const toAmenity   = dijkstra(graph, arrivalNodeId, amenity.id);
      const toDeparture = dijkstra(graph, amenity.id, departureNodeId);
      if (toAmenity && toDeparture) {
        const totalDist = toAmenity.distance + toDeparture.distance;
        if (!bestRoute || totalDist < bestRoute.distance) {
          bestRoute = { path: [...toAmenity.path, ...toDeparture.path.slice(1)], distance: totalDist, walkingTime: toAmenity.walkingTime + toDeparture.walkingTime };
        }
      }
    }
    optimizedRoute = bestRoute;
  }

  const timeToLeave = new Date(departure.getTime() - SAFE_BUFFER_MINUTES * 60_000)
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return { availableTime: Math.round(availableMinutes), usableTime: Math.round(usableTime), safeBuffer: SAFE_BUFFER_MINUTES, recommendation, suggestedAmenities, timeToLeave, optimizedRoute };
}

export function getMockFlights(travelDate?: string): FlightInfo[] {
  return getRealFlightPairs(travelDate).flatMap(p => [p.flight1, p.flight2]);
}
