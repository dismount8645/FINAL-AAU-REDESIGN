import { memo } from 'react';
import { Check } from 'lucide-react';
import { Button, Text } from '@/components/ui';
import { cn, ITEM_TYPE_MAP } from '@/lib/utils';
import type { CourseItem } from '@/lib/types';

interface LiteratureItemRowProps {
  item: CourseItem;
  isCompleted: boolean;
  lang: string;
  toggleItem: (id: number) => void;
  t: (key: string) => string;
}

const LiteratureItemRow = memo(function LiteratureItemRow({
  item,
  isCompleted,
  lang,
  toggleItem,
  t,
}: LiteratureItemRowProps) {
  const themeConfig = ITEM_TYPE_MAP[item.type] || ITEM_TYPE_MAP.default;
  const Icon = themeConfig.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-sm rounded-xl border transition-all duration-150 relative group",
        isCompleted
          ? "bg-success/5 border-success/30 dark:border-success/20 hover:bg-success/10"
          : "bg-bg-card border-border hover:bg-bg-hover hover:border-primary/45"
      )}
    >
      <div className="flex items-center gap-sm min-w-0 flex-1">
        <div className={cn(
          "p-xs rounded-lg shrink-0",
          isCompleted ? "bg-success/15 text-success" : "bg-primary/5 text-primary"
        )}>
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <Text size="xs" weight="bold" className="block truncate leading-tight text-main">
            {lang === 'da' ? item.title : item.titleEn}
          </Text>
          <Text size="3xs" muted className="block leading-none mt-3xs">
            {item.size || (item.type === 'link' ? 'Link' : 'Resource')}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-xs shrink-0">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block",
          isCompleted ? "text-success" : "text-text-secondary opacity-60"
        )}>
          {isCompleted
            ? (lang === 'da' ? 'Fuldført' : 'Completed')
            : (lang === 'da' ? 'Ikke fuldført' : 'Not completed')}
        </span>
        <Button
          variant={isCompleted ? 'primary' : 'ghost'}
          size="icon"
          className="lesson-item__checkbox w-7 h-7 shrink-0 border-border hover:border-primary/50 dark:border-white/20"
          onClick={() => toggleItem(item.id)}
          aria-label={isCompleted ? t('mark_incomplete') : t('mark_complete')}
          type="button"
        >
          {isCompleted ? (
            <Check size={16} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Check
              size={16}
              strokeWidth={2.5}
              aria-hidden="true"
              className="opacity-0 group-hover:opacity-30 transition-opacity"
            />
          )}
        </Button>
      </div>
    </div>
  );
});

export default LiteratureItemRow;
