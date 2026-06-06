import type {
  CoursesMap,
  CourseListItem,
  Forum,
  CalendarEvents,
  MessageThread,
  Notification,
  CourseItem,
  GradeRecord
} from '@/lib/types'

const registryJson = {
  "courses": [
    {
      "id": 1,
      "title": "Digital Design og Kommunikation",
      "titleEn": "Digital Design and Communication",
      "code": "DD101",
      "label": "Modul 4",
      "labelEn": "Module 4",
      "professor": "Morten Jensen",
      "email": "mj@create.aau.dk",
      "img": "/assets/img/grafik/billeder/Undervisning/_2WB0207.jpg",
      "semester": "Forår 2024",
      "campus": "Campus Aalborg",
      "nextAssignment": {
        "title": "Designskitse v1",
        "titleEn": "Design Sketch v1",
        "deadline": "Om 4 dage (Fredag kl. 12:00)",
        "deadlineEn": "In 4 days (Friday at 12:00)",
        "submissionId": "105"
      },
      "sections": [
        {
          "id": "s1",
          "title": "Uge 1: Introduktion til Digital Design",
          "titleEn": "Week 1: Introduction to Digital Design",
          "items": [
            { "id": 101, "type": "pdf", "title": "Kursusbeskrivelse og pensum", "titleEn": "Course Description and Syllabus", "size": "1.2 MB" },
            { "id": 102, "type": "video", "title": "Velkomstvideo fra underviser", "titleEn": "Welcome Video from Instructor", "duration": "5:30" },
            { "id": 103, "type": "link", "title": "Link til ekstern læringsressource", "titleEn": "Link to external learning resource" }
          ]
        },
        {
          "id": "s2",
          "title": "Uge 2: Brugercentreret Design",
          "titleEn": "Week 2: User-Centered Design",
          "items": [
            { "id": 104, "type": "pdf", "title": "Slides: Designprocesser", "titleEn": "Slides: Design Processes", "size": "4.5 MB" },
            { "id": 105, "type": "assignment", "title": "Aflevering: Designskitse", "titleEn": "Assignment: Design Sketch", "deadline": "Fredag kl. 12:00" }
          ]
        }
      ]
    },
    {
      "id": 2,
      "title": "Webudvikling og CMS",
      "titleEn": "Web Development and CMS",
      "code": "WEB202",
      "label": "Modul 2",
      "labelEn": "Module 2",
      "professor": "Lise Sørensen",
      "email": "ls@create.aau.dk",
      "img": "/assets/img/grafik/billeder/Forskning/_DSC0400.jpg",
      "semester": "Forår 2024",
      "campus": "Campus Aalborg",
      "nextAssignment": {
        "title": "To-Do App",
        "titleEn": "To-Do App",
        "deadline": "Om 2 dage (Mandag kl. 09:00)",
        "deadlineEn": "In 2 days (Monday at 09:00)",
        "submissionId": "204"
      },
      "sections": [
        {
          "id": "w1",
          "title": "Modul 1: HTML & CSS Fundamentals",
          "titleEn": "Module 1: HTML & CSS Fundamentals",
          "items": [
            { "id": 201, "type": "pdf", "title": "Guide: Semantisk HTML", "titleEn": "Guide: Semantic HTML", "size": "0.8 MB" },
            { "id": 202, "type": "video", "title": "CSS Flexbox & Grid Masterclass", "titleEn": "CSS Flexbox & Grid Masterclass", "duration": "45:00" }
          ]
        },
        {
          "id": "w2",
          "title": "Modul 2: React & State Management",
          "titleEn": "Module 2: React & State Management",
          "items": [
            { "id": 203, "type": "link", "title": "React Documentation (Official)", "titleEn": "React Documentation (Official)" },
            { "id": 204, "type": "assignment", "title": "Projekt: Byg en To-Do App", "titleEn": "Project: Build a To-Do App", "deadline": "Mandag kl. 09:00" }
          ]
        }
      ]
    },
    {
      "id": 3,
      "title": "Videnskabsteori",
      "titleEn": "Philosophy of Science",
      "code": "VT303",
      "label": "Modul 1",
      "labelEn": "Module 1",
      "professor": "Anders Nielsen",
      "email": "an@hum.aau.dk",
      "img": "/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.jpg",
      "semester": "Forår 2024",
      "campus": "Campus Aalborg",
      "nextAssignment": {
        "title": "Analyseopgave",
        "titleEn": "Analysis Assignment",
        "deadline": "Om 7 dage (Onsdag kl. 12:00)",
        "deadlineEn": "In 7 days (Wednesday at 12:00)",
        "submissionId": "303"
      },
      "sections": [
        {
          "id": "v1",
          "title": "Introduktion til Videnskabsteori",
          "titleEn": "Introduction to Philosophy of Science",
          "items": [
            { "id": 301, "type": "pdf", "title": "Kuhn: Videnskabelige revolutioner", "titleEn": "Kuhn: Scientific Revolutions", "size": "3.2 MB" },
            { "id": 302, "type": "pdf", "title": "Popper: Falsifikationisme", "titleEn": "Popper: Falsificationism", "size": "2.8 MB" }
          ]
        },
        {
          "id": "v2",
          "title": "Videnskabelige Metoder",
          "titleEn": "Scientific Methods",
          "items": [
            { "id": 303, "type": "video", "title": "Forelæsning: Kvalitativ vs Kvantitativ", "titleEn": "Lecture: Qualitative vs Quantitative", "duration": "1:15:00" }
          ]
        }
      ]
    },
    {
      "id": 4,
      "title": "Problembaseret Læring (PBL)",
      "titleEn": "Problem Based Learning (PBL)",
      "code": "PBL404",
      "label": "Afsluttet (Efterår)",
      "labelEn": "Completed (Autumn)",
      "professor": "Susanne Bødker",
      "email": "sbdker@cs.aau.dk",
      "img": "/assets/img/grafik/billeder/Forskning/_DSC0988.jpg",
      "semester": "Efterår 2023",
      "campus": "Campus Aalborg",
      "color": "var(--aau-dark-grey)",
      "tab": "finished",
      "nextAssignment": null,
      "sections": []
    },
    {
      "id": 5,
      "title": "Bachelorprojekt",
      "titleEn": "Bachelor Project",
      "code": "BP505",
      "label": "Kommende (Efterår)",
      "labelEn": "Upcoming (Autumn)",
      "professor": "Klaus Marius Hansen",
      "email": "kmh@cs.aau.dk",
      "img": "/assets/img/grafik/billeder/Studerende og studieliv/_2WB5786.jpg",
      "semester": "Efterår 2024",
      "campus": "Campus Aalborg",
      "color": "var(--color-warning-dark)",
      "tab": "upcoming",
      "nextAssignment": null,
      "sections": []
    }
  ],
  "forums": [
    { "id": 10, "title": "Studienævn for DDK", "titleEn": "Study Board for DDK", "label": "Information", "labelEn": "Information", "img": "/assets/img/grafik/billeder/Studerende og studieliv/_2WB0351.jpg", "color": "var(--color-success)" },
    { "id": 11, "title": "Semesterforum (4. Semester)", "titleEn": "Semester Forum (4th Semester)", "label": "Fælles", "labelEn": "Shared", "img": "/assets/img/grafik/billeder/Bygninger og campus/_2WB3689.jpg", "color": "var(--color-primary)" }
  ],
  "defaultEvents": {
    "2026-4-5": { "id": 101, "titleDa": "Studiegruppe", "titleEn": "Study Group", "color": "var(--aau-light-blue)", "location": "Fibigerstræde 16, 1.108", "time": "08:15 - 12:00", "host": "Jacob Andersen" },
    "2026-4-12": { "id": 102, "titleDa": "Forelæsning", "titleEn": "Lecture", "color": "var(--color-primary)", "location": "Auditorium A", "time": "10:15 - 14:00", "host": "Morten Jensen" },
    "2026-4-20": { "id": 103, "title": "Deadline", "color": "var(--color-danger-dark)", "location": "Online Submission", "time": "23:59", "host": "AAU Moodle" }
  },
  "messagesData": [
    {
      "id": 1,
      "name": "Mette Jensen",
      "roleDa": "Studerende",
      "roleEn": "Student",
      "msgDa": "Har du slides fra i går?",
      "msgEn": "Did you see the slides from yesterday?",
      "timeDa": "10:45",
      "timeEn": "10:45 AM",
      "unread": true,
      "messages": [
        { "id": 1, "type": "in", "textDa": "Hej Jacob! Har du set de slides Mogens lagde op i går aftes? De virker lidt anderledes end dem han viste til forelæsningen.", "textEn": "Hi Jacob! Have you seen the slides Mogens uploaded last night? They seem a bit different from the ones he showed at the lecture." },
        { "id": 2, "type": "out", "textDa": "Hej Mette. Nej, det har jeg ikke endnu. Jeg kigger på det nu!", "textEn": "Hi Mette. No, I haven't yet. I'm looking at it now!" }
      ]
    },
    {
      "id": 2,
      "nameDa": "Studievejledningen",
      "nameEn": "Student Guidance",
      "roleDa": "Administrativ",
      "roleEn": "Administrative",
      "msgDa": "Din tid er bekræftet.",
      "msgEn": "Your appointment is confirmed.",
      "timeDa": "I går",
      "timeEn": "Yesterday",
      "unread": false,
      "messages": [
        { "id": 1, "type": "in", "textDa": "Hej Jacob. Vi bekræfter hermed din tid til studievejledning d. 15. maj kl. 13:00.", "textEn": "Hi Jacob. We hereby confirm your appointment for student guidance on May 15th at 1:00 PM." },
        { "id": 2, "type": "in", "textDa": "Husk at medbringe din studieplan.", "textEn": "Remember to bring your study plan." }
      ]
    }
  ],
  "notificationsData": [
    {
      "id": 1, "type": "AFLEVERING",
      "textDa": "Modul 4: Projektrapport v1", "textEn": "Module 4: Project Report v1",
      "dateDa": "10. maj", "dateEn": "May 10", "isRead": false,
      "courseDa": "Interaktionsdesign", "courseEn": "Interaction Design",
      "contentDa": "Din aflevering \"Modul 4: Projektrapport v1\" er nu uploadet korrekt. Du kan se din kvittering og ændre filen indtil deadline d. 12. maj.",
      "contentEn": "Your submission \"Module 4: Project Report v1\" has been uploaded correctly.",
      "link": "/course"
    },
    {
      "id": 2, "type": "FORUM",
      "textDa": "Nyt svar i Interaktionsdesign", "textEn": "New reply in Interaction Design",
      "dateDa": "9. maj", "dateEn": "May 9", "isRead": false,
      "courseDa": "Interaktionsdesign", "courseEn": "Interaction Design",
      "contentDa": "Mogens har svaret på dit spørgsmål i forummet.",
      "contentEn": "Mogens has replied to your question in the forum.",
      "link": "/course"
    },
    {
      "id": 3, "type": "SYSTEM",
      "textDa": "Moodle vedligeholdelse i nat", "textEn": "Moodle maintenance tonight",
      "dateDa": "8. maj", "dateEn": "May 8", "isRead": true,
      "courseDa": "System", "courseEn": "System",
      "contentDa": "Systemet vil være utilgængeligt mellem kl. 02:00 og 04:00 i nat.",
      "contentEn": "The system will be unavailable between 2:00 AM and 4:00 AM tonight.",
      "link": "/"
    },
    {
      "id": 4, "type": "DEADLINE",
      "textDa": "Husk tilmelding til eksamen", "textEn": "Remember exam registration",
      "dateDa": "7. maj", "dateEn": "May 7", "isRead": true,
      "courseDa": "Administration", "courseEn": "Administration",
      "contentDa": "Deadline for tilmelding til sommereksamen er d. 15. maj.",
      "contentEn": "The deadline for summer exam registration is May 15th.",
      "link": "/"
    },
    {
      "id": 5, "type": "FEEDBACK",
      "textDa": "Ny feedback på Portfolio", "textEn": "New feedback on Portfolio",
      "dateDa": "5. maj", "dateEn": "May 5", "isRead": true,
      "courseDa": "Webudvikling", "courseEn": "Web Development",
      "contentDa": "Din underviser har givet feedback på din seneste portfolio-opgave.",
      "contentEn": "Your teacher has provided feedback on your latest portfolio assignment.",
      "link": "/course"
    }
  ],
  "supportLocations": [
    { "city": "Aalborg Øst", "address": "Kroghstræde 3, lokale 2.106", "zip": "9220 Aalborg Ø" },
    { "city": "Aalborg City", "address": "Rendsburggade 14, lokale 2.145", "zip": "9000 Aalborg" },
    { "city": "København", "address": "A.C. Meyers Vænge 15, 5. sal", "zip": "2450 København" },
    { "city": "Esbjerg", "address": "Niels Bohrs Vej 8, rum F110", "zip": "6700 Esbjerg" }
  ],
  "supportDeskHours": [
    { "days": "Mandag - Torsdag", "daysEn": "Monday - Thursday", "hours": "8.00 - 15.30" },
    { "days": "Fredag", "daysEn": "Friday", "hours": "8.00 - 15.00" }
  ],
  "supportNotes": {
    "specialDays": {
      "da": "Lokale servicedeske holder lukket. Telefonsupporten er åben 8.00-15.30 (fredag til 15.00).",
      "en": "Local service desks are closed. Phone support is open 8.00-15.30 (Friday until 15.00)."
    },
    "july": {
      "da": "Skærpede åbningstider (8.00-15.30, fredag til 15.00). Rendsburggade holder lukket uge 29-30.",
      "en": "Reduced opening hours (8.00-15.30, Friday until 15.00). Rendsburggade closed weeks 29-30."
    },
    "christmas": {
      "da": "Fysiske deske har lukket (27. og 30. dec). Begrænset telefonsupport.",
      "en": "Physical desks closed (Dec 27 & 30). Limited phone support."
    }
  },
  "participantsData": [
    { "name": "Mette Jensen", "role": "student" },
    { "name": "Anders Nielsen", "role": "student" },
    { "name": "Sofie Pedersen", "role": "student" },
    { "name": "Emil Hansen", "role": "student" },
    { "name": "Laura Madsen", "role": "student" },
    { "name": "Oliver Christensen", "role": "student" },
    { "name": "Emma Rasmussen", "role": "student" },
    { "name": "Morten Jensen", "role": "teacher" }
  ],
  "courseTabItems": [
    { "key": "modules", "label": "tab_modules" },
    { "key": "forum", "label": "tab_forums" },
    { "key": "resources", "label": "tab_resources" },
    { "key": "info", "label": "tab_info" },
    { "key": "participants", "label": "tab_participants" },
    { "key": "pbl", "label": "tab_pbl_group" }
  ],
  "tools": [
    {
      "id": 1,
      "nameDa": "Digital Eksamen",
      "nameEn": "Digital Exam",
      "titleKey": "digital_exam",
      "descDa": "Aflevering af skriftlige eksamensopgaver.",
      "descEn": "Submission of written exam papers.",
      "iconName": "PenSquare",
      "bg": "rgba(14, 165, 233, 0.1)",
      "color": "var(--color-info)",
      "url": "https://digitalservices.aau.dk/dse/exam",
      "sso": true,
      "helpDa": "Digital Eksamen er AAUs platform for aflevering af skriftlige eksamener. Du uploader din besvarelse og får karakter via systemet.",
      "helpEn": "Digital Exam is AAU's platform for submitting written exams. You upload your answers and receive grades through the system.",
      "category": "tools"
    },
    {
      "id": 2,
      "nameDa": "STADS eksamens-tilmelding",
      "nameEn": "STADS exam registration",
      "titleKey": "stads",
      "descDa": "Eksamens-tilmelding og karakterer.",
      "descEn": "Exam registration and grades.",
      "iconName": "FileText",
      "bg": "rgba(249, 115, 22, 0.1)",
      "color": "var(--aau-light-orange)",
      "url": "https://stads.aau.dk",
      "sso": true,
      "helpDa": "STADS er AAUs system for eksamenstilmelding, karakterudskrift og studieadministration.",
      "helpEn": "STADS is AAU's system for exam registration, grade transcripts, and study administration.",
      "category": "tools"
    },
    {
      "id": 3,
      "nameDa": "Aalborg Universitetsbibliotek (AUB)",
      "nameEn": "Aalborg University Library (AUB)",
      "titleKey": "aub",
      "descDa": "Aalborg Universitetsbibliotek.",
      "descEn": "Aalborg University Library.",
      "iconName": "BookOpen",
      "bg": "rgba(236, 72, 153, 0.1)",
      "color": "var(--aau-light-pink)",
      "url": "https://www.aub.aau.dk",
      "sso": false,
      "helpDa": "AU Belysning giver dig adgang til videnskabelige artikler, e-bøger og databaser.",
      "helpEn": "AUB gives you access to scientific articles, e-books, and databases.",
      "category": "tools"
    },
    {
      "id": 4,
      "nameDa": "IT systemer & software",
      "nameEn": "IT systems & software",
      "titleKey": "it_software",
      "descDa": "Licenser, software og VPN.",
      "descEn": "Licenses, software, and VPN.",
      "iconName": "Wifi",
      "bg": "rgba(16, 185, 129, 0.1)",
      "color": "var(--aau-light-green)",
      "url": "https://www.its.aau.dk",
      "sso": false,
      "category": "tools"
    },
    {
      "id": 5,
      "nameDa": "Outlook Mail",
      "nameEn": "Outlook Mail",
      "titleDa": "Outlook Mail",
      "titleEn": "Outlook Mail",
      "descDa": "Din AAU-studentermail.",
      "descEn": "Your AAU student email.",
      "iconName": "Mail",
      "bg": "rgba(59, 130, 246, 0.1)",
      "color": "#3b82f6",
      "url": "https://outlook.com/aau.dk",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 6,
      "nameDa": "Microsoft Teams",
      "nameEn": "Microsoft Teams",
      "titleDa": "Microsoft Teams",
      "titleEn": "Microsoft Teams",
      "descDa": "Video-møder og chat.",
      "descEn": "Video meetings and chat.",
      "iconName": "Users",
      "bg": "rgba(79, 70, 229, 0.1)",
      "color": "#4f46e5",
      "url": "https://teams.microsoft.com",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 7,
      "nameDa": "OneDrive",
      "nameEn": "OneDrive",
      "titleDa": "OneDrive",
      "titleEn": "OneDrive",
      "descDa": "Cloud-lager til dine filer.",
      "descEn": "Cloud storage for your files.",
      "iconName": "Cloud",
      "bg": "rgba(14, 165, 233, 0.1)",
      "color": "#0ea5e9",
      "url": "https://aau-my.sharepoint.com",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 8,
      "nameDa": "Word & Office",
      "nameEn": "Word & Office",
      "titleDa": "Word & Office",
      "titleEn": "Word & Office",
      "descDa": "Office-pakken online.",
      "descEn": "Office suite online.",
      "iconName": "FileText",
      "bg": "rgba(234, 67, 53, 0.1)",
      "color": "#ea4335",
      "url": "https://office.com",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 9,
      "nameDa": "OneNote",
      "nameEn": "OneNote",
      "titleDa": "OneNote",
      "titleEn": "OneNote",
      "descDa": "Digitale noter og idéer.",
      "descEn": "Digital notes and ideas.",
      "iconName": "Book",
      "bg": "rgba(236, 72, 153, 0.1)",
      "color": "var(--aau-light-pink)",
      "url": "https://onenote.com",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 10,
      "nameDa": "Forms",
      "nameEn": "Forms",
      "titleDa": "Forms",
      "titleEn": "Forms",
      "descDa": "Spørgeskemaer og quizzer.",
      "descEn": "Surveys and quizzes.",
      "iconName": "ClipboardList",
      "bg": "rgba(16, 185, 129, 0.1)",
      "color": "var(--aau-light-green)",
      "url": "https://forms.office.com",
      "sso": true,
      "category": "essentials"
    },
    {
      "id": 11,
      "nameDa": "Panopto",
      "nameEn": "Panopto",
      "titleDa": "Panopto",
      "titleEn": "Panopto",
      "descDa": "Videooptagelse og streaming.",
      "descEn": "Video recording and streaming.",
      "iconName": "Video",
      "bg": "rgba(236, 72, 153, 0.1)",
      "color": "var(--aau-light-pink)",
      "url": "https://aau.cloud.panopto.eu",
      "sso": true,
      "helpDa": "Panopto er AAUs platform for videooptagelse og streaming of forelæsninger.",
      "helpEn": "Panopto is AAU's platform for video recording and streaming of lectures.",
      "category": "essentials"
    },
    {
      "id": 12,
      "nameDa": "Zoom",
      "nameEn": "Zoom",
      "titleDa": "Zoom",
      "titleEn": "Zoom",
      "descDa": "Video-konferenceværktøj.",
      "descEn": "Video conferencing tool.",
      "iconName": "Video",
      "bg": "rgba(14, 165, 233, 0.1)",
      "color": "#0ea5e9",
      "url": "https://aau.zoom.us",
      "sso": false,
      "category": "essentials"
    }
  ]
}

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

