import { motion } from 'framer-motion';
import { Plane, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { FlightInfo } from '@/lib/types';
import { useState, useEffect } from 'react';

interface FlightCardProps {
  flight: FlightInfo;
  onNavigate?: () => void;
}

const statusConfig: Record<string, { color: string; label: string; icon: typeof CheckCircle }> = {
  scheduled: { color: 'bg-info/20 text-info',             label: 'Scheduled', icon: Clock },
  active:    { color: 'bg-success/20 text-success',        label: 'In Air',    icon: Plane },
  landed:    { color: 'bg-success/20 text-success',        label: 'Landed',    icon: CheckCircle },
  delayed:   { color: 'bg-warning/20 text-warning',        label: 'Delayed',   icon: AlertTriangle },
  cancelled: { color: 'bg-destructive/20 text-destructive',label: 'Cancelled', icon: AlertTriangle },
};

function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState(() => new Date(targetIso).getTime() - Date.now());
  useEffect(() => {
    const tick = () => setRemaining(new Date(targetIso).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  return remaining;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return { text: 'Boarding now', urgent: true, critical: true };
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const urgent   = ms < 30 * 60 * 1000;   // < 30 min
  const critical = ms < 10 * 60 * 1000;   // < 10 min
  const text = h > 0
    ? `${h}h ${m}m to boarding`
    : m > 0
    ? `${m}m ${s}s to boarding`
    : `${s}s to boarding`;
  return { text, urgent, critical };
}

const FlightCard = ({ flight, onNavigate }: FlightCardProps) => {
  const status = statusConfig[flight.status] || statusConfig.scheduled;
  const StatusIcon = status.icon;
  const remainingMs = useCountdown(flight.departureTime);
  const countdown = formatCountdown(remainingMs);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Mode: arrival (landed/short time before dep) vs departure
  const isArrivalMode = flight.status === 'landed' || flight.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-card w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">{flight.flightNumber}</h3>
            <p className="text-sm text-muted-foreground">{flight.airline}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>

      {/* Route visualization */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-center flex-1">
          <p className="text-2xl font-display font-bold text-foreground">{flight.departureAirport}</p>
          <p className="text-xs text-muted-foreground mt-1">{flight.departureTerminal} · Gate {flight.departureGate}</p>
          <p className="text-sm font-semibold text-primary mt-1">{formatTime(flight.departureTime)}</p>
        </div>
        <div className="flex-1 px-4">
          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-border" />
            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute">
              <Plane className="w-4 h-4 text-primary rotate-90" />
            </motion.div>
          </div>
        </div>
        <div className="text-center flex-1">
          <p className="text-2xl font-display font-bold text-foreground">{flight.arrivalAirport}</p>
          <p className="text-xs text-muted-foreground mt-1">{flight.arrivalTerminal} · Gate {flight.arrivalGate}</p>
          <p className="text-sm font-semibold text-primary mt-1">{formatTime(flight.arrivalTime)}</p>
        </div>
      </div>

      {/* Countdown timer */}
      {flight.status !== 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between
            ${countdown.critical
              ? 'bg-destructive/15 border border-destructive/40'
              : countdown.urgent
              ? 'bg-warning/10 border border-warning/30'
              : 'bg-primary/5 border border-primary/20'}`}
        >
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${countdown.critical ? 'text-destructive' : countdown.urgent ? 'text-warning' : 'text-primary'}`} />
            <span className="text-xs text-muted-foreground font-medium">
              {isArrivalMode ? 'Departure' : 'Boarding'}
            </span>
          </div>
          <motion.span
            key={countdown.text}
            initial={{ opacity: 0.6, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-display font-bold text-sm tabular-nums
              ${countdown.critical ? 'text-destructive' : countdown.urgent ? 'text-warning' : 'text-primary'}`}
          >
            {countdown.text}
          </motion.span>
          {countdown.critical && (
            <motion.div
              className="w-2 h-2 rounded-full bg-destructive"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}

      {/* Mode badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full
          ${isArrivalMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
          {isArrivalMode ? '✈ Arrival Mode — find your gate' : '🛫 Departure Mode — optimize layover'}
        </span>
      </div>

      {/* Navigate button */}
      {onNavigate && (
        <button
          onClick={onNavigate}
          className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-display font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <MapPin className="w-4 h-4" />
          Navigate & Optimize Layover
        </button>
      )}
    </motion.div>
  );
};

export default FlightCard;
