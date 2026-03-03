import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plane, MapPin, Navigation, Clock, LayoutDashboard, Route, Sparkles, ArrowRight, AlertTriangle, Home } from 'lucide-react';
import TwoFlightSearch from '@/components/TwoFlightSearch';
import JourneySummary from '@/components/JourneySummary';
import LayoverDashboard from '@/components/LayoverDashboard';
import AirportMap from '@/components/AirportMap';
import AmenitySelector, { NavMode } from '@/components/AmenitySelector';
import LayoverPanel from '@/components/LayoverPanel';
import GateChangeAlert from '@/components/GateChangeAlert';
import { FlightInfo, NavNode, PathResult, LayoverJourney } from '@/lib/types';
import { lookupFlight, pollFlightUpdate, optimizeLayover, buildLayoverJourney, lookupFlightPair } from '@/lib/flightService';
import { getAirport, gateToNodeId } from '@/lib/airportData';
import { buildGraph, dijkstra } from '@/lib/navigation';
import { getAmenityMeta } from '@/lib/amenityMeta';

// 6 tabs after journey starts. 'search' is pre-journey landing page.
type Tab = 'home' | 'journey' | 'layover' | 'navigate' | 'map' | 'ai-tips';
type AppView = 'search' | Tab;

// ── AI Tips standalone screen ─────────────────────────────────────
interface AISuggestion { icon: string; title: string; detail: string; urgency: 'low' | 'medium' | 'high' }
const urgencyStyle: Record<string, string> = {
  high: 'border-l-destructive bg-destructive/5',
  medium: 'border-l-warning bg-warning/5',
  low: 'border-l-success bg-success/5',
};
const emojiIcon: Record<string, string> = {
  plane: '✈️', coffee: '☕', shop: '🛍️', food: '🍽️', washroom: '🚻', relax: '🛋️', sparkles: '✨', wifi: '📶',
};

