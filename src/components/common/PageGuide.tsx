import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, WandSparkles } from 'lucide-react';
import { Heading, Text } from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Stack from '@/components/ui/Stack';
import useStore from '@/store/useStore'

const pageGuides = {
  '/': {
    da: {
      title: 'Velkommen til dit Dashboard',
      steps: [
        'Her får du et hurtigt overblik over din studieuge.',
        'Venstre side viser dine moduler og deres fremskridt.',
        'Højre side viser din kalender og kommende deadlines.',
        'Brug søgefeltet øverst til hurtigt at finde kurser eller værktøjer.'
      ]
    },
    en: {
      title: 'Welcome to your Dashboard',
      steps: [
        'Get a quick overview of your study week here.',
        'The left side shows your modules and their progress.',
        'The right side shows your calendar and upcoming deadlines.',
        'Use the search bar at the top to quickly find courses or tools.'
      ]
    }
  },
  '/calendar': {
    da: {
      title: 'Sådan bruger du Kalenderen',
      steps: [
        'Se alle dine forelæsninger og deadlines ét sted.',
        'Du kan skifte mellem måned, uge og dag i toppen.',
        'Klik på en begivenhed for at se flere detaljer.',
        'Brug "Import/Eksport" til at få kalenderen ind i din private kalender.'
      ]
    },
    en: {
      title: 'How to use the Calendar',
      steps: [
        'See all your lectures and deadlines in one place.',
        'Switch between month, week, and day views at the top.',
        'Click on an event to see more details.',
        'Use "Import/Export" to sync with your private calendar.'
      ]
    }
  },
  '/courses': {
    da: {
      title: 'Dine Moduler',
      steps: [
        'Her finder du alle dine nuværende og tidligere moduler.',
        'Klik på et modul-kort for at gå til kursets indhold.',
        'Brug filteret til at sortere mellem aktive og afsluttede kurser.',
        'Se hurtigt dit fremskridt på det enkelte modul.'
      ]
    },
    en: {
      title: 'Your Modules',
      steps: [
        'Find all your current and past modules here.',
        'Click on a module card to access course content.',
        'Use the filter to sort between active and completed courses.',
        'Quickly see your progress on each module.'
      ]
    }
  },
  '/course/:id': {
    da: {
      title: 'Oversigt over dit kursus',
      steps: [
        'Her finder du alt indhold relateret til dette kursus.',
        'Gennemse modulerne for at finde læsemateriale og videoer.',
        'Se dine kommende afleveringer og opgaver i højre side.',
        'Deltag i forumdiskussioner for at få hjælp fra medstuderende.'
      ]
    },
    en: {
      title: 'Course Overview',
      steps: [
        'Find all content related to this course here.',
        'Browse modules to find reading materials and videos.',
        'See your upcoming submissions and assignments on the right.',
        'Join forum discussions to get help from fellow students.'
      ]
    }
  },
  '/messages': {
    da: {
      title: 'Dine Beskeder',
      steps: [
        'Her kan du skrive med medstuderende og undervisere.',
        'Søg efter personer i din kontaktliste i venstre side.',
        'Dine samtaler er opdelt i private beskeder og gruppechats.',
        'Klik på en samtale for at se hele historikken og svare.'
      ]
    },
    en: {
      title: 'Your Messages',
      steps: [
        'Chat with fellow students and teachers here.',
        'Search for people in your contact list on the left.',
        'Conversations are split into private messages and group chats.',
        'Click a conversation to see the full history and reply.'
      ]
    }
  },
  '/notifications': {
    da: {
      title: 'Notifikationer',
      steps: [
        'Få besked om nye karakterer, deadlines og forumindlæg.',
        'Klik på en notifikation for at gå direkte til kilden.',
        'Du kan markere alle som læst i toppen af siden.',
        'Brug filteret til at se bestemte typer af notifikationer.'
      ]
    },
    en: {
      title: 'Notifications',
      steps: [
        'Get notified about new grades, deadlines, and forum posts.',
        'Click a notification to go directly to the source.',
        'You can mark all as read at the top of the page.',
        'Use the filter to see specific types of notifications.'
      ]
    }
  },
  '/settings': {
    da: {
      title: 'Indstillinger',
      steps: [
        'Tilpas din profil og dine præferencer her.',
        'Vælg mellem lys og mørk tilstand i "Tema" sektionen.',
        'Skift sprog mellem dansk og engelsk efter behov.',
        'Administrer dine notifikationsindstillinger nederst.'
      ]
    },
    en: {
      title: 'Settings',
      steps: [
        'Customize your profile and preferences here.',
        'Switch between light and dark mode in the "Theme" section.',
        'Change language between Danish and English as needed.',
        'Manage your notification settings at the bottom.'
      ]
    }
  },
  '/resources': {
    da: {
      title: 'Værktøjskassen',
      steps: [
        'Dette er din indgang til alle AAUs digitale værktøjer.',
        'De vigtigste værktøjer som Mail, STADS og Digital Eksamen er øverst.',
        'AAU Digital Essentials indeholder standard software som Teams og OneDrive.',
        'Har du brug for hjælp, kan du kontakte IT-supporten nederst.'
      ]
    },
    en: {
      title: 'The Toolbox',
      steps: [
        'This is your entry point to all AAU digital tools.',
        'Key tools like Mail, STADS, and Digital Exam are at the top.',
        'AAU Digital Essentials contains standard software like Teams and OneDrive.',
        'If you need help, contact IT support at the bottom.'
      ]
    }
  },
  '/support': {
    da: {
      title: 'Hjælp og Support',
      steps: [
        'Find åbningstider og lokationer for alle servicedeske.',
        'Brug Serviceportalen til at oprette sager direkte til ITS.',
        'Tjek guides og vejledninger i højre side.',
        'Se aktuelle driftsmeddelelser under "Serviceinfo".'
      ]
    },
    en: {
      title: 'Help and Support',
      steps: [
        'Find opening hours and locations for all service desks.',
        'Use the Service Portal to create tickets directly for ITS.',
        'Check guides and instructions on the right side.',
        'See current system status under "Service Info".'
      ]
    }
  },
  '/submission/:courseId/:assignmentId': {
    da: {
      title: 'Afleveringsportal',
      steps: [
        'Her kan du uploade din besvarelse til opgaven.',
        'Husk at tjekke filformatet og størrelsen før upload.',
        'Du modtager en kvittering på mail umiddelbart efter aflevering.',
        'Du kan se din afleveringsstatus og eventuel feedback her.'
      ]
    },
    en: {
      title: 'Submission Portal',
      steps: [
        'Upload your assignment response here.',
        'Remember to check file format and size before uploading.',
        'You will receive an email receipt immediately after submission.',
        'You can view your submission status and feedback here.'
      ]
    }
  }
};

