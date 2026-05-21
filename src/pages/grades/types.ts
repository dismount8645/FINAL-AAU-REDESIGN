export interface GradeRecord {
  id: number
  code: string
  titleDa: string
  titleEn: string
  grade: number | null
  ects: number
  semesterDa: string
  semesterEn: string
  examDate: string
  examTypeDa: string
  examTypeEn: string
  feedbackDa: string
  feedbackEn: string
  instructor: string
}
