import type { CourseItem } from '@/types'

interface CourseSection {
  id: string
  title: string
  titleEn: string
  items: CourseItem[]
}

interface CourseRaw {
  title: string
  titleEn: string
  code: string
  professor: string
  email: string
  img: string
  sections: CourseSection[]
}

const rawCourseData: Record<number, Omit<CourseRaw, 'sections'> & { sections: { id: string; title: string; titleEn: string; items: { id: number; type: string; title: string; titleEn: string; size?: string; duration?: string; deadline?: string }[] }[] }> = {
  1: {
    title: 'Digital Design og Kommunikation',
    titleEn: 'Digital Design and Communication',
    code: 'DD101',
    professor: 'Morten Jensen',
    email: 'mj@create.aau.dk',
    img: '/assets/img/grafik/billeder/Undervisning/_2WB0207.webp',
    sections: [
      {
        id: 's1',
        title: 'Uge 1: Introduktion til Digital Design',
        titleEn: 'Week 1: Introduction to Digital Design',
        items: [
          { id: 101, type: 'pdf', title: 'Kursusbeskrivelse og pensum', titleEn: 'Course Description and Syllabus', size: '1.2 MB' },
          { id: 102, type: 'video', title: 'Velkomstvideo fra underviser', titleEn: 'Welcome Video from Instructor', duration: '5:30' },
          { id: 103, type: 'link', title: 'Link til ekstern læringsressource', titleEn: 'Link to external learning resource' },
        ],
      },
      {
        id: 's2',
        title: 'Uge 2: Brugercentreret Design',
        titleEn: 'Week 2: User-Centered Design',
        items: [
          { id: 104, type: 'pdf', title: 'Slides: Designprocesser', titleEn: 'Slides: Design Processes', size: '4.5 MB' },
          { id: 105, type: 'assignment', title: 'Aflevering: Designskitse', titleEn: 'Assignment: Design Sketch', deadline: 'Fredag kl. 12:00' },
        ],
      },
    ],
  },
  2: {
    title: 'Webudvikling og CMS',
    titleEn: 'Web Development and CMS',
    code: 'WEB202',
    professor: 'Lise Sørensen',
    email: 'ls@create.aau.dk',
    img: '/assets/img/grafik/billeder/Forskning/_DSC0400.webp',
    sections: [
      {
        id: 'w1',
        title: 'Modul 1: HTML & CSS Fundamentals',
        titleEn: 'Module 1: HTML & CSS Fundamentals',
        items: [
          { id: 201, type: 'pdf', title: 'Guide: Semantisk HTML', titleEn: 'Guide: Semantic HTML', size: '0.8 MB' },
          { id: 202, type: 'video', title: 'CSS Flexbox & Grid Masterclass', titleEn: 'CSS Flexbox & Grid Masterclass', duration: '45:00' },
        ],
      },
      {
        id: 'w2',
        title: 'Modul 2: React & State Management',
        titleEn: 'Module 2: React & State Management',
        items: [
          { id: 203, type: 'link', title: 'React Documentation (Official)', titleEn: 'React Documentation (Official)' },
          { id: 204, type: 'assignment', title: 'Projekt: Byg en To-Do App', titleEn: 'Project: Build a To-Do App', deadline: 'Mandag kl. 09:00' },
        ],
      },
    ],
  },
  3: {
    title: 'Videnskabsteori',
    titleEn: 'Philosophy of Science',
    code: 'VT303',
    professor: 'Anders Nielsen',
    email: 'an@hum.aau.dk',
    img: '/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.webp',
    sections: [
      {
        id: 'v1',
        title: 'Introduktion til Videnskabsteori',
        titleEn: 'Introduction to Philosophy of Science',
        items: [
          { id: 301, type: 'pdf', title: 'Kuhn: Videnskabelige revolutioner', titleEn: 'Kuhn: Scientific Revolutions', size: '3.2 MB' },
          { id: 302, type: 'pdf', title: 'Popper: Falsifikationisme', titleEn: 'Popper: Falsificationism', size: '2.8 MB' },
        ],
      },
      {
        id: 'v2',
        title: 'Videnskabelige Metoder',
        titleEn: 'Scientific Methods',
        items: [
          { id: 303, type: 'video', title: 'Forelæsning: Kvalitativ vs Kvantitativ', titleEn: 'Lecture: Qualitative vs Quantitative', duration: '1:15:00' },
        ],
      },
    ],
  },
}

export const courseData = rawCourseData as unknown as Record<number, CourseRaw>

export const participantsData = [
  { name: 'Mette Jensen', role: 'student' as const },
  { name: 'Anders Nielsen', role: 'student' as const },
  { name: 'Sofie Pedersen', role: 'student' as const },
  { name: 'Emil Hansen', role: 'student' as const },
  { name: 'Laura Madsen', role: 'student' as const },
  { name: 'Oliver Christensen', role: 'student' as const },
  { name: 'Emma Rasmussen', role: 'student' as const },
  { name: 'Morten Jensen', role: 'teacher' as const },
]

export const courseTabItems = [
  { key: 'modules', label: 'tab_modules' },
  { key: 'forum', label: 'tab_forums' },
  { key: 'resources', label: 'tab_resources' },
  { key: 'info', label: 'tab_info' },
  { key: 'participants', label: 'tab_participants' },
  { key: 'pbl', label: 'tab_pbl_group' },
]
