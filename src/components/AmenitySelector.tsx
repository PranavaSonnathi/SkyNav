import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavNode } from '@/lib/types';
import { MapPin, Star, Users, ArrowRight } from 'lucide-react';
import { getAmenityMeta } from '@/lib/amenityMeta';

type SortMode = 'nearest' | 'rating' | 'busyness';
export type NavMode = 'to-amenity' | 'a-to-b';

interface AmenitySelectorProps {
  onSelect:        (node: NavNode) => void;
  onSelectPair?:   (nodeA: NavNode, nodeB: NavNode) => void;
  amenities:       NavNode[];
  selectedId?:     string | null;
  selectedIdB?:    string | null;
  navMode?:        NavMode;
  onNavModeChange?:(m: NavMode) => void;
}

const typeEmoji: Record<string, string> = {
  cafe: '☕', washroom: '🚻', lounge: '🛋️',
  restaurant: '🍽️', shop: '🛍️', prayer_room: '🕌',
};
const busynessColor: Record<string, string> = {
  low: 'text-success bg-success/10', medium: 'text-warning bg-warning/10', high: 'text-destructive bg-destructive/10',
};
const busynessLabel: Record<string, string> = {
  low: 'Low crowd', medium: 'Moderate', high: 'Busy',
};

export default function AmenitySelector({
  onSelect, onSelectPair, amenities, selectedId, selectedIdB,
  navMode = 'to-amenity', onNavModeChange,
}: AmenitySelectorProps) {
  const [sort, setSort] = useState<SortMode>('nearest');
  const [pendingA, setPendingA] = useState<NavNode | null>(null);

  const enriched = useMemo(() =>
    amenities.map(a => ({ ...a, ...getAmenityMeta(a.id, a.amenityType) })),
    [amenities]
  );

  const sorted = useMemo(() => {
    const list = [...enriched];
    if (sort === 'rating')   return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === 'busyness') {
      const order: Record<string, number> = { low: 0, medium: 1, high: 2 };
      return list.sort((a, b) => (order[a.busyness ?? 'low'] ?? 0) - (order[b.busyness ?? 'low'] ?? 0));
    }
    return list.sort((a, b) => (a.distanceFromGate ?? 999) - (b.distanceFromGate ?? 999));
  }, [enriched, sort]);

  const handleCardClick = (node: NavNode) => {
    if (navMode === 'a-to-b') {
      if (!pendingA) {
        setPendingA(node);
        onSelect(node);
      } else if (pendingA.id === node.id) {
        setPendingA(null);
      } else {
        onSelectPair?.(pendingA, node);
        setPendingA(null);
      }
    } else {
      onSelect(node);
    }
  };

  return (
    <div className="space-y-3">
      {/* Nav mode toggle */}
      {onNavModeChange && (
        <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl">
          {(['to-amenity', 'a-to-b'] as NavMode[]).map(m => (
            <button key={m} onClick={() => { onNavModeChange(m); setPendingA(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-display font-semibold transition-all ${
                navMode === m ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}>
              {m === 'to-amenity' ? <><MapPin className="w-3.5 h-3.5" /> To Amenity</> : <><ArrowRight className="w-3.5 h-3.5" /> A → B</>}
            </button>
          ))}
        </div>
      )}

      {/* A→B hint */}
      <AnimatePresence>
        {navMode === 'a-to-b' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${pendingA ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>A</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="w-5 h-5 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-[10px] font-bold">B</span>
              </div>
              <p className="text-xs text-muted-foreground flex-1">
                {pendingA ? <><span className="text-foreground font-medium">{pendingA.name}</span> → pick destination</> : 'Tap to set start point (A)'}
              </p>
              {pendingA && <button onClick={() => setPendingA(null)} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider shrink-0">Sort by:</span>
        {([
          { key: 'nearest'  as SortMode, label: 'Nearest 📍'  },
          { key: 'rating'   as SortMode, label: 'Rating ⭐'   },
          { key: 'busyness' as SortMode, label: 'Least Busy 🟢' },
        ]).map(({ key, label }) => (
          <button key={key} onClick={() => setSort(key)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
              sort === key
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/30'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Amenity cards */}
      <div className="space-y-2">
        {sorted.map((node, i) => {
          const meta = getAmenityMeta(node.id, node.amenityType);
          const isA = navMode === 'a-to-b' && node.id === pendingA?.id;
          const isB = navMode === 'a-to-b' && node.id === selectedIdB;
          const isSelected = navMode === 'to-amenity' && node.id === selectedId;
          const hl = isA || isB || isSelected;

          return (
            <motion.button key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }} onClick={() => handleCardClick(node)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                isA ? 'border-primary bg-primary/10 shadow-glow' :
                isB ? 'border-success bg-success/10' :
                isSelected ? 'border-primary bg-primary/10 shadow-glow' :
                'border-border/40 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${hl ? 'bg-primary/20' : 'bg-secondary/40'}`}>
                {typeEmoji[node.amenityType ?? ''] ?? '📍'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className={`text-sm font-display font-semibold truncate ${hl ? 'text-primary' : 'text-foreground'}`}>{node.name}</p>
                  {(isA || isB) && (
                    <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isA ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'}`}>
                      {isA ? 'A' : 'B'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span className="text-[10px] font-semibold text-warning">{meta.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-muted-foreground">· {meta.openHours}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${busynessColor[meta.busyness]}`}>
                  {busynessLabel[meta.busyness]}
                </span>
                {node.distanceFromGate !== undefined && (
                  <span className="text-[10px] text-muted-foreground">{node.distanceFromGate}m</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
