import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Route, FootprintsIcon, Sparkles, Plane, Coffee, ShoppingBag, Utensils, Bath, BookOpen, Wifi } from 'lucide-react';
import { LayoverRecommendation, PathResult, NavNode, FlightInfo, LayoverJourney } from '@/lib/types';
import { AirportConfig } from '@/lib/airportData';
import { useState, useEffect } from 'react';

interface LayoverPanelProps {
  recommendation: LayoverRecommendation;
  routeResult?: PathResult | null;
  nodes: NavNode[];
  hideRoute?: boolean;
  airport?: AirportConfig;
  flight?: FlightInfo;
  journey?: LayoverJourney;
}

interface AISuggestion {
  icon: string;
  title: string;
  detail: string;
  urgency: 'low' | 'medium' | 'high';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  plane: Plane, coffee: Coffee, shop: ShoppingBag, food: Utensils,
  washroom: Bath, relax: BookOpen, wifi: Wifi, sparkles: Sparkles,
};

const amenityIconMap: Record<string, string> = {
  cafe: 'coffee', restaurant: 'food', lounge: 'relax',
  shop: 'shop', washroom: 'washroom', prayer_room: 'sparkles',
};

function buildPrompt(usableTime: number, amenities: NavNode[], flight?: FlightInfo, airport?: AirportConfig): string {
  const amenityList = amenities.map(a => `${a.name} (${a.amenityType})`).join(', ');
  const airportName = airport?.name ?? 'the airport';
  const route = flight ? `${flight.departureAirport} → ${flight.arrivalAirport}` : '';

  return `You are a smart airport layover assistant. A passenger at ${airportName}${route ? ` on flight ${route}` : ''} has ${usableTime} usable minutes before departure.

Available amenities nearby: ${amenityList || 'general airport facilities'}.

Give exactly 3 short, personalized suggestions as a JSON array. Each item must have:
- "icon": one of: plane, coffee, shop, food, washroom, relax, wifi, sparkles
- "title": 4-6 word action (e.g. "Grab a latte at ${amenities.find(a=>a.amenityType==='cafe')?.name ?? 'the café'}")  
- "detail": one sentence why, mentioning time (e.g. "You have 12 min — enough for a quick drink")
- "urgency": "low", "medium", or "high"

Rules:
- If usableTime < 10: all 3 must be boarding-related urgency "high"
- If usableTime < 30: focus on washroom + gate, urgency "high"
- If usableTime 30-60: quick snack/coffee + washroom, urgency "medium"  
- If usableTime > 60: lounge/meal/shop, urgency "low"
- Be specific, warm, practical. Mention actual amenity names.
- Return ONLY the JSON array, no markdown, no extra text.`;
}

function FallbackSuggestions({ usableTime, amenities, timeToLeave }: { usableTime: number; amenities: NavNode[]; timeToLeave: string }) {
  const suggestions: AISuggestion[] = usableTime < 10
    ? [
        { icon: 'plane', title: 'Head to your gate now', detail: 'Boarding is imminent — proceed directly to your departure gate.', urgency: 'high' },
        { icon: 'washroom', title: 'Quick washroom stop', detail: 'Only if it\'s directly on the way to your gate.', urgency: 'high' },
        { icon: 'plane', title: 'Check boarding status', detail: 'Look for gate displays or ask airline staff immediately.', urgency: 'high' },
      ]
    : usableTime < 30
    ? [
        { icon: 'washroom', title: 'Visit nearest washroom', detail: `You have ${usableTime} min — a quick stop before boarding is smart.`, urgency: 'high' },
        { icon: 'coffee', title: 'Grab water or a snack', detail: 'Pick up something quick from the nearest kiosk only.', urgency: 'medium' },
        { icon: 'plane', title: `Leave for gate by ${timeToLeave}`, detail: 'Don\'t wander — stay close to your departure gate area.', urgency: 'high' },
      ]
    : usableTime < 60
    ? [
        { icon: 'coffee', title: amenities.find(a => a.amenityType === 'cafe')?.name ? `Coffee at ${amenities.find(a => a.amenityType === 'cafe')!.name}` : 'Grab a coffee', detail: `${usableTime} min is enough for a relaxed drink before your flight.`, urgency: 'medium' },
        { icon: 'washroom', title: 'Freshen up', detail: 'Visit the washroom and refresh before boarding.', urgency: 'medium' },
        { icon: 'plane', title: `Gate by ${timeToLeave}`, detail: 'Head back with 15 min to spare for a stress-free boarding.', urgency: 'medium' },
      ]
    : [
        { icon: 'relax', title: amenities.find(a => a.amenityType === 'lounge')?.name ? `Relax at ${amenities.find(a => a.amenityType === 'lounge')!.name}` : 'Visit the lounge', detail: `You have ${usableTime} min — plenty of time to unwind in comfort.`, urgency: 'low' },
        { icon: 'food', title: amenities.find(a => a.amenityType === 'restaurant')?.name ? `Dine at ${amenities.find(a => a.amenityType === 'restaurant')!.name}` : 'Grab a meal', detail: 'A proper sit-down meal is on the cards with this much time.', urgency: 'low' },
        { icon: 'shop', title: 'Browse duty free', detail: 'Check out the shops — you\'ve earned a leisurely stroll.', urgency: 'low' },
      ];

  return <SuggestionList suggestions={suggestions} timeToLeave={timeToLeave} />;
}

