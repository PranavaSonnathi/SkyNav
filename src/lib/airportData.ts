import { NavNode, NavEdge } from './types';

export interface AirportConfig {
  code: string;
  name: string;
  city: string;
  country: string;
  nodes: NavNode[];
  edges: NavEdge[];
  mapViewBox: string;
  terminals: { id: string; label: string; x: number; y: number; w: number; h: number }[];
  centralArea?: { label: string; x: number; y: number; w: number; h: number };
}

// ────────────── DEL — Indira Gandhi International ──────────────
const delNodes: NavNode[] = [
  { id: 'gate_a1', name: 'Gate A1', x: 80, y: 60, type: 'gate', terminal: 'T1' },
  { id: 'gate_a2', name: 'Gate A2', x: 80, y: 120, type: 'gate', terminal: 'T1' },
  { id: 'gate_a3', name: 'Gate A3', x: 80, y: 180, type: 'gate', terminal: 'T1' },
  { id: 'gate_a4', name: 'Gate A4', x: 80, y: 240, type: 'gate', terminal: 'T1' },
  { id: 'gate_a5', name: 'Gate A5', x: 80, y: 300, type: 'gate', terminal: 'T1' },
  { id: 'gate_b1', name: 'Gate B1', x: 720, y: 60, type: 'gate', terminal: 'T2' },
  { id: 'gate_b2', name: 'Gate B2', x: 720, y: 120, type: 'gate', terminal: 'T2' },
  { id: 'gate_b3', name: 'Gate B3', x: 720, y: 180, type: 'gate', terminal: 'T2' },
  { id: 'gate_b4', name: 'Gate B4', x: 720, y: 240, type: 'gate', terminal: 'T2' },
  { id: 'gate_b5', name: 'Gate B5', x: 720, y: 300, type: 'gate', terminal: 'T2' },
  { id: 'junc_t1_top', name: 'T1 North', x: 180, y: 90, type: 'junction' },
  { id: 'junc_t1_mid', name: 'T1 Central', x: 180, y: 180, type: 'junction' },
  { id: 'junc_t1_bot', name: 'T1 South', x: 180, y: 270, type: 'junction' },
  { id: 'junc_center_top', name: 'Central North', x: 400, y: 90, type: 'junction' },
  { id: 'junc_center_mid', name: 'Central Hall', x: 400, y: 180, type: 'junction' },
  { id: 'junc_center_bot', name: 'Central South', x: 400, y: 270, type: 'junction' },
  { id: 'junc_t2_top', name: 'T2 North', x: 620, y: 90, type: 'junction' },
  { id: 'junc_t2_mid', name: 'T2 Central', x: 620, y: 180, type: 'junction' },
  { id: 'junc_t2_bot', name: 'T2 South', x: 620, y: 270, type: 'junction' },
  { id: 'washroom_t1', name: 'Washroom T1', x: 230, y: 130, type: 'amenity', amenityType: 'washroom', terminal: 'T1' },
  { id: 'cafe_central', name: 'Sky Brew Café', x: 350, y: 130, type: 'amenity', amenityType: 'cafe' },
  { id: 'lounge_central', name: 'Premium Lounge', x: 450, y: 130, type: 'amenity', amenityType: 'lounge' },
  { id: 'restaurant_central', name: 'Terminal Bistro', x: 400, y: 330, type: 'amenity', amenityType: 'restaurant' },
  { id: 'shop_t1', name: 'Duty Free T1', x: 250, y: 230, type: 'amenity', amenityType: 'shop', terminal: 'T1' },
  { id: 'washroom_t2', name: 'Washroom T2', x: 570, y: 230, type: 'amenity', amenityType: 'washroom', terminal: 'T2' },
  { id: 'shop_t2', name: 'Duty Free T2', x: 560, y: 130, type: 'amenity', amenityType: 'shop', terminal: 'T2' },
  { id: 'prayer_room', name: 'Prayer Room', x: 400, y: 40, type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main', name: 'Security Check', x: 400, y: 380, type: 'security' },
  { id: 'entrance_main', name: 'Main Entrance', x: 400, y: 430, type: 'entrance' },
];

const delEdges: NavEdge[] = [
  { from: 'gate_a1', to: 'junc_t1_top', distance: 50 },
  { from: 'gate_a2', to: 'junc_t1_top', distance: 40 },
  { from: 'gate_a3', to: 'junc_t1_mid', distance: 50 },
  { from: 'gate_a4', to: 'junc_t1_bot', distance: 40 },
  { from: 'gate_a5', to: 'junc_t1_bot', distance: 50 },
  { from: 'gate_b1', to: 'junc_t2_top', distance: 50 },
  { from: 'gate_b2', to: 'junc_t2_top', distance: 40 },
  { from: 'gate_b3', to: 'junc_t2_mid', distance: 50 },
  { from: 'gate_b4', to: 'junc_t2_bot', distance: 40 },
  { from: 'gate_b5', to: 'junc_t2_bot', distance: 50 },
  { from: 'junc_t1_top', to: 'junc_t1_mid', distance: 60 },
  { from: 'junc_t1_mid', to: 'junc_t1_bot', distance: 60 },
  { from: 'junc_t2_top', to: 'junc_t2_mid', distance: 60 },
  { from: 'junc_t2_mid', to: 'junc_t2_bot', distance: 60 },
  { from: 'junc_center_top', to: 'junc_center_mid', distance: 60 },
  { from: 'junc_center_mid', to: 'junc_center_bot', distance: 60 },
  { from: 'junc_t1_top', to: 'junc_center_top', distance: 150 },
  { from: 'junc_t1_mid', to: 'junc_center_mid', distance: 150 },
  { from: 'junc_t1_bot', to: 'junc_center_bot', distance: 150 },
  { from: 'junc_center_top', to: 'junc_t2_top', distance: 150 },
  { from: 'junc_center_mid', to: 'junc_t2_mid', distance: 150 },
  { from: 'junc_center_bot', to: 'junc_t2_bot', distance: 150 },
  { from: 'washroom_t1', to: 'junc_t1_top', distance: 30 },
  { from: 'washroom_t1', to: 'junc_t1_mid', distance: 35 },
  { from: 'cafe_central', to: 'junc_center_top', distance: 30 },
  { from: 'cafe_central', to: 'junc_center_mid', distance: 40 },
  { from: 'lounge_central', to: 'junc_center_top', distance: 30 },
  { from: 'lounge_central', to: 'junc_center_mid', distance: 40 },
  { from: 'restaurant_central', to: 'junc_center_bot', distance: 40 },
  { from: 'shop_t1', to: 'junc_t1_mid', distance: 40 },
  { from: 'shop_t1', to: 'junc_t1_bot', distance: 35 },
  { from: 'washroom_t2', to: 'junc_t2_mid', distance: 35 },
  { from: 'washroom_t2', to: 'junc_t2_bot', distance: 30 },
  { from: 'shop_t2', to: 'junc_t2_top', distance: 35 },
  { from: 'shop_t2', to: 'junc_t2_mid', distance: 40 },
  { from: 'prayer_room', to: 'junc_center_top', distance: 35 },
  { from: 'security_main', to: 'junc_center_bot', distance: 80 },
  { from: 'security_main', to: 'restaurant_central', distance: 40 },
  { from: 'entrance_main', to: 'security_main', distance: 30 },
];

// ────────────── DXB — Dubai International ──────────────
// Linear concourse layout (like Concourse A / B)
const dxbNodes: NavNode[] = [
  { id: 'gate_a1', name: 'Gate A1', x: 60, y: 80, type: 'gate', terminal: 'Concourse A' },
  { id: 'gate_a2', name: 'Gate A2', x: 60, y: 160, type: 'gate', terminal: 'Concourse A' },
  { id: 'gate_a3', name: 'Gate A3', x: 60, y: 240, type: 'gate', terminal: 'Concourse A' },
  { id: 'gate_a4', name: 'Gate A4', x: 60, y: 320, type: 'gate', terminal: 'Concourse A' },
  { id: 'gate_b1', name: 'Gate B1', x: 740, y: 80, type: 'gate', terminal: 'Concourse B' },
  { id: 'gate_b2', name: 'Gate B2', x: 740, y: 160, type: 'gate', terminal: 'Concourse B' },
  { id: 'gate_b3', name: 'Gate B3', x: 740, y: 240, type: 'gate', terminal: 'Concourse B' },
  { id: 'gate_b4', name: 'Gate B4', x: 740, y: 320, type: 'gate', terminal: 'Concourse B' },
  { id: 'gate_b5', name: 'Gate B5', x: 740, y: 400, type: 'gate', terminal: 'Concourse B' },
  // Spine
  { id: 'spine_a_top', name: 'A North', x: 160, y: 80, type: 'junction' },
  { id: 'spine_a_mid', name: 'A Central', x: 160, y: 200, type: 'junction' },
  { id: 'spine_a_bot', name: 'A South', x: 160, y: 320, type: 'junction' },
  { id: 'hub', name: 'Transfer Hub', x: 400, y: 200, type: 'junction' },
  { id: 'spine_b_top', name: 'B North', x: 640, y: 80, type: 'junction' },
  { id: 'spine_b_mid', name: 'B Central', x: 640, y: 200, type: 'junction' },
  { id: 'spine_b_bot', name: 'B South', x: 640, y: 320, type: 'junction' },
  // Amenities
  { id: 'lounge_a', name: 'Emirates Lounge', x: 230, y: 120, type: 'amenity', amenityType: 'lounge', terminal: 'Concourse A' },
  { id: 'cafe_hub', name: 'Costa Coffee', x: 340, y: 140, type: 'amenity', amenityType: 'cafe' },
  { id: 'shop_hub', name: 'Dubai Duty Free', x: 460, y: 140, type: 'amenity', amenityType: 'shop' },
  { id: 'restaurant_hub', name: 'Gourmet Terminal', x: 400, y: 290, type: 'amenity', amenityType: 'restaurant' },
  { id: 'washroom_a', name: 'Washroom A', x: 230, y: 280, type: 'amenity', amenityType: 'washroom', terminal: 'Concourse A' },
  { id: 'washroom_b', name: 'Washroom B', x: 570, y: 280, type: 'amenity', amenityType: 'washroom', terminal: 'Concourse B' },
  { id: 'prayer_room', name: 'Prayer Room', x: 400, y: 60, type: 'amenity', amenityType: 'prayer_room' },
  { id: 'shop_b', name: 'Luxury Mall', x: 570, y: 120, type: 'amenity', amenityType: 'shop', terminal: 'Concourse B' },
  { id: 'security_main', name: 'Security', x: 400, y: 380, type: 'security' },
  { id: 'entrance_main', name: 'Main Entrance', x: 400, y: 440, type: 'entrance' },
];

const dxbEdges: NavEdge[] = [
  { from: 'gate_a1', to: 'spine_a_top', distance: 45 },
  { from: 'gate_a2', to: 'spine_a_mid', distance: 50 },
  { from: 'gate_a3', to: 'spine_a_mid', distance: 45 },
  { from: 'gate_a4', to: 'spine_a_bot', distance: 45 },
  { from: 'gate_b1', to: 'spine_b_top', distance: 45 },
  { from: 'gate_b2', to: 'spine_b_mid', distance: 50 },
  { from: 'gate_b3', to: 'spine_b_mid', distance: 45 },
  { from: 'gate_b4', to: 'spine_b_bot', distance: 45 },
  { from: 'gate_b5', to: 'spine_b_bot', distance: 55 },
  { from: 'spine_a_top', to: 'spine_a_mid', distance: 80 },
  { from: 'spine_a_mid', to: 'spine_a_bot', distance: 80 },
  { from: 'spine_b_top', to: 'spine_b_mid', distance: 80 },
  { from: 'spine_b_mid', to: 'spine_b_bot', distance: 80 },
  { from: 'spine_a_mid', to: 'hub', distance: 200 },
  { from: 'spine_b_mid', to: 'hub', distance: 200 },
  { from: 'spine_a_top', to: 'hub', distance: 220 },
  { from: 'spine_b_top', to: 'hub', distance: 220 },
  { from: 'lounge_a', to: 'spine_a_top', distance: 35 },
  { from: 'lounge_a', to: 'spine_a_mid', distance: 45 },
  { from: 'cafe_hub', to: 'hub', distance: 40 },
  { from: 'shop_hub', to: 'hub', distance: 40 },
  { from: 'restaurant_hub', to: 'hub', distance: 60 },
  { from: 'washroom_a', to: 'spine_a_bot', distance: 30 },
  { from: 'washroom_b', to: 'spine_b_bot', distance: 30 },
  { from: 'prayer_room', to: 'hub', distance: 100 },
  { from: 'shop_b', to: 'spine_b_top', distance: 35 },
  { from: 'shop_b', to: 'spine_b_mid', distance: 45 },
  { from: 'security_main', to: 'hub', distance: 120 },
  { from: 'security_main', to: 'restaurant_hub', distance: 60 },
  { from: 'entrance_main', to: 'security_main', distance: 30 },
];

// ────────────── BOM — Chhatrapati Shivaji Maharaj ──────────────
// Single-terminal U-shape
const bomNodes: NavNode[] = [
  { id: 'gate_a1', name: 'Gate A1', x: 100, y: 60, type: 'gate', terminal: 'T2' },
  { id: 'gate_a2', name: 'Gate A2', x: 100, y: 140, type: 'gate', terminal: 'T2' },
  { id: 'gate_a3', name: 'Gate A3', x: 100, y: 220, type: 'gate', terminal: 'T2' },
  { id: 'gate_a4', name: 'Gate A4', x: 100, y: 300, type: 'gate', terminal: 'T2' },
  { id: 'gate_b1', name: 'Gate B1', x: 700, y: 60, type: 'gate', terminal: 'T2' },
  { id: 'gate_b2', name: 'Gate B2', x: 700, y: 140, type: 'gate', terminal: 'T2' },
  { id: 'gate_b3', name: 'Gate B3', x: 700, y: 220, type: 'gate', terminal: 'T2' },
  { id: 'gate_b4', name: 'Gate B4', x: 700, y: 300, type: 'gate', terminal: 'T2' },
  { id: 'gate_b5', name: 'Gate B5', x: 700, y: 380, type: 'gate', terminal: 'T2' },
  // U-shape corridor
  { id: 'junc_left_top', name: 'West Upper', x: 200, y: 90, type: 'junction' },
  { id: 'junc_left_mid', name: 'West Mid', x: 200, y: 220, type: 'junction' },
  { id: 'junc_left_bot', name: 'West Lower', x: 200, y: 340, type: 'junction' },
  { id: 'junc_bot_left', name: 'South West', x: 300, y: 400, type: 'junction' },
  { id: 'junc_bot_mid', name: 'South Central', x: 400, y: 400, type: 'junction' },
  { id: 'junc_bot_right', name: 'South East', x: 500, y: 400, type: 'junction' },
  { id: 'junc_right_bot', name: 'East Lower', x: 600, y: 340, type: 'junction' },
  { id: 'junc_right_mid', name: 'East Mid', x: 600, y: 220, type: 'junction' },
  { id: 'junc_right_top', name: 'East Upper', x: 600, y: 90, type: 'junction' },
  // Top connector
  { id: 'junc_top_mid', name: 'North Central', x: 400, y: 60, type: 'junction' },
  // Amenities
  { id: 'lounge_main', name: 'GVK Lounge', x: 400, y: 130, type: 'amenity', amenityType: 'lounge' },
  { id: 'cafe_west', name: 'Starbucks', x: 270, y: 160, type: 'amenity', amenityType: 'cafe' },
  { id: 'restaurant_south', name: 'Bombay Brasserie', x: 400, y: 330, type: 'amenity', amenityType: 'restaurant' },
  { id: 'shop_east', name: 'Duty Free', x: 530, y: 160, type: 'amenity', amenityType: 'shop' },
  { id: 'washroom_west', name: 'Washroom W', x: 250, y: 300, type: 'amenity', amenityType: 'washroom' },
  { id: 'washroom_east', name: 'Washroom E', x: 550, y: 300, type: 'amenity', amenityType: 'washroom' },
  { id: 'prayer_room', name: 'Prayer Room', x: 350, y: 50, type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main', name: 'Security', x: 400, y: 450, type: 'security' },
  { id: 'entrance_main', name: 'Entrance', x: 400, y: 490, type: 'entrance' },
];

const bomEdges: NavEdge[] = [
  { from: 'gate_a1', to: 'junc_left_top', distance: 45 },
  { from: 'gate_a2', to: 'junc_left_top', distance: 50 },
  { from: 'gate_a3', to: 'junc_left_mid', distance: 45 },
  { from: 'gate_a4', to: 'junc_left_bot', distance: 40 },
  { from: 'gate_b1', to: 'junc_right_top', distance: 45 },
  { from: 'gate_b2', to: 'junc_right_top', distance: 50 },
  { from: 'gate_b3', to: 'junc_right_mid', distance: 45 },
  { from: 'gate_b4', to: 'junc_right_bot', distance: 40 },
  { from: 'gate_b5', to: 'junc_right_bot', distance: 55 },
  // Left corridor
  { from: 'junc_left_top', to: 'junc_left_mid', distance: 90 },
  { from: 'junc_left_mid', to: 'junc_left_bot', distance: 80 },
  { from: 'junc_left_bot', to: 'junc_bot_left', distance: 70 },
  // Bottom corridor
  { from: 'junc_bot_left', to: 'junc_bot_mid', distance: 70 },
  { from: 'junc_bot_mid', to: 'junc_bot_right', distance: 70 },
  // Right corridor
  { from: 'junc_bot_right', to: 'junc_right_bot', distance: 70 },
  { from: 'junc_right_bot', to: 'junc_right_mid', distance: 80 },
  { from: 'junc_right_mid', to: 'junc_right_top', distance: 90 },
  // Top connector
  { from: 'junc_left_top', to: 'junc_top_mid', distance: 140 },
  { from: 'junc_top_mid', to: 'junc_right_top', distance: 140 },
  // Amenities
  { from: 'lounge_main', to: 'junc_top_mid', distance: 50 },
  { from: 'lounge_main', to: 'junc_left_top', distance: 80 },
  { from: 'lounge_main', to: 'junc_right_top', distance: 80 },
  { from: 'cafe_west', to: 'junc_left_top', distance: 45 },
  { from: 'cafe_west', to: 'junc_left_mid', distance: 50 },
  { from: 'restaurant_south', to: 'junc_bot_mid', distance: 50 },
  { from: 'restaurant_south', to: 'junc_left_bot', distance: 60 },
  { from: 'shop_east', to: 'junc_right_top', distance: 45 },
  { from: 'shop_east', to: 'junc_right_mid', distance: 50 },
  { from: 'washroom_west', to: 'junc_left_mid', distance: 40 },
  { from: 'washroom_west', to: 'junc_left_bot', distance: 35 },
  { from: 'washroom_east', to: 'junc_right_mid', distance: 40 },
  { from: 'washroom_east', to: 'junc_right_bot', distance: 35 },
  { from: 'prayer_room', to: 'junc_top_mid', distance: 20 },
  { from: 'security_main', to: 'junc_bot_mid', distance: 40 },
  { from: 'entrance_main', to: 'security_main', distance: 25 },
];

// ────────────── LHR — London Heathrow T5 ──────────────
// Satellite + main terminal layout
const lhrNodes: NavNode[] = [
  { id: 'gate_a1', name: 'Gate A1', x: 80, y: 80, type: 'gate', terminal: 'T5A' },
  { id: 'gate_a2', name: 'Gate A2', x: 80, y: 160, type: 'gate', terminal: 'T5A' },
  { id: 'gate_a3', name: 'Gate A3', x: 80, y: 240, type: 'gate', terminal: 'T5A' },
  { id: 'gate_a4', name: 'Gate A4', x: 200, y: 80, type: 'gate', terminal: 'T5A' },
  { id: 'gate_a5', name: 'Gate A5', x: 200, y: 240, type: 'gate', terminal: 'T5A' },
  // Satellite T5B
  { id: 'gate_b1', name: 'Gate B1', x: 600, y: 60, type: 'gate', terminal: 'T5B' },
  { id: 'gate_b2', name: 'Gate B2', x: 720, y: 60, type: 'gate', terminal: 'T5B' },
  { id: 'gate_b3', name: 'Gate B3', x: 600, y: 160, type: 'gate', terminal: 'T5B' },
  { id: 'gate_b4', name: 'Gate B4', x: 720, y: 160, type: 'gate', terminal: 'T5B' },
  { id: 'gate_b5', name: 'Gate B5', x: 660, y: 240, type: 'gate', terminal: 'T5B' },
  // T5A junctions
  { id: 'junc_5a_top', name: '5A North', x: 140, y: 120, type: 'junction' },
  { id: 'junc_5a_bot', name: '5A South', x: 140, y: 200, type: 'junction' },
  // Transit link
  { id: 'transit_west', name: 'Transit West', x: 300, y: 160, type: 'junction' },
  { id: 'transit_mid', name: 'Transit Link', x: 420, y: 160, type: 'junction' },
  { id: 'transit_east', name: 'Transit East', x: 540, y: 160, type: 'junction' },
  // T5B junctions
  { id: 'junc_5b_top', name: '5B North', x: 660, y: 110, type: 'junction' },
  { id: 'junc_5b_bot', name: '5B South', x: 660, y: 200, type: 'junction' },
  // Amenities
  { id: 'lounge_5a', name: 'BA Galleries', x: 230, y: 160, type: 'amenity', amenityType: 'lounge', terminal: 'T5A' },
  { id: 'cafe_transit', name: 'Caffè Nero', x: 360, y: 100, type: 'amenity', amenityType: 'cafe' },
  { id: 'shop_transit', name: 'World Duty Free', x: 480, y: 100, type: 'amenity', amenityType: 'shop' },
  { id: 'restaurant_5a', name: 'Gordon Ramsay', x: 180, y: 310, type: 'amenity', amenityType: 'restaurant', terminal: 'T5A' },
  { id: 'washroom_5a', name: 'Washroom 5A', x: 90, y: 310, type: 'amenity', amenityType: 'washroom', terminal: 'T5A' },
  { id: 'washroom_5b', name: 'Washroom 5B', x: 740, y: 240, type: 'amenity', amenityType: 'washroom', terminal: 'T5B' },
  { id: 'prayer_room', name: 'Prayer Room', x: 420, y: 240, type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main', name: 'Security', x: 140, y: 370, type: 'security' },
  { id: 'entrance_main', name: 'Entrance', x: 140, y: 420, type: 'entrance' },
];

const lhrEdges: NavEdge[] = [
  { from: 'gate_a1', to: 'junc_5a_top', distance: 40 },
  { from: 'gate_a2', to: 'junc_5a_top', distance: 45 },
  { from: 'gate_a2', to: 'junc_5a_bot', distance: 45 },
  { from: 'gate_a3', to: 'junc_5a_bot', distance: 40 },
  { from: 'gate_a4', to: 'junc_5a_top', distance: 50 },
  { from: 'gate_a5', to: 'junc_5a_bot', distance: 50 },
  { from: 'gate_b1', to: 'junc_5b_top', distance: 45 },
  { from: 'gate_b2', to: 'junc_5b_top', distance: 45 },
  { from: 'gate_b3', to: 'junc_5b_top', distance: 40 },
  { from: 'gate_b3', to: 'junc_5b_bot', distance: 40 },
  { from: 'gate_b4', to: 'junc_5b_top', distance: 45 },
  { from: 'gate_b4', to: 'junc_5b_bot', distance: 45 },
  { from: 'gate_b5', to: 'junc_5b_bot', distance: 35 },
  { from: 'junc_5a_top', to: 'junc_5a_bot', distance: 60 },
  { from: 'junc_5a_bot', to: 'transit_west', distance: 100 },
  { from: 'junc_5a_top', to: 'transit_west', distance: 110 },
  { from: 'transit_west', to: 'transit_mid', distance: 80 },
  { from: 'transit_mid', to: 'transit_east', distance: 80 },
  { from: 'transit_east', to: 'junc_5b_top', distance: 80 },
  { from: 'transit_east', to: 'junc_5b_bot', distance: 90 },
  { from: 'junc_5b_top', to: 'junc_5b_bot', distance: 60 },
  { from: 'lounge_5a', to: 'transit_west', distance: 40 },
  { from: 'lounge_5a', to: 'junc_5a_bot', distance: 50 },
  { from: 'cafe_transit', to: 'transit_west', distance: 50 },
  { from: 'cafe_transit', to: 'transit_mid', distance: 45 },
  { from: 'shop_transit', to: 'transit_mid', distance: 45 },
  { from: 'shop_transit', to: 'transit_east', distance: 50 },
  { from: 'restaurant_5a', to: 'junc_5a_bot', distance: 70 },
  { from: 'washroom_5a', to: 'junc_5a_bot', distance: 65 },
  { from: 'washroom_5b', to: 'junc_5b_bot', distance: 35 },
  { from: 'prayer_room', to: 'transit_mid', distance: 55 },
  { from: 'security_main', to: 'junc_5a_bot', distance: 110 },
  { from: 'security_main', to: 'restaurant_5a', distance: 40 },
  { from: 'entrance_main', to: 'security_main', distance: 30 },
];

// ────────────── Airport Registry ──────────────

export const airports: Record<string, AirportConfig> = {
  DEL: {
    code: 'DEL',
    name: 'Indira Gandhi International',
    city: 'New Delhi',
    country: 'India',
    nodes: delNodes,
    edges: delEdges,
    mapViewBox: '0 0 800 470',
    terminals: [
      { id: 'T1', label: 'Terminal 1', x: 50, y: 30, w: 160, h: 310 },
      { id: 'T2', label: 'Terminal 2', x: 590, y: 30, w: 160, h: 310 },
    ],
    centralArea: { label: 'Central Hall', x: 270, y: 50, w: 260, h: 300 },
  },
  DXB: {
    code: 'DXB',
    name: 'Dubai International',
    city: 'Dubai',
    country: 'UAE',
    nodes: dxbNodes,
    edges: dxbEdges,
    mapViewBox: '0 0 800 480',
    terminals: [
      { id: 'CA', label: 'Concourse A', x: 30, y: 40, w: 180, h: 350 },
      { id: 'CB', label: 'Concourse B', x: 590, y: 40, w: 180, h: 400 },
    ],
    centralArea: { label: 'Transfer Hub', x: 280, y: 50, w: 240, h: 310 },
  },
  BOM: {
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj',
    city: 'Mumbai',
    country: 'India',
    nodes: bomNodes,
    edges: bomEdges,
    mapViewBox: '0 0 800 520',
    terminals: [
      { id: 'T2', label: 'Terminal 2', x: 60, y: 30, w: 680, h: 430 },
    ],
  },
  LHR: {
    code: 'LHR',
    name: 'London Heathrow',
    city: 'London',
    country: 'United Kingdom',
    nodes: lhrNodes,
    edges: lhrEdges,
    mapViewBox: '0 0 800 460',
    terminals: [
      { id: 'T5A', label: 'Terminal 5A', x: 40, y: 40, w: 220, h: 230 },
      { id: 'T5B', label: 'Terminal 5B (Satellite)', x: 560, y: 30, w: 210, h: 250 },
    ],
    centralArea: { label: 'Transit Link', x: 280, y: 80, w: 260, h: 190 },
  },
};

// ────────────── JFK — John F. Kennedy International ──────────────
// T7 (British Airways) + T4 (international) layout
const jfkNodes: NavNode[] = [
  // Terminal 7 gates (BA hub)
  { id: 'gate_a1', name: 'Gate A1', x: 80,  y: 60,  type: 'gate', terminal: 'T7' },
  { id: 'gate_a2', name: 'Gate A2', x: 80,  y: 130, type: 'gate', terminal: 'T7' },
  { id: 'gate_a3', name: 'Gate A3', x: 80,  y: 200, type: 'gate', terminal: 'T7' },
  { id: 'gate_a4', name: 'Gate A4', x: 80,  y: 270, type: 'gate', terminal: 'T7' },
  { id: 'gate_a5', name: 'Gate A5', x: 80,  y: 340, type: 'gate', terminal: 'T7' },
  // Terminal 4 gates (international)
  { id: 'gate_b1', name: 'Gate B1', x: 720, y: 60,  type: 'gate', terminal: 'T4' },
  { id: 'gate_b2', name: 'Gate B2', x: 720, y: 140, type: 'gate', terminal: 'T4' },
  { id: 'gate_b3', name: 'Gate B3', x: 720, y: 220, type: 'gate', terminal: 'T4' },
  { id: 'gate_b4', name: 'Gate B4', x: 720, y: 300, type: 'gate', terminal: 'T4' },
  { id: 'gate_b5', name: 'Gate B5', x: 720, y: 380, type: 'gate', terminal: 'T4' },
  // T7 corridor junctions
  { id: 'junc_t7_top', name: 'T7 North',    x: 185, y: 80,  type: 'junction' },
  { id: 'junc_t7_mid', name: 'T7 Central',  x: 185, y: 200, type: 'junction' },
  { id: 'junc_t7_bot', name: 'T7 South',    x: 185, y: 320, type: 'junction' },
  // AirTrain / connector junctions
  { id: 'junc_air_top', name: 'AirTrain North', x: 400, y: 80,  type: 'junction' },
  { id: 'junc_air_mid', name: 'AirTrain Hub',   x: 400, y: 210, type: 'junction' },
  { id: 'junc_air_bot', name: 'AirTrain South',  x: 400, y: 340, type: 'junction' },
  // T4 corridor junctions
  { id: 'junc_t4_top', name: 'T4 North',    x: 615, y: 80,  type: 'junction' },
  { id: 'junc_t4_mid', name: 'T4 Central',  x: 615, y: 210, type: 'junction' },
  { id: 'junc_t4_bot', name: 'T4 South',    x: 615, y: 340, type: 'junction' },
  // Amenities — T7
  { id: 'lounge_t7',      name: 'BA First Lounge',    x: 240, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'T7' },
  { id: 'cafe_t7',        name: 'Joe Coffee',          x: 245, y: 260, type: 'amenity', amenityType: 'cafe',        terminal: 'T7' },
  { id: 'washroom_t7',    name: 'Washroom T7',         x: 190, y: 390, type: 'amenity', amenityType: 'washroom',    terminal: 'T7' },
  // Amenities — AirTrain hub
  { id: 'shop_center',    name: 'InMotion Electronics',x: 350, y: 155, type: 'amenity', amenityType: 'shop' },
  { id: 'restaurant_hub', name: "Shula's Bar & Grill", x: 450, y: 155, type: 'amenity', amenityType: 'restaurant' },
  { id: 'prayer_room',    name: 'Interfaith Chapel',   x: 400, y: 290, type: 'amenity', amenityType: 'prayer_room' },
  // Amenities — T4
  { id: 'lounge_t4',      name: 'Delta Sky Club',      x: 555, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'T4' },
  { id: 'cafe_t4',        name: 'Deep Blue Sushi',     x: 560, y: 270, type: 'amenity', amenityType: 'cafe',        terminal: 'T4' },
  { id: 'washroom_t4',    name: 'Washroom T4',         x: 615, y: 390, type: 'amenity', amenityType: 'washroom',    terminal: 'T4' },
  { id: 'shop_t4',        name: 'Duty Free T4',        x: 660, y: 390, type: 'amenity', amenityType: 'shop',        terminal: 'T4' },
  // Infrastructure
  { id: 'security_main',  name: 'Security / CBP',      x: 400, y: 430, type: 'security' },
  { id: 'entrance_main',  name: 'Main Entrance',        x: 400, y: 470, type: 'entrance' },
];

const jfkEdges: NavEdge[] = [
  // T7 gates → T7 junctions
  { from: 'gate_a1', to: 'junc_t7_top', distance: 55 },
  { from: 'gate_a2', to: 'junc_t7_top', distance: 45 },
  { from: 'gate_a3', to: 'junc_t7_mid', distance: 55 },
  { from: 'gate_a4', to: 'junc_t7_bot', distance: 45 },
  { from: 'gate_a5', to: 'junc_t7_bot', distance: 55 },
  // T4 gates → T4 junctions
  { from: 'gate_b1', to: 'junc_t4_top', distance: 55 },
  { from: 'gate_b2', to: 'junc_t4_top', distance: 45 },
  { from: 'gate_b3', to: 'junc_t4_mid', distance: 55 },
  { from: 'gate_b4', to: 'junc_t4_bot', distance: 45 },
  { from: 'gate_b5', to: 'junc_t4_bot', distance: 55 },
  // T7 corridor
  { from: 'junc_t7_top', to: 'junc_t7_mid', distance: 80 },
  { from: 'junc_t7_mid', to: 'junc_t7_bot', distance: 80 },
  // T4 corridor
  { from: 'junc_t4_top', to: 'junc_t4_mid', distance: 80 },
  { from: 'junc_t4_mid', to: 'junc_t4_bot', distance: 80 },
  // AirTrain hub corridor
  { from: 'junc_air_top', to: 'junc_air_mid', distance: 90 },
  { from: 'junc_air_mid', to: 'junc_air_bot', distance: 90 },
  // T7 ↔ AirTrain
  { from: 'junc_t7_top', to: 'junc_air_top', distance: 160 },
  { from: 'junc_t7_mid', to: 'junc_air_mid', distance: 160 },
  { from: 'junc_t7_bot', to: 'junc_air_bot', distance: 160 },
  // AirTrain ↔ T4
  { from: 'junc_air_top', to: 'junc_t4_top', distance: 160 },
  { from: 'junc_air_mid', to: 'junc_t4_mid', distance: 160 },
  { from: 'junc_air_bot', to: 'junc_t4_bot', distance: 160 },
  // T7 amenities
  { from: 'lounge_t7',      to: 'junc_t7_top', distance: 35 },
  { from: 'lounge_t7',      to: 'junc_t7_mid', distance: 40 },
  { from: 'cafe_t7',        to: 'junc_t7_mid', distance: 35 },
  { from: 'cafe_t7',        to: 'junc_t7_bot', distance: 40 },
  { from: 'washroom_t7',    to: 'junc_t7_bot', distance: 30 },
  // Hub amenities
  { from: 'shop_center',    to: 'junc_air_top', distance: 35 },
  { from: 'shop_center',    to: 'junc_air_mid', distance: 45 },
  { from: 'restaurant_hub', to: 'junc_air_top', distance: 35 },
  { from: 'restaurant_hub', to: 'junc_air_mid', distance: 40 },
  { from: 'prayer_room',    to: 'junc_air_mid', distance: 55 },
  { from: 'prayer_room',    to: 'junc_air_bot', distance: 45 },
  // T4 amenities
  { from: 'lounge_t4',      to: 'junc_t4_top', distance: 35 },
  { from: 'lounge_t4',      to: 'junc_t4_mid', distance: 40 },
  { from: 'cafe_t4',        to: 'junc_t4_mid', distance: 40 },
  { from: 'cafe_t4',        to: 'junc_t4_bot', distance: 35 },
  { from: 'washroom_t4',    to: 'junc_t4_bot', distance: 30 },
  { from: 'shop_t4',        to: 'junc_t4_bot', distance: 35 },
  // Security / entrance
  { from: 'security_main',  to: 'junc_air_bot', distance: 70 },
  { from: 'entrance_main',  to: 'security_main', distance: 30 },
];

// Register JFK into the airports map
airports['JFK'] = {
  code: 'JFK',
  name: 'John F. Kennedy International',
  city: 'New York',
  country: 'United States',
  nodes: jfkNodes,
  edges: jfkEdges,
  mapViewBox: '0 0 800 500',
  terminals: [
    { id: 'T7', label: 'Terminal 7 (BA)', x: 45,  y: 35, w: 175, h: 375 },
    { id: 'T4', label: 'Terminal 4',      x: 580, y: 35, w: 175, h: 375 },
  ],
  centralArea: { label: 'AirTrain Hub', x: 290, y: 45, w: 220, h: 370 },
};

// ────────────── SYD — Sydney Kingsford Smith International ──────────────
// T1 International layout — long pier with satellite gates
const sydNodes: NavNode[] = [
  // T1 International Gates — Left pier
  { id: 'gate_a1', name: 'Gate A1', x: 80,  y: 60,  type: 'gate', terminal: 'T1' },
  { id: 'gate_a2', name: 'Gate A2', x: 80,  y: 130, type: 'gate', terminal: 'T1' },
  { id: 'gate_a3', name: 'Gate A3', x: 80,  y: 200, type: 'gate', terminal: 'T1' },
  { id: 'gate_a4', name: 'Gate A4', x: 80,  y: 270, type: 'gate', terminal: 'T1' },
  { id: 'gate_a5', name: 'Gate A5', x: 80,  y: 340, type: 'gate', terminal: 'T1' },
  // T1 International Gates — Right pier
  { id: 'gate_b1', name: 'Gate B1', x: 720, y: 60,  type: 'gate', terminal: 'T1' },
  { id: 'gate_b2', name: 'Gate B2', x: 720, y: 140, type: 'gate', terminal: 'T1' },
  { id: 'gate_b3', name: 'Gate B3', x: 720, y: 220, type: 'gate', terminal: 'T1' },
  { id: 'gate_b4', name: 'Gate B4', x: 720, y: 300, type: 'gate', terminal: 'T1' },
  { id: 'gate_b5', name: 'Gate B5', x: 720, y: 380, type: 'gate', terminal: 'T1' },
  // Left pier junctions
  { id: 'junc_left_top', name: 'Pier A North',   x: 185, y: 80,  type: 'junction' },
  { id: 'junc_left_mid', name: 'Pier A Central', x: 185, y: 200, type: 'junction' },
  { id: 'junc_left_bot', name: 'Pier A South',   x: 185, y: 330, type: 'junction' },
  // Central concourse junctions
  { id: 'junc_cen_top', name: 'Concourse North', x: 400, y: 80,  type: 'junction' },
  { id: 'junc_cen_mid', name: 'Concourse Hall',  x: 400, y: 210, type: 'junction' },
  { id: 'junc_cen_bot', name: 'Concourse South', x: 400, y: 340, type: 'junction' },
  // Right pier junctions
  { id: 'junc_right_top', name: 'Pier B North',   x: 615, y: 80,  type: 'junction' },
  { id: 'junc_right_mid', name: 'Pier B Central', x: 615, y: 210, type: 'junction' },
  { id: 'junc_right_bot', name: 'Pier B South',   x: 615, y: 340, type: 'junction' },
  // Amenities
  { id: 'lounge_qantas',   name: 'Qantas First Lounge',  x: 245, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'T1' },
  { id: 'cafe_central',    name: 'Bills Café',            x: 345, y: 145, type: 'amenity', amenityType: 'cafe' },
  { id: 'restaurant_cen',  name: 'Sydney Kitchen',        x: 455, y: 145, type: 'amenity', amenityType: 'restaurant' },
  { id: 'shop_central',    name: 'Heinemann Duty Free',   x: 400, y: 290, type: 'amenity', amenityType: 'shop' },
  { id: 'lounge_intl',     name: 'Plaza Premium Lounge',  x: 555, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'T1' },
  { id: 'washroom_left',   name: 'Washroom West',         x: 200, y: 270, type: 'amenity', amenityType: 'washroom',    terminal: 'T1' },
  { id: 'washroom_right',  name: 'Washroom East',         x: 600, y: 270, type: 'amenity', amenityType: 'washroom',    terminal: 'T1' },
  { id: 'prayer_room',     name: 'Reflection Room',       x: 400, y: 50,  type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main',   name: 'Customs & Security',    x: 400, y: 420, type: 'security' },
  { id: 'entrance_main',   name: 'Terminal Entrance',     x: 400, y: 460, type: 'entrance' },
];

const sydEdges: NavEdge[] = [
  // Left pier gates → junctions
  { from: 'gate_a1', to: 'junc_left_top', distance: 50 },
  { from: 'gate_a2', to: 'junc_left_top', distance: 45 },
  { from: 'gate_a3', to: 'junc_left_mid', distance: 50 },
  { from: 'gate_a4', to: 'junc_left_bot', distance: 45 },
  { from: 'gate_a5', to: 'junc_left_bot', distance: 50 },
  // Right pier gates → junctions
  { from: 'gate_b1', to: 'junc_right_top', distance: 50 },
  { from: 'gate_b2', to: 'junc_right_top', distance: 45 },
  { from: 'gate_b3', to: 'junc_right_mid', distance: 50 },
  { from: 'gate_b4', to: 'junc_right_bot', distance: 45 },
  { from: 'gate_b5', to: 'junc_right_bot', distance: 55 },
  // Left pier corridor
  { from: 'junc_left_top', to: 'junc_left_mid', distance: 80 },
  { from: 'junc_left_mid', to: 'junc_left_bot', distance: 80 },
  // Right pier corridor
  { from: 'junc_right_top', to: 'junc_right_mid', distance: 80 },
  { from: 'junc_right_mid', to: 'junc_right_bot', distance: 80 },
  // Central concourse corridor
  { from: 'junc_cen_top', to: 'junc_cen_mid', distance: 90 },
  { from: 'junc_cen_mid', to: 'junc_cen_bot', distance: 90 },
  // Left pier ↔ concourse
  { from: 'junc_left_top', to: 'junc_cen_top', distance: 160 },
  { from: 'junc_left_mid', to: 'junc_cen_mid', distance: 160 },
  { from: 'junc_left_bot', to: 'junc_cen_bot', distance: 160 },
  // Concourse ↔ right pier
  { from: 'junc_cen_top', to: 'junc_right_top', distance: 160 },
  { from: 'junc_cen_mid', to: 'junc_right_mid', distance: 160 },
  { from: 'junc_cen_bot', to: 'junc_right_bot', distance: 160 },
  // Amenity connections
  { from: 'lounge_qantas',  to: 'junc_left_top', distance: 35 },
  { from: 'lounge_qantas',  to: 'junc_left_mid', distance: 45 },
  { from: 'cafe_central',   to: 'junc_cen_top',  distance: 35 },
  { from: 'cafe_central',   to: 'junc_cen_mid',  distance: 45 },
  { from: 'restaurant_cen', to: 'junc_cen_top',  distance: 35 },
  { from: 'restaurant_cen', to: 'junc_cen_mid',  distance: 40 },
  { from: 'shop_central',   to: 'junc_cen_mid',  distance: 55 },
  { from: 'shop_central',   to: 'junc_cen_bot',  distance: 40 },
  { from: 'lounge_intl',    to: 'junc_right_top', distance: 35 },
  { from: 'lounge_intl',    to: 'junc_right_mid', distance: 45 },
  { from: 'washroom_left',  to: 'junc_left_mid',  distance: 30 },
  { from: 'washroom_left',  to: 'junc_left_bot',  distance: 35 },
  { from: 'washroom_right', to: 'junc_right_mid', distance: 30 },
  { from: 'washroom_right', to: 'junc_right_bot', distance: 35 },
  { from: 'prayer_room',    to: 'junc_cen_top',   distance: 30 },
  { from: 'security_main',  to: 'junc_cen_bot',   distance: 60 },
  { from: 'entrance_main',  to: 'security_main',  distance: 30 },
];

airports['SYD'] = {
  code: 'SYD',
  name: 'Sydney Kingsford Smith International',
  city: 'Sydney',
  country: 'Australia',
  nodes: sydNodes,
  edges: sydEdges,
  mapViewBox: '0 0 800 490',
  terminals: [
    { id: 'T1L', label: 'Pier A (T1)', x: 45,  y: 35, w: 170, h: 375 },
    { id: 'T1R', label: 'Pier B (T1)', x: 585, y: 35, w: 170, h: 375 },
  ],
  centralArea: { label: 'International Concourse', x: 275, y: 45, w: 250, h: 370 },
};

// ────────────── SXR — Sheikh ul-Alam International (Srinagar) ──────────────
// Single terminal, compact layout
const sxrNodes: NavNode[] = [
  // Gates — left wing
  { id: 'gate_a1', name: 'Gate A1', x: 90,  y: 70,  type: 'gate', terminal: 'T1' },
  { id: 'gate_a2', name: 'Gate A2', x: 90,  y: 150, type: 'gate', terminal: 'T1' },
  { id: 'gate_a3', name: 'Gate A3', x: 90,  y: 230, type: 'gate', terminal: 'T1' },
  { id: 'gate_a4', name: 'Gate A4', x: 90,  y: 310, type: 'gate', terminal: 'T1' },
  { id: 'gate_a5', name: 'Gate A5', x: 90,  y: 380, type: 'gate', terminal: 'T1' },
  // Gates — right wing
  { id: 'gate_b1', name: 'Gate B1', x: 710, y: 70,  type: 'gate', terminal: 'T1' },
  { id: 'gate_b2', name: 'Gate B2', x: 710, y: 150, type: 'gate', terminal: 'T1' },
  { id: 'gate_b3', name: 'Gate B3', x: 710, y: 230, type: 'gate', terminal: 'T1' },
  { id: 'gate_b4', name: 'Gate B4', x: 710, y: 310, type: 'gate', terminal: 'T1' },
  { id: 'gate_b5', name: 'Gate B5', x: 710, y: 380, type: 'gate', terminal: 'T1' },
  // Left corridor junctions
  { id: 'junc_left_top', name: 'Wing A North',   x: 190, y: 100, type: 'junction' },
  { id: 'junc_left_mid', name: 'Wing A Central', x: 190, y: 230, type: 'junction' },
  { id: 'junc_left_bot', name: 'Wing A South',   x: 190, y: 360, type: 'junction' },
  // Central hall junctions
  { id: 'junc_cen_top', name: 'Main Hall North', x: 400, y: 100, type: 'junction' },
  { id: 'junc_cen_mid', name: 'Main Hall',        x: 400, y: 230, type: 'junction' },
  { id: 'junc_cen_bot', name: 'Main Hall South',  x: 400, y: 360, type: 'junction' },
  // Right corridor junctions
  { id: 'junc_right_top', name: 'Wing B North',   x: 610, y: 100, type: 'junction' },
  { id: 'junc_right_mid', name: 'Wing B Central', x: 610, y: 230, type: 'junction' },
  { id: 'junc_right_bot', name: 'Wing B South',   x: 610, y: 360, type: 'junction' },
  // Amenities (compact — smaller airport)
  { id: 'cafe_main',      name: 'Café Kashmir',        x: 310, y: 155, type: 'amenity', amenityType: 'cafe' },
  { id: 'restaurant_main',name: 'Wazwan Restaurant',   x: 490, y: 155, type: 'amenity', amenityType: 'restaurant' },
  { id: 'shop_main',      name: 'Kashmir Crafts Shop', x: 400, y: 310, type: 'amenity', amenityType: 'shop' },
  { id: 'washroom_left',  name: 'Washroom A',          x: 220, y: 310, type: 'amenity', amenityType: 'washroom', terminal: 'T1' },
  { id: 'washroom_right', name: 'Washroom B',          x: 580, y: 310, type: 'amenity', amenityType: 'washroom', terminal: 'T1' },
  { id: 'prayer_room',    name: 'Prayer Room',          x: 400, y: 50,  type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main',  name: 'Security Check',       x: 400, y: 420, type: 'security' },
  { id: 'entrance_main',  name: 'Terminal Entrance',    x: 400, y: 460, type: 'entrance' },
];

const sxrEdges: NavEdge[] = [
  // Left gates → junctions
  { from: 'gate_a1', to: 'junc_left_top', distance: 50 },
  { from: 'gate_a2', to: 'junc_left_top', distance: 45 },
  { from: 'gate_a3', to: 'junc_left_mid', distance: 50 },
  { from: 'gate_a4', to: 'junc_left_bot', distance: 45 },
  { from: 'gate_a5', to: 'junc_left_bot', distance: 50 },
  // Right gates → junctions
  { from: 'gate_b1', to: 'junc_right_top', distance: 50 },
  { from: 'gate_b2', to: 'junc_right_top', distance: 45 },
  { from: 'gate_b3', to: 'junc_right_mid', distance: 50 },
  { from: 'gate_b4', to: 'junc_right_bot', distance: 45 },
  { from: 'gate_b5', to: 'junc_right_bot', distance: 50 },
  // Left corridor
  { from: 'junc_left_top', to: 'junc_left_mid', distance: 90 },
  { from: 'junc_left_mid', to: 'junc_left_bot', distance: 90 },
  // Right corridor
  { from: 'junc_right_top', to: 'junc_right_mid', distance: 90 },
  { from: 'junc_right_mid', to: 'junc_right_bot', distance: 90 },
  // Central hall corridor
  { from: 'junc_cen_top', to: 'junc_cen_mid', distance: 90 },
  { from: 'junc_cen_mid', to: 'junc_cen_bot', distance: 90 },
  // Left ↔ center
  { from: 'junc_left_top', to: 'junc_cen_top', distance: 155 },
  { from: 'junc_left_mid', to: 'junc_cen_mid', distance: 155 },
  { from: 'junc_left_bot', to: 'junc_cen_bot', distance: 155 },
  // Center ↔ right
  { from: 'junc_cen_top', to: 'junc_right_top', distance: 155 },
  { from: 'junc_cen_mid', to: 'junc_right_mid', distance: 155 },
  { from: 'junc_cen_bot', to: 'junc_right_bot', distance: 155 },
  // Amenities
  { from: 'cafe_main',       to: 'junc_cen_top', distance: 40 },
  { from: 'cafe_main',       to: 'junc_cen_mid', distance: 45 },
  { from: 'restaurant_main', to: 'junc_cen_top', distance: 40 },
  { from: 'restaurant_main', to: 'junc_cen_mid', distance: 45 },
  { from: 'shop_main',       to: 'junc_cen_mid', distance: 55 },
  { from: 'shop_main',       to: 'junc_cen_bot', distance: 40 },
  { from: 'washroom_left',   to: 'junc_left_mid', distance: 30 },
  { from: 'washroom_left',   to: 'junc_left_bot', distance: 35 },
  { from: 'washroom_right',  to: 'junc_right_mid', distance: 30 },
  { from: 'washroom_right',  to: 'junc_right_bot', distance: 35 },
  { from: 'prayer_room',     to: 'junc_cen_top',   distance: 40 },
  { from: 'security_main',   to: 'junc_cen_bot',   distance: 50 },
  { from: 'entrance_main',   to: 'security_main',  distance: 30 },
];

airports['SXR'] = {
  code: 'SXR',
  name: 'Sheikh ul-Alam International',
  city: 'Srinagar',
  country: 'India',
  nodes: sxrNodes,
  edges: sxrEdges,
  mapViewBox: '0 0 800 490',
  terminals: [
    { id: 'T1', label: 'Terminal 1', x: 45, y: 35, w: 710, h: 410 },
  ],
  centralArea: { label: 'Main Hall', x: 275, y: 55, w: 250, h: 355 },
};

// ────────────── JNB — O.R. Tambo International (Johannesburg) ──────────────
// Two terminals: Terminal A (domestic) + Terminal B (international)
const jnbNodes: NavNode[] = [
  { id: 'gate_a1', name: 'Gate A1', x: 80,  y: 70,  type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_a2', name: 'Gate A2', x: 80,  y: 145, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_a3', name: 'Gate A3', x: 80,  y: 220, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_a4', name: 'Gate A4', x: 80,  y: 295, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_a5', name: 'Gate A5', x: 80,  y: 365, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_b1', name: 'Gate B1', x: 720, y: 70,  type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_b2', name: 'Gate B2', x: 720, y: 145, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_b3', name: 'Gate B3', x: 720, y: 220, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_b4', name: 'Gate B4', x: 720, y: 295, type: 'gate', terminal: 'T_Intl' },
  { id: 'gate_b5', name: 'Gate B5', x: 720, y: 365, type: 'gate', terminal: 'T_Intl' },
  { id: 'junc_l_top', name: 'A North',     x: 185, y: 90,  type: 'junction' },
  { id: 'junc_l_mid', name: 'A Central',   x: 185, y: 220, type: 'junction' },
  { id: 'junc_l_bot', name: 'A South',     x: 185, y: 350, type: 'junction' },
  { id: 'junc_c_top', name: 'Hub North',   x: 400, y: 90,  type: 'junction' },
  { id: 'junc_c_mid', name: 'Central Hub', x: 400, y: 220, type: 'junction' },
  { id: 'junc_c_bot', name: 'Hub South',   x: 400, y: 350, type: 'junction' },
  { id: 'junc_r_top', name: 'B North',     x: 615, y: 90,  type: 'junction' },
  { id: 'junc_r_mid', name: 'B Central',   x: 615, y: 220, type: 'junction' },
  { id: 'junc_r_bot', name: 'B South',     x: 615, y: 350, type: 'junction' },
  { id: 'lounge_ba',      name: 'BA Lounge',        x: 245, y: 140, type: 'amenity', amenityType: 'lounge' },
  { id: 'cafe_hub',       name: 'Mugg & Bean',      x: 345, y: 150, type: 'amenity', amenityType: 'cafe' },
  { id: 'restaurant_hub', name: 'Ocean Basket',      x: 455, y: 150, type: 'amenity', amenityType: 'restaurant' },
  { id: 'shop_intl',      name: 'ORTIA Duty Free',  x: 400, y: 300, type: 'amenity', amenityType: 'shop' },
  { id: 'washroom_l',     name: 'Washroom A',       x: 210, y: 310, type: 'amenity', amenityType: 'washroom' },
  { id: 'washroom_r',     name: 'Washroom B',       x: 590, y: 310, type: 'amenity', amenityType: 'washroom' },
  { id: 'prayer_room',    name: 'Prayer Room',       x: 400, y: 48,  type: 'amenity', amenityType: 'prayer_room' },
  { id: 'security_main',  name: 'Security / Border', x: 400, y: 420, type: 'security' },
  { id: 'entrance_main',  name: 'Terminal Entrance', x: 400, y: 460, type: 'entrance' },
];
const jnbEdges: NavEdge[] = [
  { from: 'gate_a1', to: 'junc_l_top', distance: 55 },
  { from: 'gate_a2', to: 'junc_l_top', distance: 45 },
  { from: 'gate_a3', to: 'junc_l_mid', distance: 55 },
  { from: 'gate_a4', to: 'junc_l_bot', distance: 45 },
  { from: 'gate_a5', to: 'junc_l_bot', distance: 55 },
  { from: 'gate_b1', to: 'junc_r_top', distance: 55 },
  { from: 'gate_b2', to: 'junc_r_top', distance: 45 },
  { from: 'gate_b3', to: 'junc_r_mid', distance: 55 },
  { from: 'gate_b4', to: 'junc_r_bot', distance: 45 },
  { from: 'gate_b5', to: 'junc_r_bot', distance: 55 },
  { from: 'junc_l_top', to: 'junc_l_mid', distance: 90 },
  { from: 'junc_l_mid', to: 'junc_l_bot', distance: 90 },
  { from: 'junc_r_top', to: 'junc_r_mid', distance: 90 },
  { from: 'junc_r_mid', to: 'junc_r_bot', distance: 90 },
  { from: 'junc_c_top', to: 'junc_c_mid', distance: 90 },
  { from: 'junc_c_mid', to: 'junc_c_bot', distance: 90 },
  { from: 'junc_l_top', to: 'junc_c_top', distance: 165 },
  { from: 'junc_l_mid', to: 'junc_c_mid', distance: 165 },
  { from: 'junc_l_bot', to: 'junc_c_bot', distance: 165 },
  { from: 'junc_c_top', to: 'junc_r_top', distance: 165 },
  { from: 'junc_c_mid', to: 'junc_r_mid', distance: 165 },
  { from: 'junc_c_bot', to: 'junc_r_bot', distance: 165 },
  { from: 'lounge_ba',      to: 'junc_l_top', distance: 35 },
  { from: 'lounge_ba',      to: 'junc_l_mid', distance: 45 },
  { from: 'cafe_hub',       to: 'junc_c_top', distance: 40 },
  { from: 'cafe_hub',       to: 'junc_c_mid', distance: 45 },
  { from: 'restaurant_hub', to: 'junc_c_top', distance: 40 },
  { from: 'restaurant_hub', to: 'junc_c_mid', distance: 40 },
  { from: 'shop_intl',      to: 'junc_c_mid', distance: 55 },
  { from: 'shop_intl',      to: 'junc_c_bot', distance: 40 },
  { from: 'washroom_l',     to: 'junc_l_mid', distance: 30 },
  { from: 'washroom_l',     to: 'junc_l_bot', distance: 35 },
  { from: 'washroom_r',     to: 'junc_r_mid', distance: 30 },
  { from: 'washroom_r',     to: 'junc_r_bot', distance: 35 },
  { from: 'prayer_room',    to: 'junc_c_top', distance: 35 },
  { from: 'security_main',  to: 'junc_c_bot', distance: 55 },
  { from: 'entrance_main',  to: 'security_main', distance: 30 },
];
airports['JNB'] = {
  code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa',
  nodes: jnbNodes, edges: jnbEdges, mapViewBox: '0 0 800 490',
  terminals: [
    { id: 'T_Intl_L', label: 'International A', x: 45,  y: 35, w: 170, h: 390 },
    { id: 'T_Intl_R', label: 'International B', x: 585, y: 35, w: 170, h: 390 },
  ],
  centralArea: { label: 'Central Hub', x: 275, y: 45, w: 250, h: 375 },
};

// ────────────── KUL — Kuala Lumpur International ──────────────
const kulNodes: NavNode[] = [
  // Main Terminal gates (left wing)
  { id: 'gate_a1', name: 'Gate A1', x: 75,  y: 70,  type: 'gate', terminal: 'Main' },
  { id: 'gate_a2', name: 'Gate A2', x: 75,  y: 150, type: 'gate', terminal: 'Main' },
  { id: 'gate_a3', name: 'Gate A3', x: 75,  y: 230, type: 'gate', terminal: 'Main' },
  { id: 'gate_a4', name: 'Gate A4', x: 75,  y: 310, type: 'gate', terminal: 'Main' },
  // Satellite gates (right wing)
  { id: 'gate_b1', name: 'Gate B1', x: 725, y: 70,  type: 'gate', terminal: 'Satellite' },
  { id: 'gate_b2', name: 'Gate B2', x: 725, y: 150, type: 'gate', terminal: 'Satellite' },
  { id: 'gate_b3', name: 'Gate B3', x: 725, y: 230, type: 'gate', terminal: 'Satellite' },
  { id: 'gate_b4', name: 'Gate B4', x: 725, y: 310, type: 'gate', terminal: 'Satellite' },
  // Junctions
  { id: 'junc_main_top',  name: 'Main North',      x: 200, y: 90,  type: 'junction' },
  { id: 'junc_main_mid',  name: 'Main Central',     x: 200, y: 190, type: 'junction' },
  { id: 'junc_main_bot',  name: 'Main South',       x: 200, y: 300, type: 'junction' },
  { id: 'junc_apm_west',  name: 'APM West',         x: 350, y: 190, type: 'junction' },
  { id: 'junc_apm_east',  name: 'APM East',         x: 550, y: 190, type: 'junction' },
  { id: 'junc_sat_top',   name: 'Satellite North',  x: 600, y: 90,  type: 'junction' },
  { id: 'junc_sat_mid',   name: 'Satellite Central',x: 600, y: 190, type: 'junction' },
  { id: 'junc_sat_bot',   name: 'Satellite South',  x: 600, y: 300, type: 'junction' },
  // Amenities
  { id: 'lounge_main',     name: 'Malaysia Airlines Golden Lounge', x: 240, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'Main' },
  { id: 'cafe_main',       name: 'Old Town White Coffee',           x: 340, y: 110, type: 'amenity', amenityType: 'cafe'                          },
  { id: 'restaurant_main', name: 'Brahim\'s Malaysian Kitchen',     x: 440, y: 110, type: 'amenity', amenityType: 'restaurant'                    },
  { id: 'shop_main',       name: 'Eraman Duty Free',                x: 390, y: 290, type: 'amenity', amenityType: 'shop'                          },
  { id: 'washroom_main',   name: 'Washroom Main',                   x: 240, y: 270, type: 'amenity', amenityType: 'washroom',   terminal: 'Main' },
  { id: 'washroom_sat',    name: 'Washroom Satellite',              x: 560, y: 270, type: 'amenity', amenityType: 'washroom',   terminal: 'Satellite' },
  { id: 'prayer_room',     name: 'Surau Prayer Room',               x: 390, y: 50,  type: 'amenity', amenityType: 'prayer_room'                   },
  { id: 'security_main',   name: 'Security Check',                  x: 390, y: 390, type: 'security'  },
  { id: 'entrance_main',   name: 'Main Entrance',                   x: 390, y: 440, type: 'entrance'  },
];

const kulEdges: NavEdge[] = [
  // Main terminal left wing
  { from: 'gate_a1', to: 'junc_main_top', distance: 60 },
  { from: 'gate_a2', to: 'junc_main_top', distance: 50 },
  { from: 'gate_a3', to: 'junc_main_mid', distance: 55 },
  { from: 'gate_a4', to: 'junc_main_bot', distance: 60 },
  { from: 'junc_main_top', to: 'junc_main_mid', distance: 80 },
  { from: 'junc_main_mid', to: 'junc_main_bot', distance: 80 },
  // Main to APM (Aerotrain people mover)
  { from: 'junc_main_mid', to: 'junc_apm_west',  distance: 120 },
  { from: 'junc_main_top', to: 'junc_apm_west',  distance: 140 },
  // APM tunnel (60m equivalent walk time for train journey)
  { from: 'junc_apm_west', to: 'junc_apm_east',  distance: 200 },
  // APM to satellite
  { from: 'junc_apm_east', to: 'junc_sat_mid',   distance: 120 },
  { from: 'junc_apm_east', to: 'junc_sat_top',   distance: 140 },
  // Satellite right wing
  { from: 'junc_sat_top', to: 'junc_sat_mid',    distance: 80 },
  { from: 'junc_sat_mid', to: 'junc_sat_bot',    distance: 80 },
  { from: 'gate_b1', to: 'junc_sat_top',         distance: 60 },
  { from: 'gate_b2', to: 'junc_sat_top',         distance: 50 },
  { from: 'gate_b3', to: 'junc_sat_mid',         distance: 55 },
  { from: 'gate_b4', to: 'junc_sat_bot',         distance: 60 },
  // Amenity connections
  { from: 'lounge_main',     to: 'junc_main_top',  distance: 30 },
  { from: 'cafe_main',       to: 'junc_apm_west',  distance: 25 },
  { from: 'restaurant_main', to: 'junc_apm_west',  distance: 30 },
  { from: 'shop_main',       to: 'junc_apm_west',  distance: 35 },
  { from: 'washroom_main',   to: 'junc_main_mid',  distance: 25 },
  { from: 'washroom_sat',    to: 'junc_sat_mid',   distance: 25 },
  { from: 'prayer_room',     to: 'junc_apm_west',  distance: 40 },
  { from: 'security_main',   to: 'junc_main_bot',  distance: 50 },
  { from: 'entrance_main',   to: 'security_main',  distance: 40 },
];

airports['KUL'] = {
  code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia',
  nodes: kulNodes, edges: kulEdges, mapViewBox: '0 0 800 470',
  terminals: [
    { id: 'Main',      label: 'Main Terminal',      x: 40,  y: 35, w: 210, h: 380 },
    { id: 'Satellite', label: 'Satellite Terminal',  x: 555, y: 35, w: 210, h: 380 },
  ],
  centralArea: { label: 'APM Aerotrain Link', x: 305, y: 130, w: 195, h: 130 },
};

// ────────────── ZRH — Zurich Airport (accurate layout) ──────────────
// Real layout: H-shape — Airside Centre spine, Pier A (left, Schengen only),
// Pier B/D (right, both Schengen B + non-Schengen D), Dock E (midfield satellite via Skymetro)
const zrhNodes: NavNode[] = [
  // ── Pier A gates (Schengen, left finger) ──
  { id: 'gate_a1', name: 'Gate A1', x: 70,  y: 60,  type: 'gate', terminal: 'Pier A' },
  { id: 'gate_a2', name: 'Gate A2', x: 70,  y: 130, type: 'gate', terminal: 'Pier A' },
  { id: 'gate_a3', name: 'Gate A3', x: 70,  y: 200, type: 'gate', terminal: 'Pier A' },
  { id: 'gate_a4', name: 'Gate A4', x: 70,  y: 270, type: 'gate', terminal: 'Pier A' },
  { id: 'gate_a5', name: 'Gate A5', x: 70,  y: 340, type: 'gate', terminal: 'Pier A' },
  // ── Pier B/D gates (right finger — B=Schengen, D=non-Schengen) ──
  { id: 'gate_b1', name: 'Gate B1/D1', x: 730, y: 60,  type: 'gate', terminal: 'Pier B' },
  { id: 'gate_b2', name: 'Gate B2/D2', x: 730, y: 140, type: 'gate', terminal: 'Pier B' },
  { id: 'gate_b3', name: 'Gate B3/D3', x: 730, y: 220, type: 'gate', terminal: 'Pier B' },
  { id: 'gate_b4', name: 'Gate B4/D4', x: 730, y: 300, type: 'gate', terminal: 'Pier B' },
  // ── Dock E gates (midfield satellite — non-Schengen intercontinental) ──
  { id: 'gate_e1', name: 'Gate E1', x: 270, y: 440, type: 'gate', terminal: 'Dock E' },
  { id: 'gate_e2', name: 'Gate E2', x: 370, y: 440, type: 'gate', terminal: 'Dock E' },
  { id: 'gate_e3', name: 'Gate E3', x: 470, y: 440, type: 'gate', terminal: 'Dock E' },
  { id: 'gate_e4', name: 'Gate E4', x: 570, y: 440, type: 'gate', terminal: 'Dock E' },
  // ── Junctions ──
  { id: 'junc_a_top',      name: 'Pier A North',      x: 185, y: 80,  type: 'junction' },
  { id: 'junc_a_mid',      name: 'Pier A Central',    x: 185, y: 195, type: 'junction' },
  { id: 'junc_a_bot',      name: 'Pier A South',      x: 185, y: 310, type: 'junction' },
  { id: 'junc_airside_n',  name: 'Airside Centre N',  x: 400, y: 110, type: 'junction' },
  { id: 'junc_airside_c',  name: 'Airside Centre',    x: 400, y: 200, type: 'junction' },
  { id: 'junc_airside_s',  name: 'Airside Centre S',  x: 400, y: 310, type: 'junction' },
  { id: 'junc_skymetro',   name: 'Skymetro Station',  x: 400, y: 380, type: 'junction' },
  { id: 'junc_docke_plat', name: 'Dock E Platform',   x: 400, y: 440, type: 'junction' },
  { id: 'junc_b_top',      name: 'Pier B North',      x: 615, y: 80,  type: 'junction' },
  { id: 'junc_b_mid',      name: 'Pier B Central',    x: 615, y: 195, type: 'junction' },
  { id: 'junc_b_bot',      name: 'Pier B South',      x: 615, y: 310, type: 'junction' },
  // ── Amenities ──
  { id: 'lounge_swiss',    name: 'SWISS Lounge (Pier A)',    x: 200, y: 130, type: 'amenity', amenityType: 'lounge',      terminal: 'Pier A' },
  { id: 'lounge_aspire',   name: 'Aspire Lounge (Dock E)',  x: 490, y: 440, type: 'amenity', amenityType: 'lounge',      terminal: 'Dock E' },
  { id: 'cafe_sprungli',   name: 'Confiserie Sprüngli',     x: 360, y: 155, type: 'amenity', amenityType: 'cafe'                              },
  { id: 'restaurant_pier', name: 'Au Premier Brasserie',    x: 440, y: 155, type: 'amenity', amenityType: 'restaurant'                        },
  { id: 'shop_zrh',        name: 'Heinemann Duty Free',     x: 400, y: 260, type: 'amenity', amenityType: 'shop'                              },
  { id: 'washroom_a',      name: 'Washroom Pier A',         x: 200, y: 275, type: 'amenity', amenityType: 'washroom',   terminal: 'Pier A'   },
  { id: 'washroom_b',      name: 'Washroom Pier B',         x: 600, y: 275, type: 'amenity', amenityType: 'washroom',   terminal: 'Pier B'   },
  { id: 'washroom_e',      name: 'Washroom Dock E',         x: 310, y: 440, type: 'amenity', amenityType: 'washroom',   terminal: 'Dock E'   },
  { id: 'prayer_room',     name: 'Meditation Room',         x: 400, y: 60,  type: 'amenity', amenityType: 'prayer_room'                       },
  { id: 'security_main',   name: 'Security Check Building', x: 400, y: 490, type: 'security' },
  { id: 'entrance_main',   name: 'Airport Centre',          x: 400, y: 540, type: 'entrance' },
];

const zrhEdges: NavEdge[] = [
  // Pier A finger connections
  { from: 'gate_a1', to: 'junc_a_top',     distance: 55 },
  { from: 'gate_a2', to: 'junc_a_top',     distance: 45 },
  { from: 'gate_a3', to: 'junc_a_mid',     distance: 50 },
  { from: 'gate_a4', to: 'junc_a_bot',     distance: 50 },
  { from: 'gate_a5', to: 'junc_a_bot',     distance: 55 },
  { from: 'junc_a_top', to: 'junc_a_mid',  distance: 90 },
  { from: 'junc_a_mid', to: 'junc_a_bot',  distance: 90 },
  // Pier A to Airside Centre (left crossbar)
  { from: 'junc_a_top', to: 'junc_airside_n', distance: 160 },
  { from: 'junc_a_mid', to: 'junc_airside_c', distance: 160 },
  { from: 'junc_a_bot', to: 'junc_airside_s', distance: 160 },
  // Airside Centre spine
  { from: 'junc_airside_n', to: 'junc_airside_c', distance: 80 },
  { from: 'junc_airside_c', to: 'junc_airside_s', distance: 90 },
  { from: 'junc_airside_s', to: 'junc_skymetro',  distance: 60 },
  // Skymetro to Dock E (automated people mover — fast, ~3 min)
  { from: 'junc_skymetro',   to: 'junc_docke_plat', distance: 150 },
  // Dock E platform to gates
  { from: 'junc_docke_plat', to: 'gate_e1',  distance: 70 },
  { from: 'junc_docke_plat', to: 'gate_e2',  distance: 40 },
  { from: 'junc_docke_plat', to: 'gate_e3',  distance: 40 },
  { from: 'junc_docke_plat', to: 'gate_e4',  distance: 70 },
  // Airside Centre to Pier B (right crossbar)
  { from: 'junc_airside_n', to: 'junc_b_top', distance: 160 },
  { from: 'junc_airside_c', to: 'junc_b_mid', distance: 160 },
  { from: 'junc_airside_s', to: 'junc_b_bot', distance: 160 },
  // Pier B finger connections
  { from: 'junc_b_top', to: 'junc_b_mid',  distance: 90 },
  { from: 'junc_b_mid', to: 'junc_b_bot',  distance: 90 },
  { from: 'gate_b1', to: 'junc_b_top',     distance: 55 },
  { from: 'gate_b2', to: 'junc_b_top',     distance: 45 },
  { from: 'gate_b3', to: 'junc_b_mid',     distance: 50 },
  { from: 'gate_b4', to: 'junc_b_bot',     distance: 55 },
  // Amenity edges
  { from: 'lounge_swiss',    to: 'junc_a_top',     distance: 25 },
  { from: 'lounge_aspire',   to: 'junc_docke_plat',distance: 30 },
  { from: 'cafe_sprungli',   to: 'junc_airside_n', distance: 25 },
  { from: 'restaurant_pier', to: 'junc_airside_n', distance: 25 },
  { from: 'shop_zrh',        to: 'junc_airside_c', distance: 30 },
  { from: 'washroom_a',      to: 'junc_a_mid',     distance: 20 },
  { from: 'washroom_b',      to: 'junc_b_mid',     distance: 20 },
  { from: 'washroom_e',      to: 'junc_docke_plat',distance: 25 },
  { from: 'prayer_room',     to: 'junc_airside_n', distance: 45 },
  { from: 'security_main',   to: 'junc_airside_s', distance: 55 },
  { from: 'entrance_main',   to: 'security_main',  distance: 45 },
];

airports['ZRH'] = {
  code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland',
  nodes: zrhNodes, edges: zrhEdges, mapViewBox: '0 0 800 570',
  terminals: [
    { id: 'Pier A', label: 'Pier A — Schengen',        x: 40,  y: 40,  w: 195, h: 330 },
    { id: 'Pier B', label: 'Pier B/D — Intl',          x: 565, y: 40,  w: 195, h: 330 },
    { id: 'Dock E', label: 'Dock E — Intercontinental', x: 220, y: 410, w: 360, h: 70  },
  ],
  centralArea: { label: 'Airside Centre + Skymetro', x: 310, y: 90, w: 180, h: 310 },
};

// ────────────── LAX — Los Angeles International (accurate U-shape) ──────────────
// Real layout: U-shaped horseshoe — TBIT (Terminal B) at bottom with gates 101-225,
// North arm (T1-3) on left, South arm (T4-8) on right, all connected airside T4→T8
// TBIT connects to T3 & T4 via skybridges. T1-3 requires shuttle/re-screen to TBIT.
// United Airlines operates T7 (gates 70-88) — airside tunnel to TBIT via T4-T6-T7.
const laxNodes: NavNode[] = [
  // ── TBIT (Terminal B) gates — international ──
  { id: 'gate_a1', name: 'Gate 101', x: 150, y: 470, type: 'gate', terminal: 'TBIT' },
  { id: 'gate_a2', name: 'Gate 121', x: 280, y: 470, type: 'gate', terminal: 'TBIT' },
  { id: 'gate_a3', name: 'Gate 141', x: 400, y: 470, type: 'gate', terminal: 'TBIT' },
  { id: 'gate_a4', name: 'Gate 161', x: 520, y: 470, type: 'gate', terminal: 'TBIT' },
  { id: 'gate_a5', name: 'Gate 201', x: 650, y: 470, type: 'gate', terminal: 'TBIT' },
  // ── Terminal 7 gates — United domestic ──
  { id: 'gate_b1', name: 'Gate 70',  x: 730, y: 80,  type: 'gate', terminal: 'T7' },
  { id: 'gate_b2', name: 'Gate 74',  x: 730, y: 160, type: 'gate', terminal: 'T7' },
  { id: 'gate_b3', name: 'Gate 78',  x: 730, y: 240, type: 'gate', terminal: 'T7' },
  { id: 'gate_b4', name: 'Gate 86',  x: 730, y: 320, type: 'gate', terminal: 'T7' },
  // ── Junctions ──
  // TBIT Great Hall (bottom)
  { id: 'junc_tbit_w',   name: 'TBIT West Hall',    x: 160, y: 400, type: 'junction' },
  { id: 'junc_tbit_c',   name: 'TBIT Great Hall',   x: 400, y: 400, type: 'junction' },
  { id: 'junc_tbit_e',   name: 'TBIT East Hall',    x: 650, y: 400, type: 'junction' },
  // South arm tunnel (T4→T5→T6→T7→T8) — airside no re-screening
  { id: 'junc_t4',       name: 'Terminal 4',        x: 730, y: 395, type: 'junction' },
  { id: 'junc_t6',       name: 'Terminal 6',        x: 730, y: 295, type: 'junction' },
  { id: 'junc_t7_bot',   name: 'T7 South',          x: 650, y: 195, type: 'junction' },
  { id: 'junc_t7_top',   name: 'T7 North',          x: 650, y: 90,  type: 'junction' },
  // Skybridge: TBIT East ↔ T4 (no re-screen)
  { id: 'junc_bridge_e', name: 'Skybridge T4-TBIT', x: 730, y: 400, type: 'junction' },
  // ── Amenities ──
  { id: 'lounge_polaris', name: 'United Polaris Lounge',   x: 700, y: 150, type: 'amenity', amenityType: 'lounge',     terminal: 'T7'   },
  { id: 'lounge_star',    name: 'Star Alliance Lounge',    x: 200, y: 400, type: 'amenity', amenityType: 'lounge',     terminal: 'TBIT' },
  { id: 'cafe_urth',      name: 'Urth Caffé',              x: 320, y: 400, type: 'amenity', amenityType: 'cafe'                         },
  { id: 'restaurant_roku',name: 'Sushi Roku',              x: 470, y: 400, type: 'amenity', amenityType: 'restaurant'                   },
  { id: 'shop_dfs',       name: 'DFS Duty Free',           x: 400, y: 455, type: 'amenity', amenityType: 'shop'                         },
  { id: 'washroom_tbit',  name: 'Washroom TBIT',           x: 550, y: 400, type: 'amenity', amenityType: 'washroom',  terminal: 'TBIT' },
  { id: 'washroom_t7',    name: 'Washroom T7',             x: 655, y: 240, type: 'amenity', amenityType: 'washroom',  terminal: 'T7'   },
  { id: 'chapel',         name: 'Interfaith Chapel',       x: 400, y: 350, type: 'amenity', amenityType: 'prayer_room'                  },
  { id: 'security_tbit',  name: 'TBIT Security',           x: 400, y: 530, type: 'security' },
  { id: 'entrance_main',  name: 'TBIT Arrivals',           x: 400, y: 580, type: 'entrance' },
];

const laxEdges: NavEdge[] = [
  // TBIT gate connections (along bottom)
  { from: 'gate_a1', to: 'junc_tbit_w', distance: 80  },
  { from: 'gate_a2', to: 'junc_tbit_w', distance: 60  },
  { from: 'gate_a3', to: 'junc_tbit_c', distance: 50  },
  { from: 'gate_a4', to: 'junc_tbit_e', distance: 60  },
  { from: 'gate_a5', to: 'junc_tbit_e', distance: 50  },
  { from: 'junc_tbit_w', to: 'junc_tbit_c', distance: 200 },
  { from: 'junc_tbit_c', to: 'junc_tbit_e', distance: 210 },
  // Skybridge TBIT East → T4 (airside, no re-screen)
  { from: 'junc_tbit_e', to: 'junc_bridge_e', distance: 30  },
  { from: 'junc_bridge_e', to: 'junc_t4',     distance: 30  },
  // South arm airside tunnel: T4 → T6 → T7
  { from: 'junc_t4',  to: 'junc_t6',          distance: 250 },
  { from: 'junc_t6',  to: 'junc_t7_bot',      distance: 180 },
  // T7 corridor (south → north)
  { from: 'junc_t7_bot', to: 'junc_t7_top',   distance: 120 },
  // T7 gate connections
  { from: 'gate_b1', to: 'junc_t7_top',        distance: 60  },
  { from: 'gate_b2', to: 'junc_t7_top',        distance: 55  },
  { from: 'gate_b3', to: 'junc_t7_bot',        distance: 60  },
  { from: 'gate_b4', to: 'junc_t7_bot',        distance: 65  },
  // Amenity edges
  { from: 'lounge_polaris', to: 'junc_t7_top',  distance: 30  },
  { from: 'lounge_star',    to: 'junc_tbit_w',  distance: 25  },
  { from: 'cafe_urth',      to: 'junc_tbit_c',  distance: 30  },
  { from: 'restaurant_roku',to: 'junc_tbit_c',  distance: 30  },
  { from: 'shop_dfs',       to: 'junc_tbit_c',  distance: 40  },
  { from: 'washroom_tbit',  to: 'junc_tbit_e',  distance: 20  },
  { from: 'washroom_t7',    to: 'junc_t7_bot',  distance: 20  },
  { from: 'chapel',         to: 'junc_tbit_c',  distance: 45  },
  { from: 'security_tbit',  to: 'junc_tbit_c',  distance: 60  },
  { from: 'entrance_main',  to: 'security_tbit',distance: 40  },
];

airports['LAX'] = {
  code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States',
  nodes: laxNodes, edges: laxEdges, mapViewBox: '0 0 800 610',
  terminals: [
    { id: 'TBIT', label: 'TBIT — International (Gates 101-225)', x: 80,  y: 370, w: 640, h: 110 },
    { id: 'T7',   label: 'Terminal 7 — United (Gates 70-88)',    x: 600, y: 50,  w: 165, h: 310 },
  ],
  centralArea: { label: 'Airside Tunnel T4→T7→TBIT', x: 640, y: 370, w: 100, h: 35 },
};

export function getAirport(code: string): AirportConfig {
  return airports[code] || airports['DEL'];
}

// Map gate names to node IDs (works for any airport since gates use same naming)
export function gateToNodeId(gate: string): string | null {
  const gateMap: Record<string, string> = {
    'A1': 'gate_a1', 'A2': 'gate_a2', 'A3': 'gate_a3', 'A4': 'gate_a4', 'A5': 'gate_a5',
    'B1': 'gate_b1', 'B2': 'gate_b2', 'B3': 'gate_b3', 'B4': 'gate_b4', 'B5': 'gate_b5',
  };
  return gateMap[gate] || null;
}
