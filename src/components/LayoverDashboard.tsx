import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Footprints, Shield, Globe, Clock, CheckCircle2, XCircle,
  AlertTriangle, ArrowRight, Plane,
} from 'lucide-react';
import { LayoverJourney, PathResult } from '@/lib/types';
import { AirportConfig, gateToNodeId } from '@/lib/airportData';
import { buildGraph, dijkstra } from '@/lib/navigation';

interface LayoverDashboardProps {
  journey: LayoverJourney;
  airport: AirportConfig;
}

// ── helpers ──────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function fmtDur(min: number) {
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── sub-components ────────────────────────────────────────────────
function TimeRow({
  icon: Icon, label, value, color, delay = 0, note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; color: string; delay?: number; note?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium leading-none">{label}</p>
        {note && <p className="text-[10px] text-muted-foreground mt-0.5">{note}</p>}
      </div>
      <span className={`font-display font-bold text-sm ${
        color.includes('destructive') ? 'text-destructive' :
        color.includes('warning') ? 'text-warning' :
        color.includes('success') ? 'text-success' : 'text-primary'}`}>
        {value}
      </span>
    </motion.div>
  );
}

function RequirementBadge({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${met ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
      {met ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
      <p className="text-xs text-foreground font-medium leading-tight">{label}</p>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────
const LayoverDashboard = ({ journey, airport }: LayoverDashboardProps) => {
  const { flight1, flight2, layoverMinutes, isInternationalTransfer, healthScore } = journey;

  const gateTransfer = useMemo(() => {
    const graph = buildGraph(airport.edges);
    const fromId = gateToNodeId(flight1.arrivalGate);
    const toId   = gateToNodeId(flight2.departureGate);
    if (!fromId || !toId) return null;
    return dijkstra(graph, fromId, toId);
  }, [airport, flight1.arrivalGate, flight2.departureGate]);

  const walkMin     = gateTransfer ? Math.ceil(gateTransfer.walkingTime / 60) : 15;
  const secMin      = isInternationalTransfer ? 20 : 8;
  const immigMin    = isInternationalTransfer ? 25 : 0;
  const boardingMin = 15;
  const overheadMin = walkMin + secMin + immigMin + boardingMin;
  const freeMin     = Math.max(0, layoverMinutes - overheadMin);

  const hColor  = healthScore >= 70 ? 'text-success' : healthScore >= 40 ? 'text-warning' : 'text-destructive';
  const hBorder = healthScore >= 70 ? 'border-success/30 bg-success/5' : healthScore >= 40 ? 'border-warning/30 bg-warning/5' : 'border-destructive/30 bg-destructive/5';
  const isDelayed   = flight1.status === 'delayed'   || flight2.status === 'delayed';
  const isCancelled = flight1.status === 'cancelled' || flight2.status === 'cancelled';

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">

      {/* Delay / cancellation alert */}
      <AnimatePresence>
        {(isDelayed || isCancelled) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`rounded-xl border p-3 flex items-start gap-3 ${isCancelled ? 'border-destructive/50 bg-destructive/10' : 'border-warning/50 bg-warning/10'}`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isCancelled ? 'text-destructive' : 'text-warning'}`} />
            <div>
              <p className={`text-xs font-semibold ${isCancelled ? 'text-destructive' : 'text-warning'}`}>
                {isCancelled ? '🚨 Flight Cancelled' : '⚠️ Delay Detected'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isCancelled
                  ? 'Contact your airline immediately. Check rebooking options.'
                  : `Layover window impacted. ${freeMin < 10 ? 'Head to gate as soon as you land.' : 'Move quickly — you may still make it.'}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gate-to-gate transfer card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Footprints className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">Gate Transfer</span>
          <span className="ml-auto text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{airport.name}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 rounded-xl border border-success/40 bg-success/5 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Arrive</p>
            <p className="font-display font-bold text-xl text-success">Gate {flight1.arrivalGate}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{flight1.arrivalTerminal}</p>
            <p className="text-xs font-semibold text-success mt-1">{fmt(flight1.arrivalTime)}</p>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Footprints className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="flex flex-col items-center">
              <span className="font-display font-bold text-base text-primary">{walkMin}m</span>
              {gateTransfer && <span className="text-[9px] text-muted-foreground">{gateTransfer.distance}m</span>}
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>

          <div className="flex-1 rounded-xl border border-primary/40 bg-primary/5 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Depart</p>
            <p className="font-display font-bold text-xl text-primary">Gate {flight2.departureGate}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{flight2.departureTerminal}</p>
            <p className="text-xs font-semibold text-primary mt-1">{fmt(flight2.departureTime)}</p>
          </div>
        </div>

        {gateTransfer && gateTransfer.path.length > 0 && (
          <div className="flex flex-wrap gap-1 bg-secondary/20 rounded-lg px-3 py-2">
            {gateTransfer.path.slice(0, 6).map((nodeId, i) => {
              const node = airport.nodes.find(n => n.id === nodeId);
              if (!node) return null;
              return (
                <span key={nodeId} className="flex items-center gap-1 text-[10px]">
                  <span className={i === 0 || i === gateTransfer.path.length - 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}>{node.name}</span>
                  {i < Math.min(gateTransfer.path.length - 1, 5) && <span className="text-primary/40">›</span>}
                </span>
              );
            })}
            {gateTransfer.path.length > 6 && <span className="text-[10px] text-muted-foreground">+{gateTransfer.path.length - 6} more</span>}
          </div>
        )}
      </motion.div>

      {/* Time breakdown */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">Time Breakdown</span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-3">Total layover: <span className="font-semibold text-foreground">{fmtDur(layoverMinutes)}</span></p>

        <TimeRow icon={Footprints} label="Walking to Gate"  value={`− ${walkMin} min`}    color="bg-primary/10 text-primary"        delay={0.05} note={gateTransfer ? `${gateTransfer.distance}m estimated route` : 'Estimated'} />
        <TimeRow icon={Shield}     label="Security Check"   value={`− ${secMin} min`}      color="bg-warning/10 text-warning"        delay={0.10} note={isInternationalTransfer ? 'International queue' : 'Domestic queue'} />
        {isInternationalTransfer && (
          <TimeRow icon={Globe}    label="Immigration"       value={`− ${immigMin} min`}   color="bg-destructive/10 text-destructive" delay={0.15} note="Passport control & customs" />
        )}
        <TimeRow icon={Plane}      label="Boarding Buffer"  value={`− ${boardingMin} min`} color="bg-muted/50 text-muted-foreground"  delay={0.20} note="Recommended gate arrival time" />

        <div className="h-px bg-border/40 my-2" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${hBorder}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${healthScore >= 70 ? 'bg-success' : healthScore >= 40 ? 'bg-warning' : 'bg-destructive'} animate-pulse`} />
            <span className="text-sm font-semibold text-foreground">Free Time</span>
          </div>
          <span className={`font-display font-bold text-lg ${hColor}`}>{freeMin > 0 ? fmtDur(freeMin) : 'None'}</span>
        </motion.div>
      </motion.div>

      {/* Board by + Requirements */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Board By</p>
          <p className="font-display font-bold text-2xl text-primary leading-none">
            {fmt(new Date(new Date(flight2.departureTime).getTime() - boardingMin * 60000).toISOString())}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Gate {flight2.departureGate}</p>
          <p className="text-[10px] text-muted-foreground">{flight2.airline} · {flight2.flightNumber}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Requirements</p>
          <RequirementBadge met={true}                    label="Security check" />
          <RequirementBadge met={isInternationalTransfer} label="Immigration" />
          <RequirementBadge met={isInternationalTransfer} label="Customs" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LayoverDashboard;