// ── Deterministic AI suggestion engine (no API needed) ────────────
function buildSuggestions(
  freeMin: number,
  amenities: { id: string; type: string; name: string; amenityType?: string }[],
  journey: LayoverJourney,
  depTime: string,
): AISuggestion[] {
  const find = (type: string) => amenities.find(a => a.amenityType === type);
  const lounge = find('lounge'); const cafe = find('cafe');
  const restaurant = find('restaurant'); const shop = find('shop');
  const washroom = find('washroom'); const prayer = find('prayer_room');
  const gate = journey.flight2.departureGate;
  const intl = journey.isInternationalTransfer;

  if (freeMin < 10) return [
    { icon: 'plane',    title: `Head to Gate ${gate} immediately`, detail: `Only ${freeMin} min left — go directly to your departure gate now, boarding may already be open.`, urgency: 'high' },
    { icon: 'washroom', title: 'Quick stop if on the way', detail: washroom ? `${washroom.name} is nearby — only stop if it's directly en route to Gate ${gate}.` : 'Use the nearest washroom only if directly en route to your gate.', urgency: 'high' },
    { icon: 'plane',    title: 'Check gate display boards', detail: `Look for Gate ${gate} on departure screens and follow the fastest corridor — don't stop.`, urgency: 'high' },
  ];

  if (freeMin < 25) return [
    { icon: 'washroom', title: washroom ? `Freshen up at ${washroom.name}` : 'Visit the washroom now', detail: `You have ${freeMin} min — a quick freshen-up before boarding is smart, then head straight to Gate ${gate}.`, urgency: 'high' },
    { icon: 'coffee',   title: cafe ? `Grab water at ${cafe.name}` : 'Pick up a drink quickly', detail: `${cafe?.name ?? 'The nearest café'} has quick service — grab water or a snack to take to the gate.`, urgency: 'high' },
    { icon: 'plane',    title: `Leave for Gate ${gate} by ${depTime}`, detail: `Don't wander — stay within the ${gate} gate zone. ${intl ? 'You cleared immigration, so just follow airside signs.' : ''}`, urgency: 'high' },
    { icon: 'sparkles', title: intl ? 'Confirm duty-free receipt' : 'Double-check boarding pass', detail: `Make sure your boarding pass is ready and your carry-on is under the size limit before joining the queue.`, urgency: 'high' },
  ];

  if (freeMin < 50) return [
    { icon: 'coffee',   title: cafe ? `Coffee at ${cafe.name}` : 'Grab a coffee en route', detail: `${freeMin} min is comfortable for a relaxed drink — ${cafe?.name ?? 'the café'} is quick service, so you'll be back well before boarding.`, urgency: 'medium' },
    { icon: 'washroom', title: washroom ? `Freshen up at ${washroom.name}` : 'Freshen up', detail: `A quick washroom stop mid-route keeps you comfortable for the next leg. Allow 5 min.`, urgency: 'medium' },
    { icon: 'shop',     title: shop ? `Browse ${shop.name} briefly` : 'Check the duty-free briefly', detail: `${shop?.name ?? 'Duty free'} is worth a quick pass-through — set a 10-min timer so you don't lose track of time.`, urgency: 'medium' },
    { icon: 'plane',    title: `Gate ${gate} by ${depTime}`, detail: `Head back with 15 min to spare. ${intl ? 'Your bag should already be through security.' : 'Boarding usually starts 20–25 min before departure.'}`, urgency: 'medium' },
  ];

  return [
    { icon: 'relax',  title: lounge ? `Unwind at ${lounge.name}` : 'Visit the departure lounge', detail: `${freeMin} min gives you a proper break — ${lounge?.name ?? 'the lounge'} offers seating, Wi-Fi and refreshments. Perfect after a long flight.`, urgency: 'low' },
    { icon: 'food',   title: restaurant ? `Dine at ${restaurant.name}` : 'Sit down for a proper meal', detail: `${restaurant?.name ?? 'A full-service restaurant'} means a proper sit-down meal — you have time to eat well before Gate ${gate}.`, urgency: 'low' },
    { icon: 'shop',   title: shop ? `Explore ${shop.name}` : 'Browse duty-free at your pace', detail: `${shop?.name ?? 'The duty-free'} is worth a leisurely look. ${intl ? 'Airside shops often have deals not available landside.' : ''}`, urgency: 'low' },
    { icon: 'coffee', title: cafe ? `Coffee + Wi-Fi at ${cafe.name}` : 'Grab a coffee and relax', detail: `${cafe?.name ?? 'The café'} is a great spot to check messages, stretch out and recharge before boarding.`, urgency: 'low' },
  ];
}

