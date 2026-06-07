

import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link, useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';
import { ForumOriginalPost, ForumRepliesList, ForumReplyForm } from '@/components/Forum';
import ForumAboutWidget from '@/components/Widgets/ForumAboutWidget';
import Button from '@/components/ui/Button';
import { Grid } from '@/components/Layout/LayoutPrimitives';
import PageHeader from '@/components/Layout/PageHeader';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading } from '@/components/ui';
import { mockForumPosts, mockForumReplies } from '@/lib/data';
import useStore from '@/store';

function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const t = useStore(state => state.t)
  const localize = useStore(state => state.localize)
  const post = useMemo(() => mockForumPosts.find((p) => p.id === Number(id)), [id])

  if (!post) {
    return (
      <Stack align="center" justify="center" className="container min-h-[60vh]">
        <Stack align="center" gap="md">
          <Heading level={1}>{t('forum_post_not_found')}</Heading>
          <Link to="/">
            <Button variant="primary">{t('dashboard')}</Button>
          </Link>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack className="container animate-fade-in">
      <PageHeader
        title={localize(post, 'title')}
        subtitle={`${t('by')} ${post.author} — ${localize(post, 'time')}`}
        breadcrumbs={[
          { label: t('dashboard'), href: '/' },
          { label: t('course_forum') },
          { label: localize(post, 'title') },
        ]}
      >
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          {t('back_to_forum')}
        </Button>
      </PageHeader>

      <Grid>
        <Grid.Item span={8}>
          <ForumOriginalPost post={post} />

          <ForumRepliesList replies={mockForumReplies} />

          <ForumReplyForm />
        </Grid.Item>

        <Grid.Item span={4}>
          <ForumAboutWidget post={post} />
        </Grid.Item>
      </Grid>
    </Stack>
  )
}

export default ForumPost


if (import.meta.vitest) {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useParams: vi.fn(),
    }
  })
  
  const renderForumPost = (id = '1') => {
    vi.mocked(useParams).mockReturnValue({ id })
    return render(
      <MemoryRouter initialEntries={[`/forum/${id}`]}>
        <Routes>
          <Route path="/forum/:id" element={<ForumPost />} />
        </Routes>
      </MemoryRouter>
    )
  }
  describe('ForumPost', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      useStore.setState({ lang: 'da', t: (key: string) => key })
    })
  
    it('renders post content for a valid ID', () => {
      renderForumPost('1')
      expect(screen.getAllByText(/Spørgsmål til litteraturen i uge 2/i).length).toBeGreaterThan(0)
    })
  
    it('renders not found for invalid ID', () => {
      renderForumPost('999')
      expect(screen.getByText('forum_post_not_found')).toBeInTheDocument()
    })
  
    it('renders author and timestamp', () => {
      renderForumPost('1')
      expect(screen.getAllByText(/Mads Mikkelsen/i).length).toBeGreaterThan(0)
    })
  
    it('renders replies for a post with replies', () => {
      renderForumPost('1')
      expect(screen.getByText(/Anders Nielsen/i)).toBeInTheDocument()
    })
  
    it('renders in English', () => {
      useStore.setState({ lang: 'en' })
      renderForumPost('1')
      expect(screen.getAllByText(/Questions regarding literature week 2/i).length).toBeGreaterThan(0)
    })
  
    it('renders back link', () => {
      renderForumPost('1')
      expect(screen.getByText('back_to_forum')).toBeInTheDocument()
    })


  })
}
