import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface NavigationBlockerDialogProps {
  open: boolean
  onSaveAndProceed: () => void
  onDiscardAndProceed: () => void
  onCancelNavigation: () => void
  lang: string
}

function NavigationBlockerDialog({ open, onSaveAndProceed, onDiscardAndProceed, onCancelNavigation, lang }: NavigationBlockerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancelNavigation(); }}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {lang === 'da' ? 'Ugemte ændringer' : 'Unsaved changes'}
          </DialogTitle>
          <DialogDescription>
            {lang === 'da'
              ? 'Du har foretaget ændringer i dit dashboard-layout. Vil du gemme eller kassere dem, før du forlader siden?'
              : 'You have made changes to your dashboard layout. Do you want to save or discard them before leaving?'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-wrap gap-xs justify-end mt-xs">
          <Button variant="ghost" size="sm" onClick={onCancelNavigation}>
            {lang === 'da' ? 'Bliv på siden' : 'Stay on page'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onDiscardAndProceed}>
            {lang === 'da' ? 'Kassér ændringer' : 'Discard changes'}
          </Button>
          <Button variant="primary" size="sm" onClick={onSaveAndProceed}>
            {lang === 'da' ? 'Gem ændringer' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NavigationBlockerDialog
