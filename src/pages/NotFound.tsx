import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion, GraduationCap, LifeBuoy, LayoutDashboard } from 'lucide-react'
import Stack from '@/components/ui/Stack'
import { Text } from '@/components/ui/Typography'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import PageHeader from '@/components/common/PageHeader'
import useStore from '@/store/useStore'

function NotFound() {
  const navigate = useNavigate()
  const { t } = useStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <Stack className="container pb-[var(--space-2xl)]">
      <PageHeader
        pageKey="not_found"
        title={t('page_not_found')}
        subtitle={t('page_not_found_desc')}
        flat
      />

      <div className="flex justify-center py-xl">
        <Stack align="center" gap="lg" className="max-w-2xl w-full text-center">
          {/* Visual Header */}
          <div className="relative mb-[var(--space-md)]">
            <div className="p-[var(--space-lg)] rounded-[var(--radius-pill)] bg-primary/5 dark:bg-primary/10 animate-pulse-slow">
              <FileQuestion size={24} strokeWidth={2} className="text-primary opacity-20 dark:opacity-40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-[var(--space-md)]">
               <span className="text-5xl font-bold text-primary/90 dark:text-primary drop-shadow-[var(--shadow-xl)]">404</span>
            </div>
          </div>

          {/* Search Recovery */}
          <div className="w-full max-w-lg px-sm">
            <SearchInput
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              iconSize={20}
            />
          </div>
          <Text size="xs" weight="bold" className="mt-[var(--space-md)] text-text-disabled uppercase tracking-widest block w-full text-center whitespace-nowrap">
            {t('or_try_shortcuts')}
          </Text>

          {/* Action Buttons */}
          <Stack direction="row" gap="md" wrap className="justify-center px-sm w-full sm:w-auto">
            <Button variant="primary" onClick={() => navigate('/')} size="md" icon={LayoutDashboard} pill className="w-full sm:w-auto shadow-[var(--shadow-lg)] shadow-primary/20">
              {t('go_to_dashboard')}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/courses')} size="md" icon={GraduationCap} pill className="w-full sm:w-auto bg-bg-card shadow-[var(--shadow-md)]">
              {t('find_modules')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/support')} size="md" icon={LifeBuoy} pill className="w-full sm:w-auto">
              {t('contact_support')}
            </Button>
          </Stack>
        </Stack>
      </div>
    </Stack>
  )
}

export default NotFound
