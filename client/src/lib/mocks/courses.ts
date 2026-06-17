export const coursesJson = [
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
        "title": "Kursusgang 1: Introduktion til Digital Design",
        "titleEn": "Session 1: Introduction to Digital Design",
        "date": "12. Feb 2026",
        "dateEn": "Feb 12, 2026",
        "description": "Denne gang skal vi introducere modulet, gennemgå pensum og se hinanden an. Du skal se velkomstvideoen og hente kursusbeskrivelsen.",
        "descriptionEn": "This session we will introduce the module, review the syllabus, and get started. You should watch the welcome video and download the course description.",
        "themes": ["Introduktion til faget", "Gennemgang af pensum og rammer", "Introduktion til digital design og dets historie"],
        "themesEn": ["Introduction to the course", "Syllabus and framework walkthrough", "Introduction to digital design and its history"],
        "goals": ["Forstå kursets opbygning og eksamensform", "Kende forskellen på digitalt design og traditionelt design", "Etablere projektgrupper"],
        "goalsEn": ["Understand course structure and exam format", "Know the difference between digital design and traditional design", "Establish project groups"],
        "items": [
          { "id": 101, "type": "pdf", "title": "Kursusbeskrivelse og pensum", "titleEn": "Course Description and Syllabus", "size": "1.2 MB", "litType": "primary" },
          { "id": 102, "type": "video", "title": "Velkomstvideo fra underviser", "titleEn": "Welcome Video from Instructor", "duration": "5:30" },
          { "id": 103, "type": "link", "title": "Link til ekstern læringsressource", "titleEn": "Link to external learning resource", "litType": "secondary" }
        ]
      },
      {
        "id": "s2",
        "title": "Kursusgang 2: Brugercentreret Design",
        "titleEn": "Session 2: User-Centered Design",
        "date": "19. Feb 2026",
        "dateEn": "Feb 19, 2026",
        "description": "I denne uge fokuserer vi på brugercentrerede metoder. Vi gennemgår slides om designprocesser og du skal aflevere din første designskitse.",
        "descriptionEn": "This week we focus on user-centered methods. We will review slides on design processes and you need to submit your first design sketch.",
        "themes": ["Brugercentreret designproces (UCD)", "Double Diamond-modellen", "Prototyping og skitsering"],
        "themesEn": ["User-Centered Design (UCD) process", "Double Diamond model", "Prototyping and sketching"],
        "goals": ["Kunne anvende Double Diamond til designudfordringer", "Udføre simple brugertests af skitser", "Aflevere den første designskitse"],
        "goalsEn": ["Be able to apply Double Diamond to design challenges", "Perform simple user tests of sketches", "Submit the first design sketch"],
        "items": [
          { "id": 104, "type": "pdf", "title": "Slides: Designprocesser", "titleEn": "Slides: Design Processes", "size": "4.5 MB", "litType": "secondary" },
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
        "title": "Kursusgang 1: HTML & CSS Fundamentals",
        "titleEn": "Session 1: HTML & CSS Fundamentals",
        "date": "15. Mar 2026",
        "dateEn": "Mar 15, 2026",
        "description": "Denne forelæsning dækker grundlæggende semantisk HTML. Vi ser på hvorfor semantik er vigtigt for SEO og webtilgængelighed (a11y), samt ser en introduktion til Flexbox.",
        "descriptionEn": "This lecture covers basic semantic HTML. We look at why semantics are important for SEO and web accessibility (a11y), and view an introduction to Flexbox.",
        "themes": ["Semantisk HTML5", "CSS Flexbox og CSS Grid", "Responsive designprincipper"],
        "themesEn": ["Semantic HTML5", "CSS Flexbox and CSS Grid", "Responsive design principles"],
        "goals": ["Strukturere websider semantisk", "Opbygge komplekse layouts uden frameworks", "Sikre mobilvenlighed"],
        "goalsEn": ["Structure web pages semantically", "Build complex layouts without frameworks", "Ensure mobile responsiveness"],
        "items": [
          { "id": 201, "type": "pdf", "title": "Guide: Semantisk HTML", "titleEn": "Guide: Semantic HTML", "size": "0.8 MB", "litType": "primary" },
          { "id": 202, "type": "video", "title": "CSS Flexbox & Grid Masterclass", "titleEn": "CSS Flexbox & Grid Masterclass", "duration": "45:00" }
        ]
      },
      {
        "id": "w2",
        "title": "Kursusgang 2: React & State Management",
        "titleEn": "Session 2: React & State Management",
        "date": "22. Mar 2026",
        "dateEn": "Mar 22, 2026",
        "description": "Vi tager fat på React, komponenter, props og lokal state. Du skal bygge en To-Do app som din ugentlige afleveringsopgave.",
        "descriptionEn": "We tackle React, components, props, and local state. You will build a To-Do app as your weekly assignment.",
        "themes": ["React komponenter og props", "State og hooks (useState, useEffect)", "Komponentdrevet udvikling"],
        "themesEn": ["React components and props", "State and hooks (useState, useEffect)", "Component-driven development"],
        "goals": ["Oprette funktionelle React-komponenter", "Styre applikationens tilstand", "Bygge en interaktiv To-Do App"],
        "goalsEn": ["Create functional React components", "Manage application state", "Build an interactive To-Do App"],
        "items": [
          { "id": 203, "type": "link", "title": "React Documentation (Official)", "titleEn": "React Documentation (Official)", "litType": "primary" },
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
        "title": "Kursusgang 1: Introduktion til Videnskabsteori",
        "titleEn": "Session 1: Introduction to Philosophy of Science",
        "date": "05. Apr 2026",
        "dateEn": "Apr 05, 2026",
        "description": "Introduktion til de videnskabsteoretiske retninger. Vi diskuterer Thomas Kuhns paradigmeteorier og Karl Poppers falsifikationsbegreb.",
        "descriptionEn": "Introduction to philosophical directions. We discuss Thomas Kuhn's paradigm theories and Karl Popper's concept of falsification.",
        "themes": ["Kuhns paradigmeteori og videnskabelige revolutioner", "Poppers falsifikationskriterium og kritisk rationalisme"],
        "themesEn": ["Kuhn's paradigm theory and scientific revolutions", "Popper's falsification criterion and critical rationalism"],
        "goals": ["Skelne mellem Poppers og Kuhns videnskabsforståelse", "Reflektere over videnskabelig sandhed og fremskridt"],
        "goalsEn": ["Distinguish between Popper's and Kuhn's understanding of science", "Reflect on scientific truth and progress"],
        "items": [
          { "id": 301, "type": "pdf", "title": "Kuhn: Videnskabelige revolutioner", "titleEn": "Kuhn: Scientific Revolutions", "size": "3.2 MB", "litType": "primary" },
          { "id": 302, "type": "pdf", "title": "Popper: Falsifikationisme", "titleEn": "Popper: Falsificationism", "size": "2.8 MB", "litType": "secondary" }
        ]
      },
      {
        "id": "v2",
        "title": "Kursusgang 2: Videnskabelige Metoder",
        "titleEn": "Session 2: Scientific Methods",
        "date": "12. Apr 2026",
        "dateEn": "Apr 12, 2026",
        "description": "Kvalitativ vs kvantitativ metode. Gennemgang af dataindsamlingsmetoder og forelæsning om videnskabelig praksis.",
        "descriptionEn": "Qualitative vs quantitative method. Review of data collection methods and lecture on scientific practice.",
        "themes": ["Kvalitative vs. kvantitative metoder", "Dataindsamlingsteknikker (interviews, spørgeskemaer)", "Metodetriangulering"],
        "themesEn": ["Qualitative vs. quantitative methods", "Data collection techniques (interviews, surveys)", "Method triangulation"],
        "goals": ["Vælge den rette videnskabelige metode til et givet problem", "Kende fordele og ulemper ved kvalitative interviews"],
        "goalsEn": ["Choose the right scientific method for a given problem", "Know the pros and cons of qualitative interviews"],
        "items": [
          { "id": 303, "type": "video", "title": "Forelæsning: Kvalitativ vs Kvantitativ", "titleEn": "Lecture: Qualitative vs Quantitative", "duration": "1:15:00" }
        ]
      }
    ]
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
]
