import { Component, ErrorInfo, ReactNode, KeyboardEvent } from 'react';
import Card from '@/components/Card';
import { Text } from '@/components/Typography';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import Stack from '@/components/Stack';
import useStore from '@/lib/store';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional name for easier debugging */
  name?: string;
}

/** Simple state interface – we only need to know if an error occurred */
interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary er en klassisk React error‑boundary som fanger uventede fejl
 * i under‑træet og viser en bruger‑venlig fallback.
 *
 * - Den logger fejlen til console (kan udvides til ekstern logging).
 * - Den giver en “prøv igen”‑knap som nulstiller tilstanden.
 * - Når fallback‑prop er angivet, renderes den i stedet for den interne
 *   fallback‑UI.
 *
 * Vi tilføjer også tastatur‑support (Enter) for at gøre reset‑knappen
 * tilgængelig for keyboard‑brugere.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  /** Når en fejl kastes, opdateres state så render‑metoden viser fallback. */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /** Log fejl til konsol – kan udvides til fjern‑logning senere. */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Uncaught error in ${this.props.name || 'Component'}:`,
      error,
      errorInfo
    );
  }

  /** Nulstil error‑state – kaldes fra knappen eller fra tastatur. */
  private handleReset = () => {
    this.setState({ hasError: false });
  };

  /** Tastatur‑handler for at aktivere reset med Enter‑tasten. */
  private handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return <ErrorDisplay onReset={this.handleReset} onKeyDown={this.handleKeyDown} />;
    }

    return this.props.children;
  }
}

/**
 * UI‑komponent til visning af fejl.
 * - Bruger Card med variant="outlined" for konsistent styling.
 * - Tilgængelighed: role="alert", aria‑live="assertive".
 * - Knappen har både onClick og onKeyDown for fuld tastatur‑support.
 */
function ErrorDisplay({
  onReset,
  onKeyDown,
}: {
  onReset: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const t = useStore(state => state.t)

  return (
    <Card
      variant="outlined"
      className="p-lg flex flex-col items-center justify-center text-center gap-md min-h-[150px] w-full"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="text-danger" size={32} aria-hidden="true" />
      <Stack gap="2xs">
        <Text weight="bold">{t('error_title')}</Text>
        <Text size="sm" muted>
          {t('error_message')}
        </Text>
      </Stack>
      <Button
        variant="secondary"
        size="sm"
        type="button"
        icon={RefreshCw}
        onClick={onReset}
        onKeyDown={onKeyDown}
        aria-label={t('try_again')}
      >
        {t('try_again')}
      </Button>
    </Card>
  );
}

export default ErrorBoundary;