function AITipsScreen({ freeMin, airport, journey }: { freeMin: number; airport: { name: string; nodes: { id: string; type: string; name: string; amenityType?: string }[] }; journey: LayoverJourney }) {
  const amenities = airport.nodes.filter(n => n.type === 'amenity');
  const depTime = new Date(journey.flight2.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const suggestions = useMemo(() => buildSuggestions(freeMin, amenities, journey, depTime), [freeMin]);
  // Keep loading shimmer for 0.6s so it feels "computed"
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 600); return () => clearTimeout(t); }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total Layover', value: `${Math.floor(journey.layoverMinutes/60)}h ${journey.layoverMinutes%60}m`, color: 'text-foreground' },
          { label: 'Free Time',     value: freeMin > 0 ? `${freeMin}m` : 'None', color: freeMin > 40 ? 'text-success' : freeMin > 20 ? 'text-warning' : 'text-destructive' },
          { label: 'Transfer',      value: journey.isInternationalTransfer ? 'Intl' : 'Dom', color: 'text-primary' },
        ].map(c => (
          <div key={c.label} className="glass rounded-xl p-3 text-center">
            <p className={`font-display font-bold text-lg ${c.color}`}>{c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-display font-semibold text-sm text-foreground">AI Recommendations</span>
        <span className="text-[10px] text-muted-foreground ml-1">· {journey.isInternationalTransfer ? 'Medium layover' : 'Domestic'} → smart time use</span>
      </div>

      {!ready && (
        <div className="space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex gap-3 p-3 rounded-xl border border-border/20 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-primary/10 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-primary/10 rounded w-2/3" />
                <div className="h-2.5 bg-muted/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {ready && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Priority Actions</p>
          {suggestions.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-l-2 glass ${urgencyStyle[s.urgency]}`}>
              <span className="text-2xl shrink-0 mt-0.5">{emojiIcon[s.icon] ?? '✨'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-display font-semibold text-foreground">{s.title}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    s.urgency === 'high' ? 'text-destructive' : s.urgency === 'medium' ? 'text-warning' : 'text-success'
                  }`}>{s.urgency.toUpperCase()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Top rated section */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Top Rated at {journey.layoverAirport}</p>
        <div className="space-y-2">
          {airport.nodes.filter(n => n.type === 'amenity').slice(0, 3).map(n => {
            const meta = getAmenityMeta(n.id, n.amenityType);
            const busynessColor: Record<string,string> = { low: 'text-success', medium: 'text-warning', high: 'text-destructive' };
            return (
              <div key={n.id} className="glass rounded-xl p-3 flex items-center gap-3">
                <span className="text-xl">{{ cafe:'☕',washroom:'🚻',lounge:'🛋️',restaurant:'🍽️',shop:'🛍️',prayer_room:'🕌' }[n.amenityType ?? ''] ?? '📍'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{n.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-warning">{'★'.repeat(Math.round(meta.rating))}</span>
                    <span className="text-[10px] text-muted-foreground">{meta.rating.toFixed(1)} · {meta.openHours}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold ${busynessColor[meta.busyness]}`}>{
                  meta.busyness === 'low' ? 'Low crowd' : meta.busyness === 'medium' ? 'Moderate' : 'Busy'
                }</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ── Gate-to-gate map tab component ───────────────────────────────
function GateToGateMap({ journey, airport, graph }: {
  journey: LayoverJourney;
  airport: NonNullable<ReturnType<typeof getAirport>>;
  graph: Record<string, { to: string; distance: number }[]>;
}) {
  const fromId = gateToNodeId(journey.flight1.arrivalGate);
  const toId   = gateToNodeId(journey.flight2.departureGate);
  const g2gRoute = useMemo(() => {
    if (!fromId || !toId) return null;
    return dijkstra(graph, fromId, toId);
  }, [fromId, toId, graph]);

  return (
    <motion.div key="map" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-foreground">{airport.name}</h2>
          <p className="text-xs text-muted-foreground">Gate-to-gate transfer route</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-1.5 text-center">
            <p className="font-display font-bold text-base text-success">{journey.flight1.arrivalGate}</p>
            <p className="text-[9px] text-muted-foreground">Arrive</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-center">
            <p className="font-display font-bold text-base text-primary">{journey.flight2.departureGate}</p>
            <p className="text-[9px] text-muted-foreground">Depart</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <AirportMap airport={airport}
        highlightPath={g2gRoute?.path || []}
        selectedNode={toId}
        startNode={fromId}
        endNode={toId}
        onNodeClick={() => {}}
      />

      {/* Route details card */}
      {g2gRoute ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚶</span>
              <div>
                <p className="text-sm font-display font-bold text-foreground">Gate {journey.flight1.arrivalGate} → Gate {journey.flight2.departureGate}</p>
                <p className="text-xs text-muted-foreground">Shortest walking route</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold text-primary">{Math.ceil(g2gRoute.walkingTime / 60)}</p>
              <p className="text-[10px] text-muted-foreground">min · {g2gRoute.distance}m</p>
            </div>
          </div>
          {/* Path breadcrumb */}
          <div className="flex flex-wrap gap-1 bg-secondary/20 rounded-lg px-3 py-2">
            {g2gRoute.path.map((nodeId, i) => {
              const node = airport.nodes.find(n => n.id === nodeId);
              if (!node) return null;
              const isEnd = i === 0 || i === g2gRoute.path.length - 1;
              return (
                <span key={nodeId} className="flex items-center gap-1 text-[10px]">
                  <span className={isEnd ? 'text-primary font-semibold' : 'text-muted-foreground'}>{node.name}</span>
                  {i < g2gRoute.path.length - 1 && <span className="text-primary/30">›</span>}
                </span>
              );
            })}
          </div>
          {journey.isInternationalTransfer && (
            <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded-lg">
              <span>⚠️</span>
              <span>International transfer — add ~45 min for immigration & security after landing</span>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="glass rounded-xl p-4 text-center text-sm text-muted-foreground">
          Route data unavailable for this airport.
        </div>
      )}
    </motion.div>
  );
}
const Index = () => {
  const [view, setView]           = useState<AppView>('search');
  const [journey, setJourney]     = useState<LayoverJourney | null>(null);
  const [travelDate, setTravelDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [countdownUrgency, setCountdownUrgency] = useState<'safe' | 'soon' | 'urgent'>('safe');
  const [notifications, setNotifications] = useState<{ id: number; type: 'boarding' | 'delay' | 'cancel' | 'gate'; msg: string; time: string }[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const addNotif = useCallback((type: 'boarding' | 'delay' | 'cancel' | 'gate', msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setNotifications(p => [{ id: Date.now(), type, msg, time }, ...p.slice(0, 9)]);
  }, []);

  // navigate screen state
  const [selectedGate,    setSelectedGate]    = useState<string | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<NavNode | null>(null);
  const [selectedAmenityB,setSelectedAmenityB]= useState<NavNode | null>(null);
  const [routeResult,     setRouteResult]     = useState<PathResult | null>(null);
  const [gateChangeRoute, setGateChangeRoute] = useState<{ from: string; to: string; path: PathResult } | null>(null);
  const [gateChange,      setGateChange]      = useState<{ old: string; new: string } | null>(null);
  const [isRealData,      setIsRealData]      = useState(false);
  const [navMode, setNavMode]                 = useState<NavMode>('to-amenity');

  const layoverAirportCode = journey?.layoverAirport ?? null;
  const airport   = useMemo(() => layoverAirportCode ? getAirport(layoverAirportCode) : null, [layoverAirportCode]);
  const graph     = useMemo(() => airport ? buildGraph(airport.edges) : {}, [airport]);

  // Amenities enriched with distance from arrival gate
  const amenities = useMemo(() => {
    if (!airport || !journey) return [];
    const startId = gateToNodeId(journey.flight1.arrivalGate);
    return airport.nodes
      .filter(n => n.type === 'amenity')
      .map(n => {
        if (!startId) return n;
        const r = dijkstra(graph, startId, n.id);
        return r ? { ...n, distanceFromGate: r.distance } : n;
      });
  }, [airport, journey, graph]);

  const layoverRec = useMemo(() => {
    if (!journey || !airport) return null;
    return optimizeLayover(journey.flight1.arrivalTime, journey.flight2.departureTime, journey.flight1.arrivalGate, journey.flight2.departureGate, airport);
  }, [journey, airport]);

  // Compute free time for AI tips
  const freeMin = useMemo(() => {
    if (!journey) return 0;
    const walk = 15, sec = journey.isInternationalTransfer ? 20 : 8, immig = journey.isInternationalTransfer ? 25 : 0, board = 15;
    return Math.max(0, journey.layoverMinutes - walk - sec - immig - board);
  }, [journey]);

  // Health score label
  // Health label kept for JourneySummary internal use

  // ── Search ───────────────────────────────────────────────────────
  const handleSearch = useCallback(async (fn1: string, fn2: string, date: string) => {
    setError(null); setLoading(true); setTravelDate(date);
    try {
      const knownPair = lookupFlightPair(fn1, fn2, date);
      let f1: FlightInfo | null = knownPair?.flight1 ?? null;
      let f2: FlightInfo | null = knownPair?.flight2 ?? null;
      if (!f1) f1 = await lookupFlight(fn1, date);
      if (!f2) f2 = await lookupFlight(fn2, date);
      if (!f1) { setError(`Flight "${fn1}" not found.`); return; }
      if (!f2) { setError(`Flight "${fn2}" not found.`); return; }
      const built = buildLayoverJourney(f1, f2);
      if (!built) { setError(`No common layover airport. (${f1.arrivalAirport} ≠ ${f2.departureAirport})`); return; }
      setJourney(built);
      const mocks = ['AI111','BA178','EK501','EK201','AI665','EK508','EK503','EK003','BA055','BA117'];
      setIsRealData(!mocks.includes(fn1.toUpperCase()) && !mocks.includes(fn2.toUpperCase()));
      setView('journey');
    } catch { setError('Failed to fetch flight data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (journey) setSelectedGate(journey.flight1.arrivalGate); }, [journey]);

  // ── Live countdown — layover time remaining ──────────────────────
  useEffect(() => {
    if (!journey) { setCountdown(''); return; }
    const arrivalMs   = new Date(journey.flight1.arrivalTime).getTime();
    const departureMs = new Date(journey.flight2.departureTime).getTime();

    const tick = () => {
      const now = Date.now();

      if (now < arrivalMs) {
        // Haven't landed yet — show full layover duration
        const h = Math.floor(journey.layoverMinutes / 60);
        const m = journey.layoverMinutes % 60;
        setCountdown(`${h}h ${m}m layover`);
        setCountdownUrgency('safe');
        return;
      }

      const remaining = departureMs - now;

      if (remaining <= 0 && remaining > -3 * 60 * 60 * 1000) {
        setCountdown('Departs now!');
        setCountdownUrgency('urgent');
        return;
      }
      if (remaining <= -3 * 60 * 60 * 1000) {
        setCountdown('Departed');
        setCountdownUrgency('safe');
        return;
      }

      const h = Math.floor(remaining / 3_600_000);
      const m = Math.floor((remaining % 3_600_000) / 60_000);
      const s = Math.floor((remaining % 60_000) / 1_000);

      const str = h > 0
        ? `${h}h ${m}m left`
        : m > 0
        ? `${m}m ${String(s).padStart(2, '0')}s left`
        : `${s}s left`;

      setCountdown(str);
      setCountdownUrgency(remaining < 15 * 60_000 ? 'urgent' : remaining < 45 * 60_000 ? 'soon' : 'safe');
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [journey]);
  useEffect(() => {
    if (!journey) return;
    const depMs = new Date(journey.flight2.departureTime).getTime();
    const remindAt30 = depMs - 30 * 60 * 1000;
    const remindAt15 = depMs - 15 * 60 * 1000;
    const now = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (remindAt30 > now) {
      timers.push(setTimeout(() => {
        addNotif('boarding', `⏰ Boarding reminder: ${journey.flight2.flightNumber} departs in 30 min. Head to Gate ${journey.flight2.departureGate} now.`);
      }, remindAt30 - now));
    }
    if (remindAt15 > now) {
      timers.push(setTimeout(() => {
        addNotif('boarding', `🚨 Last call: ${journey.flight2.flightNumber} departs in 15 min. Gate ${journey.flight2.departureGate} — board immediately!`);
      }, remindAt15 - now));
    }
    return () => timers.forEach(clearTimeout);
  }, [journey, addNotif]);

  // ── Polling ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!journey) return;
    const interval = setInterval(async () => {
      try {
        const updated = await pollFlightUpdate(journey.flight2.flightNumber);
        if (!updated) return;
        if (updated.departureGate !== journey.flight2.departureGate) {
          const msg = `🚪 Gate change: ${journey.flight2.flightNumber} moved from Gate ${journey.flight2.departureGate} → Gate ${updated.departureGate}`;
          addNotif('gate', msg);
          setGateChange({ old: journey.flight2.departureGate, new: updated.departureGate });
          if (view === 'navigate' && selectedGate) {
            const from = gateToNodeId(selectedGate), to = gateToNodeId(updated.departureGate);
            if (from && to) { const p = dijkstra(graph, from, to); if (p) setGateChangeRoute({ from: journey.flight2.departureGate, to: updated.departureGate, path: p }); }
          }
        }
        if (updated.status === 'delayed' && journey.flight2.status !== 'delayed') {
          addNotif('delay', `⚠️ ${journey.flight2.flightNumber} is delayed. New departure: ${new Date(updated.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);
        }
        if (updated.status === 'cancelled' && journey.flight2.status !== 'cancelled') {
          addNotif('cancel', `🚨 ${journey.flight2.flightNumber} has been cancelled. Contact ${journey.flight2.airline} immediately.`);
        }
        setJourney(prev => prev ? { ...prev, flight2: { ...prev.flight2, status: updated.status, departureTime: updated.departureTime } } : prev);
      } catch {}
    }, 60_000);
    return () => clearInterval(interval);
  }, [journey, view, graph, selectedGate]);

  // ── Navigation handlers ──────────────────────────────────────────
  const handleAmenitySelect = useCallback((node: NavNode) => {
    setSelectedAmenity(node); setSelectedAmenityB(null); setGateChangeRoute(null);
    const startId = gateToNodeId(selectedGate ?? '');
    if (startId) setRouteResult(dijkstra(graph, startId, node.id));
  }, [selectedGate, graph]);

  const handlePairSelect = useCallback((nodeA: NavNode, nodeB: NavNode) => {
    setSelectedAmenity(nodeA); setSelectedAmenityB(nodeB); setGateChangeRoute(null);
    const r = dijkstra(graph, nodeA.id, nodeB.id);
    setRouteResult(r);
  }, [graph]);

  const simulateGateChange = useCallback(() => {
    if (journey) {
      setGateChange({ old: journey.flight2.departureGate, new: 'B5' });
      addNotif('gate', `🚪 Gate change: ${journey.flight2.flightNumber} moved from Gate ${journey.flight2.departureGate} → Gate B5`);
    }
  }, [journey, addNotif]);

  // ── Tab nav items ────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home',     label: 'Home',     icon: <Home className="w-5 h-5" /> },
    { id: 'journey',  label: 'Journey',  icon: <Plane className="w-5 h-5" /> },
    { id: 'layover',  label: 'Layover',  icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'navigate', label: 'Navigate', icon: <Route className="w-5 h-5" /> },
    { id: 'map',      label: 'Map',      icon: <MapPin className="w-5 h-5" /> },
    { id: 'ai-tips',  label: 'AI Tips',  icon: <Sparkles className="w-5 h-5" /> },
  ];

  const isPostSearch = view !== 'search';

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-40 glass border-b border-border/30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        {isPostSearch && journey ? (
          // Flight info top bar
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
            <div className="flex items-center gap-2 min-w-0">
              <Plane className="w-4 h-4 text-primary shrink-0" />
              <span className="font-display font-bold text-sm text-foreground truncate">
                {journey.flight1.departureAirport} → {journey.layoverAirport} → {journey.flight2.arrivalAirport}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Live countdown */}
              <AnimatePresence mode="wait">
                {countdown && (
                  <motion.span
                    key={countdownUrgency}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-full tabular-nums ${
                      countdownUrgency === 'urgent' ? 'text-destructive bg-destructive/15 animate-pulse' :
                      countdownUrgency === 'soon'   ? 'text-warning bg-warning/15' :
                                                      'text-success bg-success/15'
                    }`}
                  >
                    {countdownUrgency === 'urgent' ? '🚨' : '⏱'} {countdown}
                  </motion.span>
                )}
              </AnimatePresence>
              {isRealData && (
                <span className="flex items-center gap-1 text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />Live
                </span>
              )}
              <button onClick={() => setShowNotifPanel(v => !v)} className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-destructive flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white px-0.5">{notifications.length}</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Brand header for search
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-sm text-foreground">SkyNav</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showNotifPanel && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="max-w-lg mx-auto px-4 pb-3 space-y-1.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notifications</p>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-[10px] text-muted-foreground hover:text-foreground">Clear all</button>
                )}
              </div>
              {notifications.length === 0
                ? <p className="text-xs text-muted-foreground text-center py-3">No notifications yet</p>
                : notifications.map(n => {
                  const colors: Record<string, string> = {
                    boarding: 'text-primary bg-primary/10 border-primary/20',
                    gate: 'text-warning bg-warning/10 border-warning/20',
                    delay: 'text-warning bg-warning/10 border-warning/20',
                    cancel: 'text-destructive bg-destructive/10 border-destructive/20',
                  };
                  return (
                    <div key={n.id} className={`flex items-start gap-2 text-xs glass rounded-lg px-3 py-2 border ${colors[n.type] ?? ''}`}>
                      <span className="shrink-0 mt-0.5">{n.type === 'boarding' ? '⏰' : n.type === 'gate' ? '🚪' : n.type === 'delay' ? '⚠️' : '🚨'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground leading-snug">{n.msg}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  );
                })
              }
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── GATE CHANGE ALERT ── */}
      <AnimatePresence>
        {gateChange && (
          <GateChangeAlert oldGate={gateChange.old} newGate={gateChange.new}
            onDismiss={() => setGateChange(null)}
            onNavigate={() => {
              const ng = gateChange.new;
              setGateChange(null);
              if (journey) setJourney({ ...journey, flight2: { ...journey.flight2, departureGate: ng } });
              const from = gateToNodeId(selectedGate ?? ''), to = gateToNodeId(ng);
              if (from && to) { const p = dijkstra(graph, from, to); if (p) setGateChangeRoute({ from: gateChange.old, to: ng, path: p }); }
              setSelectedAmenity(null); setRouteResult(null);
              setView('navigate');
            }}
          />
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 ${isPostSearch ? 'pb-24' : ''}`}>
        <AnimatePresence mode="wait">

          {/* SEARCH */}
          {view === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <div className="text-center space-y-3 pt-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Plane className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h1 className="font-display text-3xl font-bold text-foreground">Sky<span className="text-gradient-primary">Nav</span></h1>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Smart layover optimization for connecting flights. Enter both flight numbers to begin.</p>
              </div>
              <TwoFlightSearch onSearch={handleSearch} isLoading={loading} />
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</motion.p>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: MapPin,      label: 'Gate-to-Gate', desc: 'Shortest path' },
                  { icon: Clock,       label: 'Layover Score', desc: 'Health analysis' },
                  { icon: Navigation,  label: 'AI Optimizer',  desc: 'Smart suggestions' },
                ].map((feat, i) => (
                  <motion.div key={feat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-center p-3 rounded-xl border border-border/30 bg-secondary/20">
                    <feat.icon className="w-5 h-5 mx-auto text-primary mb-1.5" />
                    <p className="text-xs font-display font-semibold text-foreground">{feat.label}</p>
                    <p className="text-[10px] text-muted-foreground">{feat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HOME TAB — new search while keeping journey */}
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <div className="text-center space-y-3 pt-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="w-14 h-14 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Plane className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <h1 className="font-display text-2xl font-bold text-foreground">Search New Flight</h1>
                <p className="text-muted-foreground text-xs max-w-xs mx-auto">Enter two flight numbers to start a new layover journey.</p>
              </div>
              <TwoFlightSearch onSearch={handleSearch} isLoading={loading} />
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</motion.p>
              )}
            </motion.div>
          )}

          {/* TAB 1: JOURNEY */}
          {view === 'journey' && journey && (
            <JourneySummary key="journey" journey={journey} onContinue={() => setView('layover')} />
          )}

          {/* TAB 2: LAYOVER DASHBOARD */}
          {view === 'layover' && journey && airport && (
            <LayoverDashboard key="layover" journey={journey} airport={airport} />
          )}

          {/* TAB 3: NAVIGATE (gate-to-gate + amenity nav) */}
          {view === 'navigate' && journey && airport && (
            <motion.div key="navigate" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">

              {/* Gate change route banner */}
              {gateChangeRoute && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-warning/40 bg-warning/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                    <span className="font-display font-bold text-sm text-warning">Gate Change Route</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Gate <span className="font-semibold text-foreground">{gateChangeRoute.from}</span> → <span className="font-semibold text-warning">{gateChangeRoute.to}</span></p>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-foreground">{gateChangeRoute.path.distance}m</span>
                    <span className="text-lg font-display font-bold text-warning">{Math.ceil(gateChangeRoute.path.walkingTime / 60)} min</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gateChangeRoute.path.path.map((nodeId, i) => {
                      const node = airport.nodes.find(n => n.id === nodeId);
                      if (!node) return null;
                      return (
                        <span key={nodeId} className="flex items-center gap-1 text-xs">
                          <span className={i === 0 || i === gateChangeRoute.path.path.length - 1 ? 'text-warning font-semibold' : 'text-muted-foreground'}>{node.name}</span>
                          {i < gateChangeRoute.path.path.length - 1 && <span className="text-warning/60">→</span>}
                        </span>
                      );
                    })}
                  </div>
                  <button onClick={() => setGateChangeRoute(null)} className="mt-2 text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                </motion.div>
              )}

              <div>
                <h2 className="font-display text-base font-bold text-foreground">{airport.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {navMode === 'a-to-b' ? 'Select two amenities for A→B navigation' :
                   gateChangeRoute ? `Gate ${gateChangeRoute.from} → Gate ${gateChangeRoute.to}` :
                   `From Gate ${selectedGate} · Tap amenity to navigate`}
                </p>
              </div>

              <AirportMap airport={airport}
                highlightPath={gateChangeRoute ? gateChangeRoute.path.path : (routeResult?.path || [])}
                selectedNode={gateChangeRoute ? gateToNodeId(gateChangeRoute.to) : selectedAmenity?.id}
                startNode={navMode === 'a-to-b' ? selectedAmenity?.id ?? null : (selectedGate ? gateToNodeId(selectedGate) : null)}
                endNode={gateChangeRoute ? gateToNodeId(gateChangeRoute.to) : (navMode === 'a-to-b' ? selectedAmenityB?.id : selectedAmenity?.id)}
                onNodeClick={(node) => { if (node.type === 'amenity') handleAmenitySelect(node); }}
              />

              {/* Route result — shown immediately below map */}
              <AnimatePresence>
                {routeResult && !gateChangeRoute && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="glass rounded-xl border border-primary/20 overflow-hidden"
                  >
                    {/* Top: distance + walk time */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {navMode === 'a-to-b'
                            ? `${selectedAmenity?.name} → ${selectedAmenityB?.name}`
                            : `Gate ${selectedGate} → ${selectedAmenity?.name}`}
                        </p>
                        <p className="text-sm font-display font-bold text-foreground mt-0.5">{routeResult.distance}m</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-display font-bold text-primary leading-none">{Math.ceil(routeResult.walkingTime / 60)}</p>
                        <p className="text-[10px] text-muted-foreground">min walk</p>
                      </div>
                    </div>
                    {/* Directions breadcrumb */}
                    <div className="px-4 py-2.5 flex flex-wrap items-center gap-1">
                      {routeResult.path.map((nodeId, i) => {
                        const node = airport.nodes.find(n => n.id === nodeId);
                        if (!node) return null;
                        const isFirst = i === 0;
                        const isLast  = i === routeResult.path.length - 1;
                        return (
                          <span key={nodeId} className="flex items-center gap-1">
                            <span className={`text-[11px] font-medium ${
                              isFirst || isLast ? 'text-primary font-semibold' : 'text-muted-foreground'
                            }`}>
                              {node.name}
                            </span>
                            {!isLast && <span className="text-primary/40 text-xs">›</span>}
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AmenitySelector
                amenities={amenities} selectedId={selectedAmenity?.id} selectedIdB={selectedAmenityB?.id}
                navMode={navMode} onNavModeChange={m => { setNavMode(m); setRouteResult(null); setSelectedAmenity(null); setSelectedAmenityB(null); }}
                onSelect={handleAmenitySelect} onSelectPair={handlePairSelect}
              />

              <button onClick={simulateGateChange}
                className="w-full py-2 text-xs text-muted-foreground border border-border/30 rounded-lg hover:bg-secondary/30 transition-colors">
                ⚡ Simulate Gate Change
              </button>
            </motion.div>
          )}

          {/* TAB 4: MAP — gate-to-gate only */}
          {view === 'map' && journey && airport && (
            <GateToGateMap key="map" journey={journey} airport={airport} graph={graph} />
          )}

          {/* TAB 5: AI TIPS */}
          {view === 'ai-tips' && journey && airport && (
            <AITipsScreen key="ai-tips" freeMin={freeMin} airport={airport} journey={journey} />
          )}

        </AnimatePresence>
      </main>

      {/* ── BOTTOM NAV ── */}
      {isPostSearch && journey && (
        <motion.nav
          initial={{ y: 80 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/30"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="max-w-lg mx-auto flex">
            {tabs.map(tab => {
              const isActive = view === tab.id;
              return (
                <button key={tab.id} onClick={() => setView(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-all relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span layoutId="tab-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                  )}
                  <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
                  <span className="text-[9px] font-semibold">{tab.label}</span>
                  {/* Unread boarding badge on boarding-related tabs */}
                  {tab.id === 'layover' && notifications.some(n => n.type === 'boarding') && !isActive && (
                    <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </div>
  );
};

export default Index;
