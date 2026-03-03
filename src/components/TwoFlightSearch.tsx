import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Search, ArrowRight, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TwoFlightSearchProps {
  onSearch: (fn1: string, fn2: string, date: string) => void;
  isLoading?: boolean;
}

const QUICK_PAIRS = [
  { label: 'DEL→LHR→JFK', fn1: 'AI111', fn2: 'BA178', route: 'Air India + BA' },
  { label: 'BOM→DXB→JFK', fn1: 'EK501', fn2: 'EK201', route: 'Emirates' },
  { label: 'DEL→BOM→DXB', fn1: 'AI665', fn2: 'EK508', route: 'Air India + Emirates' },
  { label: 'BOM→DXB→LHR', fn1: 'EK503', fn2: 'EK003', route: 'Emirates' },
  { label: 'JNB→LHR→JFK', fn1: 'BA055', fn2: 'BA117', route: 'British Airways' },
  { label: 'MAA→KUL→MEL', fn1: 'MH181', fn2: 'MH149', route: 'Malaysia Airlines' },
  { label: 'BOM→ZRH→LHR', fn1: 'LX155', fn2: 'LX316', route: 'SWISS' },
  { label: 'AUS→LAX→NRT', fn1: 'UA357', fn2: 'UA32',  route: 'United Airlines' },
];

// Format date as YYYY-MM-DD for input[type=date]
function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

const TwoFlightSearch = ({ onSearch, isLoading }: TwoFlightSearchProps) => {
  const [fn1, setFn1]         = useState('');
  const [fn2, setFn2]         = useState('');
  const [date, setDate]       = useState(toDateInput(new Date()));
  const [showQuick, setShowQuick] = useState(false);

  const handleSubmit = () => {
    if (fn1.trim() && fn2.trim()) {
      onSearch(fn1.trim().toUpperCase(), fn2.trim().toUpperCase(), date);
    }
  };

  const fillPair = (f1: string, f2: string) => {
    setFn1(f1); setFn2(f2);
    onSearch(f1, f2, date);
  };

  // Min = today, max = 1 year ahead
  const minDate = toDateInput(new Date());
  const maxDate = toDateInput(new Date(Date.now() + 365 * 86400000));

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto">
      <div className="glass rounded-2xl p-6 shadow-glow space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-foreground">Plan Your Layover</h2>
            <p className="text-xs text-muted-foreground">Enter both connecting flight numbers</p>
          </div>
        </div>

        {/* Date picker */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Travel Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={e => setDate(e.target.value)}
              className="w-full h-11 rounded-xl border border-border/40 bg-secondary/40 px-4 text-sm font-display text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {date === toDateInput(new Date()) ? '📅 Today' : `📅 ${new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>

        {/* Two flight inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center font-bold">1</span>
              First Flight — Origin to Layover Airport
            </label>
            <div className="relative">
              <Input value={fn1} onChange={e => setFn1(e.target.value.toUpperCase())}
                placeholder="e.g. AI111"
                className="h-12 font-display text-base bg-secondary/40 border-border/40 pr-10 focus:border-primary"
                onKeyDown={e => e.key === 'Enter' && fn2 && handleSubmit()} />
              <Plane className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-45" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <div className="flex-1 h-px bg-border/40" />
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-primary" />
            </div>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] flex items-center justify-center font-bold">2</span>
              Second Flight — Layover Airport to Destination
            </label>
            <div className="relative">
              <Input value={fn2} onChange={e => setFn2(e.target.value.toUpperCase())}
                placeholder="e.g. BA178"
                className="h-12 font-display text-base bg-secondary/40 border-border/40 pr-10 focus:border-primary"
                onKeyDown={e => e.key === 'Enter' && fn1 && handleSubmit()} />
              <Plane className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Search button */}
        <Button onClick={handleSubmit} disabled={!fn1.trim() || !fn2.trim() || isLoading}
          className="w-full h-12 font-display font-semibold bg-gradient-primary text-primary-foreground hover:opacity-90">
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Search className="w-5 h-5" />
            </motion.div>
          ) : (
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Find Layover Route</span>
          )}
        </Button>

        {/* Quick routes */}
        <button onClick={() => setShowQuick(v => !v)}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {showQuick ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showQuick ? 'Hide' : 'Show'} quick routes
        </button>

        <AnimatePresence>
          {showQuick && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="space-y-2 pt-1">
                {QUICK_PAIRS.map(p => (
                  <button key={p.label} onClick={() => fillPair(p.fn1, p.fn2)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-all text-left group">
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{p.label}</p>
                      <p className="text-[10px] text-muted-foreground">{p.route} · {p.fn1} + {p.fn2}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TwoFlightSearch;
