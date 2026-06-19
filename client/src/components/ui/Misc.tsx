import { type ReactNode, type HTMLAttributes, forwardRef, memo, type SVGProps } from 'react';
import { type LucideIcon, HelpCircle, CloudUpload, File, CheckSquare, Settings, Search, ChevronUp, ChevronDown, Calendar, UserCheck, MapPin } from 'lucide-react';
import { Heading, Text } from './Typography';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { cn } from '@/lib/utils';

// ── EmptyState ───────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, message, description, action, className }: EmptyStateProps) {
  const displayMessage = message || description

  return (
    <div className={cn("flex flex-col items-center p-xl border-dashed rounded-[var(--radius-md)] bg-card", className)}>
      {Icon ? <Icon size={24} strokeWidth={2} className="text-muted mb-sm" aria-hidden="true" /> : null}
      <Heading level={4} className="mb-md font-semibold">{title}</Heading>
      {displayMessage ? <Text size="sm" className="text-main">{displayMessage}</Text> : null}
      <div className="mt-md">{action}</div>
    </div>
  )
}

// ── HighlightText ────────────────────────────────────────────────────────────

interface HighlightTextProps {
  text: string
  query: string
}

export function HighlightText({ text, query }: HighlightTextProps) {
  if (!query) return <>{text}</>
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong
            key={i}
            className="font-black text-primary dark:text-accent bg-primary/10 dark:bg-accent/20 px-0.5 rounded-[var(--radius-sm)]"
          >
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}

// ── KeyValue ─────────────────────────────────────────────────────────────────

export interface KeyValueProps {
  label: string
  value: ReactNode
  divider?: boolean
  className?: string
}

export function KeyValue({ label, value, divider, className = '' }: KeyValueProps) {
  return (
    <div className={['flex justify-between items-center py-xs', divider ? 'border-b border-border pb-sm' : '', className].filter(Boolean).join(' ')}>
      <Text size="sm" className="m-0">{label}</Text>
      <Text size="sm" weight="bold" className="m-0">{value}</Text>
    </div>
  )
}

// ── SectionHeader ────────────────────────────────────────────────────────────

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  actions?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, description, level = 2, actions, className = '' }: SectionHeaderProps) {
  const desc = description ?? subtitle
  return (
    <div className={cn('mb-lg', className)}>
      <Stack direction="row" align="center" justify="between">
        <Stack gap="2xs">
          <Heading level={level} className="m-0">{title}</Heading>
          {desc ? <Text size="sm" muted className="m-0 leading-normal">{desc}</Text> : null}
        </Stack>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </Stack>
    </div>
  )
}

// ── ProgressBar ──────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  value?: number
  color?: string
  height?: number
  showLabel?: boolean | string
  "aria-label"?: string
  className?: string
}

export function ProgressBar({
  value = 0,
  color,
  height = 6,
  showLabel,
  "aria-label": ariaLabel,
  className,
}: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div
      className={cn("flex items-center gap-sm", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      aria-label={ariaLabel}
    >
      <div
        className="w-full rounded-pill overflow-hidden"
        style={{ height, backgroundColor: 'var(--color-bg-placeholder)' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${safeValue}%`,
            background: color || 'var(--color-primary)',
          }}
        />
      </div>
      {showLabel ? (
        <span className="text-xs">
          {showLabel === true ? `${safeValue}%` : showLabel}
        </span>
      ) : null}
    </div>
  )
}

// ── Badge ────────────────────────────────────────────────────────────────────

interface BadgeVariantProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  pill?: boolean;
  interactive?: boolean;
}

function badgeVariants({ variant = 'default', pill = false, interactive = false }: BadgeVariantProps = {}) {
  const base = "inline-flex items-center justify-center px-[var(--space-xs)] h-[var(--space-md)] rounded-[var(--radius-sm)] text-[0.625rem] font-black uppercase tracking-[0.05em] leading-none border border-transparent whitespace-nowrap isolate transition-all duration-150 ease-[var(--transition-ease)]";
  
  const variants = {
    default: "bg-bg-highlight text-main border-[var(--border-color)]/60",
    primary: "bg-primary text-white shadow-sm",
    secondary: "bg-primary/10 text-primary dark:text-indigo-200",
    success: "bg-[var(--aau-dark-green)]/10 text-[var(--aau-dark-green)]",
    warning: "bg-[var(--aau-dark-orange)]/10 text-[var(--aau-dark-orange)]",
    danger: "bg-[var(--aau-dark-pink)]/10 text-[var(--aau-dark-pink)]",
    info: "bg-[var(--aau-light-blue)]/10 text-[var(--aau-light-blue)]",
    outline: "bg-transparent border-[var(--border-color)] text-muted",
  };

  return cn(
    base,
    variants[variant],
    pill && "rounded-[var(--radius-full)] px-[var(--space-sm)]",
    interactive && "cursor-pointer hover:scale-105 hover:-translate-y-1 active:scale-95"
  );
}

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    BadgeVariantProps {}

export const Badge = memo(forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, pill, interactive, children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        className={cn("badge", badgeVariants({ variant, pill, interactive }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
))

Badge.displayName = "Badge"

// ── Icon ─────────────────────────────────────────────────────────────────────

const iconNameMap: Record<string, LucideIcon> = {
  'cloud-arrow-up': CloudUpload,
  'file': File,
  'square-check': CheckSquare,
  'gear': Settings,
  'magnifying-glass': Search,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  icon?: LucideIcon
  name?: string
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  label?: string
  strokeWidth?: number
}

const sizeMap: Record<string, number> = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
}

const variantColors: Record<string, string> = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
  muted: 'text-muted',
}

export function Icon({
  icon: IconComponent,
  name,
  variant,
  size = 'md',
  label,
  className,
  style,
  ...props
}: IconProps) {
  const FinalIcon = IconComponent || (name ? iconNameMap[name] : undefined) || HelpCircle

  return (
    <FinalIcon
      size={sizeMap[size]}
      strokeWidth={2}
      className={cn(
        'inline-flex items-center justify-center leading-none transition-colors duration-150 shrink-0',
        variant ? variantColors[variant] : '',
        className
      )}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={style}
      {...props}
    />
  )
}

export interface IconCircleProps {
  icon: LucideIcon;
  bg?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function IconCircle({ icon: IconComponent, bg, color, size = 48, className }: IconCircleProps) {
  const px = size
  const iconSize = size * 0.5

  return (
    <Stack
      align="center"
      justify="center"
      className={cn("icon-circle shrink-0 rounded-[var(--radius-pill)] transition-colors", className)}
      style={{
        background: bg,
        color: color,
        width: `${px}px`,
        height: `${px}px`,
      }}
    >
      <IconComponent size={iconSize} strokeWidth={2} aria-hidden="true" />
    </Stack>
  )
}

// ── ModuleHeader ─────────────────────────────────────────────────────────────

export interface ModuleHeaderProps {
  image?: string
  code?: string
  title?: string
  professor?: string
  semester?: string
  campus?: string
}

export function ModuleHeader({
  image,
  code,
  title,
  professor,
  semester,
  campus,
}: ModuleHeaderProps) {
  return (
    <header className="relative p-md sm:p-md lg:p-6 rounded-2xl overflow-hidden bg-cover bg-center text-white shadow-[var(--shadow-xl)] group min-h-[120px] flex flex-col justify-end" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/95 via-[var(--color-primary)]/80 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
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
