import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Calendar, UserCheck, MapPin } from 'lucide-react';
import Badge from '@/components/Badge';

export interface ModuleHeaderProps {
  image?: string
  code?: string
  title?: string
  professor?: string
  semester?: string
  campus?: string
}

export default function ModuleHeader({
  image,
  code,
  title,
  professor,
  semester,
  campus,
}: ModuleHeaderProps) {
  return (
    <header className="relative p-[var(--space-lg)] sm:p-[var(--space-lg)] lg:p-10 rounded-2xl overflow-hidden bg-cover bg-center text-white shadow-[var(--shadow-xl)] group min-h-[160px] flex flex-col justify-end" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-aau-blue/95 via-aau-blue/80 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="relative flex flex-col gap-xs">
        {code ? (
          <Badge className="w-fit font-black tracking-widest bg-white/20 backdrop-blur-md text-white border-none px-2xs py-0.5 text-[10px] uppercase">
            {code}
          </Badge>
        ) : null}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black m-0 tracking-tight leading-none drop-shadow-[var(--shadow-md)]">
          {title}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/80 mt-[var(--space-2xs)]">
          {semester ? <span className="flex items-center gap-[var(--space-sm)]"><Calendar size={14} strokeWidth={2} className="text-white/60" /> {semester}</span> : null}
          {professor ? <span className="flex items-center gap-[var(--space-sm)]"><UserCheck size={14} strokeWidth={2} className="text-white/60" /> {professor}</span> : null}
          {campus ? <span className="flex items-center gap-[var(--space-sm)]"><MapPin size={14} strokeWidth={2} className="text-white/60" /> {campus}</span> : null}
        </div>
      </div>
    </header>
  )
}

if (import.meta.vitest) {
  describe('ModuleHeader', () => {
    it('renders title', () => {
      render(<ModuleHeader title="Header" />)
      expect(screen.getByText('Header')).toBeInTheDocument()
    })
  })
}
