import { Search } from 'lucide-react';
import { Card, Text, Button } from '@/components/ui';
import { env } from '@/lib/env';

interface ResourcesSidebarProps {
  lang: string;
}

function ResourcesSidebar({ lang }: ResourcesSidebarProps) {
  return (
    <aside className="flex flex-col gap-lg">
      <Card variant="elevated" className="border-primary/20">
        <Card.Header padding="compact" className="flex items-center gap-xs">
          <Search size={18} className="text-primary" />
          <Text weight="bold" size="md">
            {lang === 'da' ? 'Kan du ikke finde systemet?' : "Can't find the system?"}
          </Text>
        </Card.Header>
        <Card.Body padding="compact" className="flex flex-col gap-sm">
          <Text size="sm" className="text-text-muted leading-[1.6]">
            {lang === 'da'
              ? 'Søg efter system, opgave eller nøgleord — fx "eksamen", "mail" eller "software".'
              : 'Search by system, task or keyword — e.g. "exam", "mail" or "software".'}
          </Text>
          <div className="flex flex-col gap-xs mt-xs">
            <Button
              variant="primary"
              size="sm"
              onClick={() => env.open('https://support.its.aau.dk/')}
              className="normal-case tracking-normal font-bold"
            >
              {lang === 'da' ? 'Kontakt IT-support' : 'Contact IT support'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => env.open('https://support.its.aau.dk/')}
              className="text-primary normal-case tracking-normal font-bold"
            >
              {lang === 'da' ? 'Besøg help-portalen' : 'Visit the help portal'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </aside>
  )
}

export default ResourcesSidebar
