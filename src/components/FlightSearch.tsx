import { motion } from 'framer-motion';
import { Plane, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FlightSearchProps {
  onSearch: (flightNumber: string) => void;
  isLoading?: boolean;
  quickFlights?: string[];
}

const FlightSearch = ({ onSearch, isLoading, quickFlights }: FlightSearchProps) => {
  const [flightNumber, setFlightNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber.trim()) {
      onSearch(flightNumber.trim().toUpperCase());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass rounded-2xl p-8 shadow-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Track Your Flight</h2>
            <p className="text-sm text-muted-foreground">Enter flight number to begin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              placeholder="e.g. AI302 or EK501"
              className="h-14 text-lg font-display bg-secondary/50 border-border/50 pl-4 pr-12 placeholder:text-muted-foreground/50 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          <Button
            type="submit"
            disabled={!flightNumber.trim() || isLoading}
            className="w-full h-12 text-base font-display font-semibold bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Plane className="w-5 h-5" />
              </motion.div>
            ) : (
              'Search Flight'
            )}
          </Button>
        </form>

        {quickFlights && quickFlights.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Try:{' '}
            {quickFlights.map((fn, i) => (
              <span key={fn}>
                {i > 0 && ' or '}
                <button onClick={() => { setFlightNumber(fn); onSearch(fn); }} className="text-primary hover:underline font-medium">{fn}</button>
              </span>
            ))}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FlightSearch;
