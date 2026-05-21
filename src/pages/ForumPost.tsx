import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import Stack from '@/components/ui/Stack'
import Button from '@/components/ui/Button'
import { Heading } from '@/components/ui/Typography'
import Grid from '@/components/ui/Grid'
import useStore from '@/store/useStore'
import {
  ForumOriginalPost,
  ForumRepliesList,
  ForumReplyForm,
  ForumAboutWidget,
} from './forumPost/index'

const posts = [
  { id: 1, titleDa: 'Spørgsmål til litteraturen i uge 2', titleEn: 'Questions regarding literature week 2', author: 'Mads Mikkelsen', timeDa: 'For 2 timer siden', timeEn: '2 hours ago', replies: 4, contentDa: 'Hej alle sammen. Jeg sidder og læser pensum for uge 2 og har et par spørgsmål til teksten. Kan nogen hjælpe mig med at forstå afsnittet om brugercentreret design?', contentEn: 'Hi everyone. I am reading the curriculum for week 2 and have a few questions about the text. Can anyone help me understand the section on user-centered design?' },
  { id: 2, titleDa: 'Søger gruppe til projekt 1', titleEn: 'Looking for group for project 1', author: 'Lærke Poulsen', timeDa: 'I går kl. 14:30', timeEn: 'Yesterday at 14:30', replies: 12, contentDa: 'Jeg søger 2-3 personer til projekt 1. Jeg har erfaring med HTML/CSS og lidt JavaScript. Skriv endelig hvis I mangler en gruppe.', contentEn: 'I am looking for 2-3 people for project 1. I have experience with HTML/CSS and some JavaScript. Please write if you are looking for a group.' },
  { id: 3, titleDa: 'Ændring af lokale til næste forelæsning', titleEn: 'Room change for next lecture', author: 'Morten Jensen', timeDa: 'I mandags', timeEn: 'Last Monday', replies: 0, contentDa: 'Kære studerende. Næste forelæsning er flyttet til lokale 4.109 på grund af tekniske problemer i det oprindelige lokale.', contentEn: 'Dear students. The next lecture has been moved to room 4.109 due to technical issues in the original room.', important: true },
]

const replies = [
  { id: 1, author: 'Anders Nielsen', roleDa: 'Studerende', roleEn: 'Student', timeDa: 'For 1 time siden', timeEn: '1 hour ago', contentDa: 'Godt spørgsmål! Jeg har også tænkt over det samme. Prøv at kigge på side 42 i pensumbogen.', contentEn: 'Great question! I have been thinking about the same thing. Try looking at page 42 in the textbook.' },
  { id: 2, author: 'Mette Jensen', roleDa: 'Studerende', roleEn: 'Student', timeDa: 'For 45 minutter siden', timeEn: '45 minutes ago', contentDa: 'Jeg kan også anbefale at se videoen fra uge 1 - den forklarer konceptet rigtig godt.', contentEn: 'I also recommend watching the video from week 1 - it explains the concept really well.' },
]

function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, localize } = useStore()
  const post = posts.find((p) => p.id === Number(id))

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
        <Button variant="tertiary" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          {t('back_to_forum')}
        </Button>
      </PageHeader>

      <Grid>
        <Grid.Item span={8}>
          <ForumOriginalPost post={post} />

          <ForumRepliesList replies={replies} />

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