export const BACHELOR_TOTAL_ECTS = 180
export const mockGradesData: GradeRecord[] = [
  { id: 1, code: "DD101", titleDa: "Digital Design og Kommunikation", titleEn: "Digital Design and Communication", grade: 10, ects: 15, semesterDa: "Forår 2024", semesterEn: "Spring 2024", examDate: "2024-06-12", examTypeDa: "Mundtlig u. forberedelse (Portfoliopræsentation)", examTypeEn: "Oral without prep (Portfolio Presentation)", feedbackDa: "Særdeles velskrevet designrapport og overbevisende mundtligt forsvar med stærk teoretisk kobling.", feedbackEn: "Extremely well-written design report and persuasive oral defense with strong theoretical ties.", instructor: "Morten Jensen" },
  { id: 2, code: "WEB202", titleDa: "Webudvikling og CMS", titleEn: "Web Development and CMS", grade: 10, ects: 10, semesterDa: "Forår 2024", semesterEn: "Spring 2024", examDate: "2024-06-18", examTypeDa: "Skriftlig projektrapport og praktisk demo", examTypeEn: "Written project report and hands-on demonstration", feedbackDa: "Teknisk imponerende React-arkitektur. Mindre mangler i API-fejlhåndtering forhindrer topkarakter.", feedbackEn: "Technically impressive React architecture. Minor shortcomings in API error handling prevented a top grade.", instructor: "Lise Sørensen" },
  { id: 3, code: "VT303", titleDa: "Videnskabsteori", titleEn: "Philosophy of Science", grade: 7, ects: 5, semesterDa: "Forår 2024", semesterEn: "Spring 2024", examDate: "2024-06-22", examTypeDa: "Skriftlig hjemmeopgave (72 timer)", examTypeEn: "Written home assignment (72 hours)", feedbackDa: "God forståelse for de videnskabsteoretiske strømninger. Argumentationen savner momentvist dybde.", feedbackEn: "Good understanding of the paradigm schools of thought. Argumentation occasionally lacked depth.", instructor: "Anders Nielsen" },
  { id: 4, code: "PBL404", titleDa: "Problembaseret Læring (PBL)", titleEn: "Problem Based Learning (PBL)", grade: 12, ects: 30, semesterDa: "Efterår 2023", semesterEn: "Autumn 2023", examDate: "2023-12-18", examTypeDa: "Gruppeeksamen med individuelt forsvar", examTypeEn: "Group examination with individual defense", feedbackDa: "Fremragende anvendelse af den Aalborgensiske PBL-model. Fremragende empirisk og teoretisk syntese.", feedbackEn: "Outstanding application of the Aalborg PBL model. Exemplary synthesis of empirical and theoretical methods.", instructor: "Helene Østergaard" },
  { id: 5, code: "BP505", titleDa: "Bachelorprojekt", titleEn: "Bachelor Project", grade: null, ects: 30, semesterDa: "Kommende (Efterår 2024)", semesterEn: "Upcoming (Autumn 2024)", examDate: "TBA", examTypeDa: "Bachelorafhandling med individuel mundtlig eksamen", examTypeEn: "Bachelor Thesis with individual oral examination", feedbackDa: "Karakter endnu ikke tilgængelig. Modul starter i kommende semester.", feedbackEn: "Grade not available. Module starts in the upcoming semester.", instructor: "TBA" },
]