interface GuideContent {
  title: string;
  steps: string[];
}

interface PageGuideData {
  da: GuideContent;
  en: GuideContent;
}

function PageGuide() {
  const { lang, t } = useStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentGuide, setCurrentGuide] = useState<GuideContent | null>(null);

  useEffect(() => {
    // Helper to find the best matching guide
    const findGuide = (): PageGuideData => {
      const guides = pageGuides as Record<string, PageGuideData>;
      // 1. Try exact match
      if (guides[location.pathname]) return guides[location.pathname];

      // 2. Try pattern matches for dynamic routes
      for (const pattern in guides) {
        if (pattern.includes(':')) {
          // Convert route pattern like /course/:id to regex
          const regexPattern = pattern
            .replace(/\//g, '\\/') // Escape slashes
            .replace(/:[^\s/]+/g, '[^/]+'); // Replace :params with anything but /
          const regex = new RegExp('^' + regexPattern + '$');
          
          if (regex.test(location.pathname)) return guides[pattern];
        }
      }

      // 3. Fallback to dashboard
      return guides['/'];
    };

    const guide = findGuide();
    setCurrentGuide(guide[lang as keyof PageGuideData]);
    // Close guide when changing page
    setIsOpen(false);
  }, [location, lang]);

  if (!currentGuide) return null;

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="ghost"
        className={`page-guide-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t('page_guidance')}
        aria-label={t('page_guidance')}
        icon={isOpen ? X : HelpCircle}
      />

      {/* Guide Panel */}
      <AnimatePresence>
        {isOpen ? <motion.div 
            className="page-guide-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <Stack className="guide-header">
              <WandSparkles size={24} strokeWidth={2} aria-hidden="true" />
              <Heading level={3}>{currentGuide.title}</Heading>
            </Stack>
            <Stack className="guide-body">
              <ul className="guide-steps">
                {currentGuide.steps.map((step, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge className="step-number">{index + 1}</Badge>
                    <Text>{step}</Text>
                  </motion.li>
                ))}
              </ul>
            </Stack>
            <Stack className="guide-footer">
              <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                {t('got_it')}
              </Button>
            </Stack>
          </motion.div> : null}
      </AnimatePresence>
    </>
  );
}

export default PageGuide;
