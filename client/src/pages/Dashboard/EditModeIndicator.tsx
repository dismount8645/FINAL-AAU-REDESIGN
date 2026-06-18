interface EditModeIndicatorProps {
  lang: string
}

function EditModeIndicator({ lang }: EditModeIndicatorProps) {
  return (
    <div className="mb-4 p-3 bg-primary/15 border-2 border-primary/30 rounded-[var(--radius-md)] font-bold text-primary shadow-sm text-sm">
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        <span>{lang === 'da' ? 'Redigeringstilstand:' : 'Edit mode:'}</span>
        <span className="font-medium text-primary/80">{lang === 'da' ? 'Du kan flytte og skjule widgets. Automatisk prioritering er slået fra, mens du redigerer.' : 'Move and hide widgets. Auto-priority is disabled while editing.'}</span>
      </span>
    </div>
  )
}

export default EditModeIndicator
