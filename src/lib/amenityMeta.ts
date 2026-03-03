// Static rating + busyness metadata keyed by amenity node id pattern or name fragment
// Used across all airports — matches by amenityType if no exact match

export interface AmenityMeta {
  rating: number;        // 1.0–5.0
  busyness: 'low' | 'medium' | 'high';
  openHours: string;
}

// Exact node-id overrides
const byId: Record<string, AmenityMeta> = {
  // DXB
  lounge_a:          { rating: 4.8, busyness: 'low',    openHours: '24h' },
  cafe_hub:          { rating: 4.2, busyness: 'medium', openHours: '05:00-23:00' },
  shop_hub:          { rating: 4.5, busyness: 'low',    openHours: '24h' },
  restaurant_hub:    { rating: 4.6, busyness: 'medium', openHours: '06:00-23:00' },
  prayer_room:       { rating: 4.9, busyness: 'low',    openHours: '24h' },
  // LHR
  lounge_5a:         { rating: 4.7, busyness: 'medium', openHours: '05:30-22:30' },
  cafe_transit:      { rating: 4.1, busyness: 'high',   openHours: '05:00-22:00' },
  shop_transit:      { rating: 4.3, busyness: 'medium', openHours: '05:00-22:00' },
  restaurant_5a:     { rating: 4.8, busyness: 'low',    openHours: '06:00-22:00' },
  // DEL
  lounge_central:    { rating: 4.3, busyness: 'medium', openHours: '24h' },
  cafe_central:      { rating: 4.0, busyness: 'high',   openHours: '05:00-23:00' },
  restaurant_central:{ rating: 4.2, busyness: 'medium', openHours: '06:00-23:00' },
  // BOM
  lounge_main:       { rating: 4.4, busyness: 'low',    openHours: '24h' },
  // JFK
  lounge_t7:         { rating: 4.6, busyness: 'low',    openHours: '05:00-23:00' },
  lounge_t4:         { rating: 4.5, busyness: 'medium', openHours: '05:00-23:00' },
  // JNB
  lounge_ba:         { rating: 4.6, busyness: 'low',    openHours: '24h' },
  cafe_hub_jnb:      { rating: 4.0, busyness: 'medium', openHours: '05:00-22:00' },
  // KUL
  lounge_main:       { rating: 4.5, busyness: 'low',    openHours: '24h' },
  cafe_main:         { rating: 4.3, busyness: 'high',   openHours: '05:00-23:00' },
  restaurant_main:   { rating: 4.4, busyness: 'medium', openHours: '06:00-22:00' },
  // ZRH
  lounge_swiss:      { rating: 4.8, busyness: 'low',    openHours: '05:00-22:00' },
  lounge_aspire:     { rating: 4.5, busyness: 'low',    openHours: '05:00-22:00' },
  cafe_sprungli:     { rating: 4.9, busyness: 'high',   openHours: '06:00-21:00' },
  restaurant_pier:   { rating: 4.6, busyness: 'medium', openHours: '06:00-22:00' },
  shop_zrh:          { rating: 4.4, busyness: 'medium', openHours: '05:30-22:00' },
  // LAX
  lounge_polaris:    { rating: 4.9, busyness: 'low',    openHours: '05:00-23:00' },
  lounge_star:       { rating: 4.6, busyness: 'medium', openHours: '05:00-23:00' },
  cafe_urth:         { rating: 4.5, busyness: 'high',   openHours: '05:00-23:00' },
  restaurant_roku:   { rating: 4.7, busyness: 'medium', openHours: '06:00-22:00' },
  shop_dfs:          { rating: 4.3, busyness: 'medium', openHours: '05:00-23:00' },
};

// Fallback defaults by amenityType
const byType: Record<string, AmenityMeta> = {
  lounge:      { rating: 4.5, busyness: 'low',    openHours: '05:00-23:00' },
  cafe:        { rating: 4.0, busyness: 'medium', openHours: '05:00-22:00' },
  restaurant:  { rating: 4.2, busyness: 'medium', openHours: '06:00-22:00' },
  shop:        { rating: 4.1, busyness: 'medium', openHours: '06:00-22:00' },
  washroom:    { rating: 4.3, busyness: 'low',    openHours: '24h' },
  prayer_room: { rating: 4.9, busyness: 'low',    openHours: '24h' },
};

export function getAmenityMeta(nodeId: string, amenityType?: string): AmenityMeta {
  return byId[nodeId] ?? byType[amenityType ?? ''] ?? { rating: 4.0, busyness: 'low', openHours: '24h' };
}