// Reconstruct courses map
export const courses: CoursesMap = registryJson.courses.reduce((acc, course) => {
  acc[course.id] = {
    title: course.title,
    titleEn: course.titleEn,
    code: course.code,
    professor: course.professor,
    email: course.email,
    img: course.img,
    semester: course.semester,
    campus: course.campus,
    nextAssignment: course.nextAssignment || undefined,
    sections: course.sections as CourseSection[],
  };
  return acc;
}, {} as CoursesMap)

// Reconstruct courseList
export const courseList: CourseListItem[] = registryJson.courses.map(course => ({
  id: course.id,
  title: course.title,
  titleEn: course.titleEn,
  label: course.label,
  labelEn: course.labelEn,
  code: course.code,
  img: course.img,
  color: course.color,
  tab: course.tab
}))

// Reconstruct raw courseData (Record<number, CourseRaw>)
export const courseData: Record<number, CourseRaw> = registryJson.courses.reduce((acc, course) => {
  acc[course.id] = {
    title: course.title,
    titleEn: course.titleEn,
    code: course.code,
    professor: course.professor,
    email: course.email,
    img: course.img,
    sections: course.sections as CourseSection[],
  };
  return acc;
}, {} as Record<number, CourseRaw>)

export const forums: Forum[] = registryJson.forums as Forum[]
export const defaultEvents: CalendarEvents = registryJson.defaultEvents as CalendarEvents
export const messagesData: MessageThread[] = registryJson.messagesData as MessageThread[]
export const notificationsData: Notification[] = registryJson.notificationsData as Notification[]
export const participantsData = registryJson.participantsData as { name: string; role: 'student' | 'teacher' }[]
export const courseTabItems = registryJson.courseTabItems as { key: string; label: string }[]

export const supportLocations = registryJson.supportLocations
export const supportDeskHours = registryJson.supportDeskHours
export const supportNotes = registryJson.supportNotes

export const registryTools = registryJson.tools



if (import.meta.vitest) {
  const { describe, it, expect } = await import('vitest')
  describe('data', () => {
    it('courses is an object with at least 1 key', () => {
      expect(Object.keys(courses).length).toBeGreaterThan(0)
    })
    it('courseList is an array with length > 0', () => {
      expect(courseList.length).toBeGreaterThan(0)
    })
    it('forums is defined and has items', () => {
      expect(forums).toBeDefined()
      expect(forums.length).toBeGreaterThan(0)
    })
    it('BACHELOR_TOTAL_ECTS equals 180', () => {
      expect(BACHELOR_TOTAL_ECTS).toBe(180)
    })

    it('notificationsData is an array', () => {
      expect(Array.isArray(notificationsData)).toBe(true)
    })
  })
}
