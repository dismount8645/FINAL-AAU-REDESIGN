import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { type LucideIcon, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SegmentedControlOption {
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  img?: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string | number;
  onChange: (val: string | number) => void;
  className?: string;
  containerClickRotates?: boolean;
}

export default function SegmentedControl({ options, value, onChange, className = '', containerClickRotates = false }: SegmentedControlProps) {
  const activeIndex = options.findIndex(opt => opt.value === value);
  const sliderWidth = 100 / options.length;

  const handleContainerClick = () => {
    if (containerClickRotates) {
      const nextIndex = (activeIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    }
  };

  return (
    <div
      className={cn('segmented-control relative flex p-0.5 bg-bg-input border border-border rounded-[var(--radius-md)] h-[38px] w-full overflow-hidden my-xs', className)}
      onClick={handleContainerClick}
    >
      <div
        className="segmented-control__slider absolute top-0.5 bottom-0.5 left-0.5 bg-bg-card rounded-[calc(var(--radius-md)-2px)] transition-transform duration-150 z-1 shadow-[var(--shadow-sm)]"
        style={{
          width: `calc(${sliderWidth}% - 4px)`,
          transform: `translateX(calc(${activeIndex * 100}%))`,
        }}
      />
      {options.map((option) => {
        const OptionIcon = option.icon;
        return (
        <button
          key={String(option.value)}
          type="button"
          className={[
            'segmented-control__option relative flex-1 flex items-center justify-center gap-xs border-none bg-transparent cursor-pointer z-2 text-[0.85rem] font-medium transition-colors duration-150 px-xs active:scale-95 focus-visible:outline-none focus-visible:shadow-focus rounded-sm before:absolute before:top-1/2 before:left-1/2 before:min-h-[44px] before:min-w-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-[\'\']',
            value === option.value 
              ? 'segmented-control__option--active text-primary' 
              : 'text-text-muted hover:text-text-main',
          ].filter(Boolean).join(' ')}
          onClick={(e) => {
            e.stopPropagation();
            onChange(option.value);
          }}
          title={option.label}
        >
          {OptionIcon && <OptionIcon size={16} strokeWidth={2} aria-hidden="true" />}
          {option.img && <img src={option.img} alt="" className="w-6 h-6 object-contain rounded-[var(--radius-sm)] shadow-xs transition-transform duration-150 hover:scale-110" />}
          {option.label && <span className="text-[0.85rem] leading-none">{option.label}</span>}
        </button>
        );
      })}
    </div>
  );
}

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

if (import.meta.vitest) {
  describe('SegmentedControl', () => {
    it('renders all options', () => {
      render(<SegmentedControl options={options} value="day" onChange={vi.fn()} />)
      expect(screen.getByText('Day')).toBeInTheDocument()
      expect(screen.getByText('Week')).toBeInTheDocument()
      expect(screen.getByText('Month')).toBeInTheDocument()
    })
  
    it('calls onChange with the correct value when an option is clicked', () => {
      const onChange = vi.fn()
      render(<SegmentedControl options={options} value="day" onChange={onChange} />)
      fireEvent.click(screen.getByText('Week'))
      expect(onChange).toHaveBeenCalledWith('week')
    })
  
    it('renders with icons when provided', () => {
      const iconOptions = [
        { value: 1, icon: Sun, label: 'Sun' },
        { value: 2, icon: Moon, label: 'Moon' },
      ]
      const { container } = render(<SegmentedControl options={iconOptions} value={1} onChange={vi.fn()} />)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBe(2)
    })
  
    it('renders with images when provided', () => {
      const imgOptions = [
        { value: 'a', img: '/a.png', label: 'A' },
        { value: 'b', img: '/b.png', label: 'B' },
      ]
      const { container } = render(<SegmentedControl options={imgOptions} value="a" onChange={vi.fn()} />)
      const imgs = container.querySelectorAll('img')
      expect(imgs.length).toBe(2)
      expect(imgs[0]).toHaveAttribute('src', '/a.png')
    })
  
    it('applies active class to the selected option', () => {
      render(<SegmentedControl options={options} value="week" onChange={vi.fn()} />)
      const activeOption = screen.getByText('Week').closest('button')
      expect(activeOption?.classList.contains('segmented-control__option--active')).toBe(true)
    })
  
    it('renders with custom className', () => {
      const { container } = render(
        <SegmentedControl options={options} value="day" onChange={vi.fn()} className="custom-class" />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })
  
    it('rotates value when containerClickRotates is true and container is clicked', () => {
      const onChange = vi.fn()
      render(<SegmentedControl options={options} value="day" onChange={onChange} containerClickRotates />)
  
      const container = document.querySelector('.segmented-control')!
      fireEvent.click(container)
  
      expect(onChange).toHaveBeenCalledWith('week')
    })
  
    it('does not rotate when containerClickRotates is false', () => {
      const onChange = vi.fn()
      render(<SegmentedControl options={options} value="day" onChange={onChange} />)
  
      const container = document.querySelector('.segmented-control')!
      fireEvent.click(container)
  
      expect(onChange).not.toHaveBeenCalled()
    })
  })
}
