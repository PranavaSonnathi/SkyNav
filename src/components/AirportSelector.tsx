import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { airports, AirportConfig } from '@/lib/airportData';

interface AirportSelectorProps {
  onSelect: (code: string) => void;
}

const airportList = Object.values(airports);

const AirportSelector = ({ onSelect }: AirportSelectorProps) => {
  return (
    <div className="space-y-3">
      {airportList.map((airport, i) => (
        <motion.button
          key={airport.code}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.07 }}
          onClick={() => onSelect(airport.code)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-sm text-primary">{airport.code}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-sm text-foreground truncate">{airport.name}</p>
            <p className="text-xs text-muted-foreground">{airport.city}, {airport.country}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              {airport.terminals.map(t => t.label).join(' · ')}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </motion.button>
      ))}
    </div>
  );
};

export default AirportSelector;
