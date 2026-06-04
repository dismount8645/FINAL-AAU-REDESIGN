import { memo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface CourseBreadcrumbsProps {
  id: string
  t: (key: string) => string
}

function CourseBreadcrumbs({ id, t }: CourseBreadcrumbsProps) {
  return (
    <nav className="flex items-center flex-wrap gap-3xs text-sm text-muted mb-md">
      <Fragment>
        <Link to="/" className="hover:text-primary hover:underline transition-colors">{t('dashboard')}</Link>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0" />
        <Link to="/courses" className="hover:text-primary hover:underline transition-colors">{t('courses')}</Link>
        <ChevronRight size={14} strokeWidth={2} className="shrink-0" />
        <span className="text-main truncate max-w-[200px] sm:max-w-none">{t(`course_${id}_title`)}</span>
      </Fragment>
    </nav>
  )
}

export default memo(CourseBreadcrumbs)