function SuggestionList({ suggestions, timeToLeave }: { suggestions: AISuggestion[]; timeToLeave: string }) {
  const urgencyStyle: Record<string, string> = {
    high: 'border-l-destructive bg-destructive/5',
    medium: 'border-l-warning bg-warning/5',
    low: 'border-l-success bg-success/5',
  };
  const urgencyDot: Record<string, string> = {
    high: 'bg-destructive', medium: 'bg-warning', low: 'bg-success',
  };

  return (
    <div className="space-y-2">
      {suggestions.map((s, i) => {
        const Icon = iconMap[s.icon] ?? Sparkles;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-xl border-l-2 glass ${urgencyStyle[s.urgency]}`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-display font-semibold text-foreground">{s.title}</p>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${urgencyDot[s.urgency]}`} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
            </div>
          </motion.div>
        );
      })}
      <p className="text-xs text-center text-muted-foreground pt-1">
        Leave for gate by <span className="text-primary font-semibold">{timeToLeave}</span>
      </p>
    </div>
  );
}

const LayoverPanel = ({ recommendation, routeResult, nodes, hideRoute = false, airport, flight, journey }: LayoverPanelProps) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const urgency = recommendation.usableTime < 30 ? 'urgent' : recommendation.usableTime < 60 ? 'moderate' : 'relaxed';
  const urgencyColors = {
    urgent: 'border-destructive/30 bg-destructive/5',
    moderate: 'border-warning/30 bg-warning/5',
    relaxed: 'border-success/30 bg-success/5',
  };

  useEffect(() => {
    setAiLoading(true);
    setAiSuggestions(null);
    setAiError(false);

    const amenities = recommendation.suggestedAmenities.length > 0
      ? recommendation.suggestedAmenities
      : nodes.filter(n => n.type === 'amenity');

    const prompt = buildPrompt(recommendation.usableTime, amenities, flight, airport);

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
      .then(r => r.json())
      .then(data => {
        const text = data?.content?.[0]?.text ?? '';
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed: AISuggestion[] = JSON.parse(clean);
        setAiSuggestions(parsed);
      })
      .catch(() => setAiError(true))
      .finally(() => setAiLoading(false));
  }, [recommendation.usableTime]);

  // Only show route if explicitly passed (i.e., after gate change navigation)
  const showRoute = !hideRoute && !!routeResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Time summary */}
      <div className={`rounded-xl border p-4 ${urgencyColors[urgency]}`}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">Layover Summary</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-display font-bold text-foreground">{recommendation.availableTime}</p>
            <p className="text-[10px] text-muted-foreground">Total min</p>
          </div>
          <div>
            <p className="text-xl font-display font-bold text-primary">{recommendation.usableTime}</p>
            <p className="text-[10px] text-muted-foreground">Usable min</p>
          </div>
          <div>
            <p className="text-xl font-display font-bold text-muted-foreground">{recommendation.safeBuffer}</p>
            <p className="text-[10px] text-muted-foreground">Buffer min</p>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">AI Suggestions</span>
          {aiLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary/50" />
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {aiLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-3 bg-primary/10 rounded w-2/3" />
                    <div className="h-2.5 bg-muted/30 rounded w-full" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!aiLoading && (aiSuggestions || aiError) && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {aiSuggestions
                ? <SuggestionList suggestions={aiSuggestions} timeToLeave={recommendation.timeToLeave} />
                : <FallbackSuggestions usableTime={recommendation.usableTime} amenities={recommendation.suggestedAmenities} timeToLeave={recommendation.timeToLeave} />
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Route info — only shown after gate change / explicit navigation */}
      {showRoute && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Route className="w-4 h-4 text-info" />
            <span className="font-display font-semibold text-sm text-foreground">Route Details</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FootprintsIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">{routeResult!.distance}m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground">{Math.ceil(routeResult!.walkingTime / 60)} min walk</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {routeResult!.path.map((nodeId, i) => {
              const node = nodes.find(n => n.id === nodeId);
              if (!node) return null;
              return (
                <span key={nodeId} className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">{node.name}</span>
                  {i < routeResult!.path.length - 1 && <span className="text-primary">→</span>}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LayoverPanel;
