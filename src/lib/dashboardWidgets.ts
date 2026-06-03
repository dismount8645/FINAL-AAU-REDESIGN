export const dashboardDeadlines = [
  { id: 204, titleDa: 'To-Do App', titleEn: 'To-Do App', dateKey: 'deadline_monday', courseId: 2, deadlineHoursFromNow: 2 },
  { id: 105, titleDa: 'Designskitse', titleEn: 'Design Sketch', dateKey: 'deadline_friday', courseId: 1, deadlineHoursFromNow: 48 },
  { id: 303, titleDa: 'Analyseopgave', titleEn: 'Analysis Assignment', dateKey: 'deadline_wednesday', courseId: 3, deadlineHoursFromNow: 120 },
] as const

export const dashboardGrades = [
  { courseDa: 'Digital Design', courseEn: 'Digital Design', score: null },
  { courseDa: 'Videnskabsteori', courseEn: 'Philosophy of Science', score: 7 },
  { courseDa: 'Webudvikling', courseEn: 'Web Development', score: 10 },
] as const

export const dashboardForumPosts = [
  { id: 1, titleDa: 'Spørgsmål til litteraturen i uge 2', titleEn: 'Questions regarding literature week 2', author: 'Mads Mikkelsen', timeDa: 'For 2 timer siden', timeEn: '2 hours ago', replies: 4 },
  { id: 2, titleDa: 'Søger gruppe til projekt 1', titleEn: 'Looking for group for project 1', author: 'Lærke Poulsen', timeDa: 'I går kl. 14:30', timeEn: 'Yesterday at 14:30', replies: 12 },
  { id: 3, titleDa: 'Ændring af lokale til næste forelæsning', titleEn: 'Room change for next lecture', author: null, timeDa: 'I mandags', timeEn: 'Last Monday', replies: 0, important: true },
] as const
