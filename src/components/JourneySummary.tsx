import { motion } from 'framer-motion';
import { Plane, Clock, MapPin, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { LayoverJourney } from '@/lib/types';

interface JourneySummaryProps {
  journey: LayoverJourney;
  onContinue: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function HealthRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Safe' : score >= 40 ? 'Tight' : 'Risk';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="hsl(215 25% 18%)" strokeWidth="6" />
        <motion.circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-lg leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] font-semibold" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

function FlightMiniCard({ flight, label, accent }: { flight: LayoverJourney['flight1']; label: string; accent: string }) {
  const statusColor: Record<string, string> = {
    scheduled: 'text-info bg-info/10',
    active:    'text-success bg-success/10',
    landed:    'text-success bg-success/10',
    delayed:   'text-warning bg-warning/10',
    cancelled: 'text-destructive bg-destructive/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-8 rounded-full`} style={{ background: accent }} />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
            <p className="font-display font-bold text-sm text-foreground">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">{flight.airline}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[flight.status] ?? statusColor.scheduled}`}>
            {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Route row */}
      <div className="flex items-center gap-2">
        <div className="text-center min-w-[52px]">
          <p className="font-display font-bold text-lg text-foreground leading-none">{flight.departureAirport}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{flight.departureTerminal}</p>
          <p className="text-xs font-semibold text-primary mt-0.5">{formatTime(flight.departureTime)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-border/50" />
            <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Plane className="w-3.5 h-3.5 text-primary" />
            </motion.div>
            <div className="flex-1 h-px bg-border/50" />
          </div>
        </div>

        <div className="text-center min-w-[52px]">
          <p className="font-display font-bold text-lg text-foreground leading-none">{flight.arrivalAirport}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{flight.arrivalTerminal}</p>
          <p className="text-xs font-semibold text-primary mt-0.5">{formatTime(flight.arrivalTime)}</p>
        </div>
      </div>

      {/* Gate row */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Gate {flight.departureGate}</span>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Gate {flight.arrivalGate}</span>
      </div>
    </motion.div>
  );
}

const JourneySummary = ({ journey, onContinue }: JourneySummaryProps) => {
  const { flight1, flight2, layoverAirport, layoverMinutes, isInternationalTransfer, healthScore } = journey;

  const layoverColor = healthScore >= 70 ? 'border-success/30 bg-success/5' : healthScore >= 40 ? 'border-warning/30 bg-warning/5' : 'border-destructive/30 bg-destructive/5';

  return (
    <motion.div
      key="journey-summary"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-4"
    >
      {/* Journey timeline strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4"
      >
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Your Journey</p>
        <div className="flex items-center gap-1">
          {/* Origin */}
          <div className="text-center min-w-[44px]">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-1">
              <Plane className="w-4 h-4 text-primary rotate-45" />
            </div>
            <p className="font-display font-bold text-sm text-foreground">{flight1.departureAirport}</p>
            <p className="text-[9px] text-muted-foreground">{formatTime(flight1.departureTime)}</p>
          </div>

          {/* Leg 1 line */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full">
              <div className="h-px bg-primary/40 w-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-1">
                <p className="text-[9px] text-primary font-semibold">{flight1.flightNumber}</p>
              </div>
            </div>
          </div>

          {/* Layover airport */}
          <div className="text-center min-w-[54px]">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-warning/20 border border-warning/40 flex items-center justify-center mx-auto mb-1"
            >
              <Clock className="w-5 h-5 text-warning" />
            </motion.div>
            <p className="font-display font-bold text-sm text-warning">{layoverAirport}</p>
            <p className="text-[9px] text-warning/70 font-semibold">{formatDuration(layoverMinutes)}</p>
          </div>

          {/* Leg 2 line */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-full">
              <div className="h-px bg-primary/40 w-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-1">
                <p className="text-[9px] text-primary font-semibold">{flight2.flightNumber}</p>
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="text-center min-w-[44px]">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center mx-auto mb-1">
              <Plane className="w-4 h-4 text-success" />
            </div>
            <p className="font-display font-bold text-sm text-foreground">{flight2.arrivalAirport}</p>
            <p className="text-[9px] text-muted-foreground">{formatTime(flight2.arrivalTime)}</p>
          </div>
        </div>
      </motion.div>

      {/* Health score + layover summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border p-4 flex items-center gap-4 ${layoverColor}`}
      >
        <HealthRing score={healthScore} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-foreground mb-0.5">Layover Health Score</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total layover</span>
              <span className="font-semibold text-foreground">{formatDuration(layoverMinutes)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Transfer type</span>
              <span className={`font-semibold ${isInternationalTransfer ? 'text-warning' : 'text-success'}`}>
                {isInternationalTransfer ? 'International' : 'Domestic'}
              </span>
            </div>
            {isInternationalTransfer && (
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-warning" />
                <span className="text-[10px] text-warning">Immigration + security required</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delay alert if either flight is delayed/cancelled */}
      {(flight1.status === 'delayed' || flight1.status === 'cancelled' ||
        flight2.status === 'delayed' || flight2.status === 'cancelled') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 flex items-center gap-3"
        >
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive font-medium">
            {flight1.status === 'cancelled' || flight2.status === 'cancelled'
              ? 'A flight in your journey is cancelled. Contact your airline immediately.'
              : 'Delay detected — your layover window may be impacted.'}
          </p>
        </motion.div>
      )}

      {/* Flight 1 card */}
      <FlightMiniCard flight={flight1} label="Flight 1 — Inbound" accent="#f59e0b" />

      {/* Layover airport divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-border/30" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30">
          <Clock className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs font-semibold text-warning">Layover at {layoverAirport} · {formatDuration(layoverMinutes)}</span>
        </div>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      {/* Flight 2 card */}
      <FlightMiniCard flight={flight2} label="Flight 2 — Outbound" accent="#22c55e" />

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onContinue}
        className="w-full h-13 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-display font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <MapPin className="w-4 h-4" />
        Open Layover Dashboard
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default JourneySummary;
