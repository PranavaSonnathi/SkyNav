import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface GateChangeAlertProps {
  oldGate: string;
  newGate: string;
  onDismiss: () => void;
  onNavigate: () => void;
}

const GateChangeAlert = ({ oldGate, newGate, onDismiss, onNavigate }: GateChangeAlertProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <div className="rounded-2xl border border-warning/30 bg-warning/10 backdrop-blur-xl p-5 shadow-glow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-bold text-foreground">Gate Change Detected</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Your gate has changed from <span className="font-semibold text-foreground">{oldGate}</span>
              <ArrowRight className="inline w-3 h-3 mx-1" />
              <span className="font-semibold text-warning">{newGate}</span>
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={onNavigate}
                className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Navigate to New Gate
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-xs font-medium hover:bg-secondary/50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GateChangeAlert;
