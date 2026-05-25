import { type LucideIcon } from 'lucide-react'

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
      className={`segmented-control relative flex p-0.5 bg-bg-input border border-border rounded-[var(--radius-md)] h-[38px] w-full overflow-hidden my-xs ${className}`}
      onClick={handleContainerClick}
    >
      <div
        className="segmented-control__slider absolute top-0.5 bottom-0.5 left-0.5 bg-bg-card rounded-[calc(var(--radius-md)-2px)] transition-transform duration-200 z-1 shadow-[var(--shadow-sm)]"
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
          {option.img && <img src={option.img} alt="" className="w-6 h-6 object-contain rounded-[var(--radius-sm)] shadow-xs transition-transform duration-200 hover:scale-110" />}
          {option.label && <span className="text-[0.85rem] leading-none">{option.label}</span>}
        </button>
        );
      })}
    </div>
  );
}
