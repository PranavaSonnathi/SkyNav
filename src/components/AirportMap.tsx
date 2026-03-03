import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavNode } from '@/lib/types';
import { AirportConfig } from '@/lib/airportData';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface AirportMapProps {
  airport: AirportConfig;
  highlightPath?: string[];
  selectedNode?: string | null;
  onNodeClick?: (node: NavNode) => void;
  startNode?: string | null;
  endNode?: string | null;
}

const AMENITY_COLORS: Record<string, { bg: string; stroke: string }> = {
  cafe:        { bg: '#92400e', stroke: '#f59e0b' },
  washroom:    { bg: '#075985', stroke: '#38bdf8' },
  lounge:      { bg: '#4c1d95', stroke: '#a78bfa' },
  restaurant:  { bg: '#7f1d1d', stroke: '#f87171' },
  shop:        { bg: '#064e3b', stroke: '#34d399' },
  prayer_room: { bg: '#312e81', stroke: '#818cf8' },
};

function AmenityEmoji({ type, x, y, size }: { type: string; x: number; y: number; size: number }) {
  const map: Record<string, string> = {
    cafe: '☕', washroom: '🚻', lounge: '🛋', restaurant: '🍽', shop: '🛍', prayer_room: '🛐',
  };
  return <text x={x} y={y + size * 0.35} textAnchor="middle" fontSize={size * 0.9} dominantBaseline="middle">{map[type] ?? '📍'}</text>;
}

