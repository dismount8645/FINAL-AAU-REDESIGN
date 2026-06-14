import { useState, useEffect, useRef } from 'react';
import { Text } from '@/components/ui';
import { Check, AlertCircle } from 'lucide-react';

interface AutosaveStatusProps {
  /** Increment to trigger "Gemt" flash */
  changeCount: number;
}

/**
 * Idle: "Gemmes automatisk"
 * Flash (2s after changeCount bump): "Gemt" with checkmark
 * Error (not yet wired, placeholder): shows error
 */
export default function AutosaveStatus({ changeCount }: AutosaveStatusProps) {
  const [showSaved, setShowSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (changeCount <= 0) return;
    setShowSaved(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timerRef.current);
  }, [changeCount]);

  if (showSaved) {
    return (
      <Text size="xs" className="text-success font-semibold flex items-center gap-3xs">
        <Check size={12} strokeWidth={3} />
        Gemt
      </Text>
    );
  }

  return (
    <Text size="xs" muted className="flex items-center gap-3xs">
      Gemmes automatisk
    </Text>
  );
}