const AirportMap = ({ airport, highlightPath = [], selectedNode, onNodeClick, startNode, endNode }: AirportMapProps) => {
  const { nodes, edges, mapViewBox, terminals, centralArea } = airport;
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const viewW = Number(mapViewBox.split(' ')[2]);
  const viewH = Number(mapViewBox.split(' ')[3]);

  // Compute fit-to-container scale so full map is visible on load
  const getFitScale = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 340;
    const ch = containerRef.current?.clientHeight ?? 280;
    return Math.min(cw / viewW, ch / viewH) * 0.97; // 3% padding
  }, [viewW, viewH]);

  const [zoom, setZoom] = useState(1); // will be corrected on mount
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // On mount + airport change: fit full map into container
  useEffect(() => {
    // Small delay so container has rendered dimensions
    const id = setTimeout(() => {
      const fitScale = getFitScale();
      const cw = containerRef.current?.clientWidth ?? 340;
      const ch = containerRef.current?.clientHeight ?? 280;
      // Center the map in the container
      setPan({
        x: (cw - viewW * fitScale) / 2,
        y: (ch - viewH * fitScale) / 2,
      });
      setZoom(fitScale);
    }, 50);
    return () => clearTimeout(id);
  }, [airport, getFitScale, viewW, viewH]);

  // Touch state refs
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const resetView = useCallback(() => {
    const fitScale = getFitScale();
    const cw = containerRef.current?.clientWidth ?? 340;
    const ch = containerRef.current?.clientHeight ?? 280;
    setPan({ x: (cw - viewW * fitScale) / 2, y: (ch - viewH * fitScale) / 2 });
    setZoom(fitScale);
  }, [getFitScale, viewW, viewH]);

  // ── Touch handlers ─────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDraggingRef.current = false;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchRef.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouchRef.current) {
      const dx = e.touches[0].clientX - lastTouchRef.current.x;
      const dy = e.touches[0].clientY - lastTouchRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDraggingRef.current = true;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastPinchRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = dist / lastPinchRef.current;
      setZoom(z => Math.min(Math.max(z * delta, 0.5), 3.5));
      lastPinchRef.current = dist;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
    lastPinchRef.current = null;
  }, []);

  // ── Mouse drag (desktop) ────────────────────────────────────────
  const mouseDownRef = useRef<{ x: number; y: number } | null>(null);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDownRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    isDraggingRef.current = false;
  }, [pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    isDraggingRef.current = true;
    setPan({ x: e.clientX - mouseDownRef.current.x, y: e.clientY - mouseDownRef.current.y });
  }, []);

  const onMouseUp = useCallback(() => { mouseDownRef.current = null; }, []);

  const pathLines = useMemo(() => {
    if (highlightPath.length < 2) return [];
    const lines: { x1: number; y1: number; x2: number; y2: number; mid: { x: number; y: number } }[] = [];
    for (let i = 0; i < highlightPath.length - 1; i++) {
      const from = nodes.find(n => n.id === highlightPath[i]);
      const to   = nodes.find(n => n.id === highlightPath[i + 1]);
      if (from && to) lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, mid: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 } });
    }
    return lines;
  }, [highlightPath, nodes]);

  const pathSet = new Set(highlightPath);

  const corridors = useMemo(() => edges.map((edge, i) => {
    const from = nodes.find(n => n.id === edge.from);
    const to   = nodes.find(n => n.id === edge.to);
    if (!from || !to) return null;
    const onPath = pathSet.has(edge.from) && pathSet.has(edge.to);
    return { from, to, onPath, key: i };
  }).filter(Boolean), [edges, nodes, highlightPath]);

  // Node sizes in SVG units — large so they're readable even at fit-to-screen (~0.4x) zoom
  const GATE_W = 38, GATE_H = 22;
  const AMENITY_R = 18;
  const GATE_FONT = 12;   // renders ~5px at fit, crisp at 2× zoom
  const LABEL_FONT = 9;   // amenity label below icon

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border/20 bg-[#080f1a] relative select-none"
      style={{ touchAction: 'none' }}>

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button onClick={() => setZoom(z => Math.min(z + 0.3, 3.5))}
          className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/30 active:scale-90 transition-transform">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 0.3, 0.5))}
          className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/30 active:scale-90 transition-transform">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetView}
          className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/30 active:scale-90 transition-transform">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 flex gap-1.5 flex-wrap">
        {[
          { color: '#22c55e', label: 'You' },
          { color: '#f59e0b', label: 'Route' },
          { color: '#ef4444', label: 'Dest' },

        ].map(l => (
          <div key={l.label} className="flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-white/5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color, opacity: (l as any).opacity ?? 1 }} />
            <span className="text-[10px] text-muted-foreground font-medium">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded-full border border-white/5">
          <span className="text-[9px] text-muted-foreground">Pinch to zoom · Drag to pan</span>
        </div>
      </div>

      {/* Map container — fixed height, full map visible by default */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 300 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={mapViewBox}
          style={{
            width: viewW * zoom,
            height: viewH * zoom,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            display: 'block',
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <filter id="glow-green"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow-red"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow-amber"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(215 30% 13%)" strokeWidth="0.5"/>
            </pattern>
            <style>{`.dash-anim { stroke-dasharray: 5 9; animation: dashMove 0.7s linear infinite; } @keyframes dashMove { to { stroke-dashoffset: -14; } }`}</style>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width={viewW} height={viewH} fill="#080f1a"/>
          <rect x="0" y="0" width={viewW} height={viewH} fill="url(#grid)"/>

          {/* Terminal zones — consistent border for ALL terminals */}
          {terminals.map(t => (
            <g key={t.id}>
              {/* Outer glow border */}
              <rect x={t.x - 1} y={t.y - 1} width={t.w + 2} height={t.h + 2} rx="11"
                fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.3"/>
              {/* Main border */}
              <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="10"
                fill="hsl(215 35% 10%)" stroke="#6366f1" strokeWidth="2" opacity="0.85"/>
              {/* Inner subtle border */}
              <rect x={t.x+4} y={t.y+4} width={t.w-8} height={t.h-8} rx="7"
                fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
              {/* Label pill */}
              <rect x={t.x + t.w/2 - 46} y={t.y + 7} width={92} height={18} rx="5"
                fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" opacity="0.9"/>
              <text x={t.x + t.w/2} y={t.y + 20} textAnchor="middle"
                fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="800" letterSpacing="1">
                {t.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Central area */}
          {centralArea && (
            <g>
              <rect x={centralArea.x} y={centralArea.y} width={centralArea.w} height={centralArea.h} rx="10"
                fill="hsl(215 28% 9%)" stroke="#475569" strokeWidth="1.5" strokeDasharray="6 3"/>
              <text x={centralArea.x + centralArea.w/2} y={centralArea.y + centralArea.h/2 + 4}
                textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="700" letterSpacing="1">
                {centralArea.label?.toUpperCase()}
              </text>
            </g>
          )}

          {/* Corridors — thick floor-like lines */}
          {corridors.map(c => c && (
            <line key={`cw-${c.key}`} x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
              stroke={c.onPath ? 'hsl(215 28% 28%)' : 'hsl(215 24% 18%)'} strokeWidth={c.onPath ? 12 : 8} strokeLinecap="round"/>
          ))}
          {corridors.map(c => c && (
            <line key={`cc-${c.key}`} x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
              stroke={c.onPath ? 'hsl(215 28% 34%)' : 'hsl(215 24% 21%)'} strokeWidth="1.5"
              strokeDasharray="4 6" opacity="0.5"/>
          ))}

          {/* Highlighted path — glowing amber */}
          {pathLines.map((line, i) => (
            <g key={`path-${i}`}>
              <motion.line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" opacity={0.15}
                initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: i * 0.1 }}/>
              <motion.line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: i * 0.1 }}/>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" className="dash-anim" opacity="0.7"/>
              <motion.g transform={`translate(${line.mid.x},${line.mid.y}) rotate(${Math.atan2(line.y2-line.y1,line.x2-line.x1)*180/Math.PI})`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.3 }}>
                <polygon points="-6,-3.5 6,0 -6,3.5" fill="#f59e0b" opacity="0.95"/>
              </motion.g>
            </g>
          ))}

          {/* Render all nodes */}
          {nodes.map(node => {
            const isOnPath   = pathSet.has(node.id);
            const isSelected = node.id === selectedNode;
            const isStart    = node.id === startNode;
            const isEnd      = node.id === endNode;
            const isGate     = node.type === 'gate';
            const isAmenity  = node.type === 'amenity';
            const isJunction = node.type === 'junction';
            const aSty = isAmenity && node.amenityType ? AMENITY_COLORS[node.amenityType] : null;

            if (isJunction) return (
              <circle key={node.id} cx={node.x} cy={node.y} r={isOnPath ? 5 : 4}
                fill={isOnPath ? '#f59e0b' : 'hsl(215 24% 28%)'} opacity={isOnPath ? 1 : 0.5}/>
            );

            return (
              <g key={node.id} onClick={() => {
                if (!isDraggingRef.current) onNodeClick?.(node);
              }} className={isAmenity ? 'cursor-pointer' : ''}>

                {/* Pulse rings for start/end */}
                {(isStart || isEnd) && (
                  <motion.circle cx={node.x} cy={node.y} r={24} fill="none"
                    stroke={isStart ? '#22c55e' : '#ef4444'} strokeWidth="2" opacity={0.25}
                    animate={{ r: [16, 26, 16], opacity: [0.4, 0.08, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}/>
                )}

                {/* Gate pill — larger */}
                {isGate && (
                  <>
                    <rect x={node.x - GATE_W/2} y={node.y - GATE_H/2} width={GATE_W} height={GATE_H} rx="6"
                      fill={isStart ? '#14532d' : isEnd ? '#7f1d1d' : isOnPath ? '#713f12' : 'hsl(215 26% 18%)'}
                      stroke={isStart ? '#22c55e' : isEnd ? '#ef4444' : isOnPath ? '#f59e0b' : 'hsl(215 24% 34%)'}
                      strokeWidth="2"
                      filter={isStart ? 'url(#glow-green)' : isEnd ? 'url(#glow-red)' : undefined}/>
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={isStart ? '#86efac' : isEnd ? '#fca5a5' : isOnPath ? '#fde68a' : '#e2e8f0'}
                      fontSize={GATE_FONT} fontFamily="monospace" fontWeight="800">
                      {node.name.replace('Gate ', '')}
                    </text>
                  </>
                )}

                {/* Amenity square — larger with bigger emoji & label */}
                {isAmenity && aSty && (
                  <>
                    {isSelected && <rect x={node.x - AMENITY_R - 5} y={node.y - AMENITY_R - 5}
                      width={(AMENITY_R + 5)*2} height={(AMENITY_R + 5)*2} rx="11"
                      fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.8"/>}
                    <rect x={node.x - AMENITY_R} y={node.y - AMENITY_R}
                      width={AMENITY_R * 2} height={AMENITY_R * 2} rx="8"
                      fill={isSelected || isOnPath ? aSty.stroke + '33' : aSty.bg}
                      stroke={aSty.stroke} strokeWidth={isSelected ? 2.5 : 2} opacity={isSelected ? 1 : 0.95}/>
                    <AmenityEmoji type={node.amenityType!} x={node.x} y={node.y} size={AMENITY_R} />
                    <text x={node.x} y={node.y + AMENITY_R + 10} textAnchor="middle"
                      fill={isSelected ? '#fbbf24' : '#cbd5e1'} fontSize={LABEL_FONT} fontFamily="monospace"
                      fontWeight="700">
                      {node.name.length > 11 ? node.name.slice(0, 10) + '…' : node.name}
                    </text>
                  </>
                )}

                {/* Security / entrance */}
                {(node.type === 'security' || node.type === 'entrance') && (
                  <>
                    <rect x={node.x - 26} y={node.y - 11} width={52} height={20} rx="5"
                      fill={node.type === 'security' ? '#1e3a5f' : '#1a2e1a'}
                      stroke={node.type === 'security' ? '#3b82f6' : '#22c55e'}
                      strokeWidth="1.5"/>
                    <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={node.type === 'security' ? '#93c5fd' : '#86efac'}
                      fontSize="9" fontFamily="monospace" fontWeight="700">
                      {node.type === 'security' ? '🔒 SEC' : '🚪 ENTRY'}
                    </text>
                  </>
                )}

                {/* YOU / DEST labels */}
                {isStart && (
                  <g>
                    <rect x={node.x - 17} y={node.y - 30} width={34} height={15} rx="4" fill="#14532d" opacity="0.97"/>
                    <text x={node.x} y={node.y - 19} textAnchor="middle" dominantBaseline="middle"
                      fill="#4ade80" fontSize="9" fontFamily="monospace" fontWeight="800">YOU</text>
                  </g>
                )}
                {isEnd && endNode !== startNode && (
                  <g>
                    <rect x={node.x - 24} y={node.y - 32} width={48} height={15} rx="4" fill="#7f1d1d" opacity="0.97"/>
                    <text x={node.x} y={node.y - 21} textAnchor="middle" dominantBaseline="middle"
                      fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="800">DEST</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default AirportMap;
