import { useMemo, useState, useEffect } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useLocation, MemoryRouter, Routes, Route } from 'react-router-dom';
import { ASSETS } from '@/lib';
import useStore from '@/lib/store';

const WAVE_MAP = {
  '/': { num: '01', color: 'rgba(0, 33, 79, 0.05)' },         // Dashboard - Deep Blue
  '/courses': { num: '02', color: 'rgba(0, 60, 113, 0.06)' },  // Courses - Mid Blue
  '/calendar': { num: '03', color: 'rgba(0, 80, 150, 0.04)' }, // Calendar - Light Blue
  '/resources': { num: '04', color: 'rgba(0, 100, 180, 0.03)' }, // Resources - Cyan
  '/support': { num: '05', color: 'rgba(100, 100, 100, 0.05)' }, // Support - Grey
  '/settings': { num: '06', color: 'rgba(50, 50, 100, 0.04)' },  // Settings - Purple Tint
  '/course/': { num: '07', color: 'rgba(0, 40, 90, 0.08)' },    // Course - Focused Blue
  '/submission/': { num: '08', color: 'rgba(0, 60, 100, 0.07)' }, // Submission - Action Blue
};

export default function DynamicWaveBackground() {
  const location = useLocation();
  const isDarkMode = useStore(state => state.isDarkMode)
  const [imgError, setImgError] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const config = useMemo(() => {
    const path = location.pathname;
    const map = WAVE_MAP as Record<string, { num: string; color: string }>;

    if (map[path]) return map[path];

    const prefixMatch = Object.keys(map)
      .filter(key => key.endsWith('/') && key !== '/')
      .sort((a, b) => b.length - a.length)
      .find(key => path.startsWith(key));
    if (prefixMatch) return map[prefixMatch];

    const fallbackIndex = (path.length % 4) + 9;
    return { num: fallbackIndex.toString().padStart(2, '0'), color: 'rgba(0, 33, 79, 0.05)' };
  }, [location.pathname]);

  const targetUrl = isDarkMode
    ? ASSETS.waves.dark(config.num)
    : ASSETS.waves.light(config.num);

  useEffect(() => {
    if (targetUrl === activeUrl) return;

    setIsTransitioning(true);
    const img = new Image();
    img.onload = () => {
      setActiveUrl(targetUrl);
      setIsTransitioning(false);
      setImgError(false);
    };
    img.onerror = () => {
      setImgError(true);
      setIsTransitioning(false);
    };
    img.src = targetUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [targetUrl, activeUrl]);

  if (imgError) return null;

  /* istanbul ignore next */
  const waveOpacity = isTransitioning && activeUrl ? 0 : (isDarkMode ? 0.20 : 0.15);

  return (
    <div
      className="dynamic-waves transition-opacity duration-1000"
      style={{
        backgroundImage: `url(${activeUrl || targetUrl})`,
        '--wave-overlay': config.color,
        opacity: waveOpacity
      } as React.CSSProperties}
    >
      <div className="dynamic-waves__overlay" />
    </div>
  );
}

function renderAtPath(pathname: string, isDarkMode = false) {
  useStore.setState({ isDarkMode })
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="*" element={<DynamicWaveBackground />} />
      </Routes>
    </MemoryRouter>
  )
}

if (import.meta.vitest) {
  describe('DynamicWaveBackground', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })
  
    it('renders a wave image', () => {
      const { container } = renderAtPath('/')
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el).toBeInTheDocument()
      expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-01.webp')
    })
  
    it('uses exact path match', () => {
      const { container } = renderAtPath('/courses')
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-02.webp')
    })
  
    it('uses prefix path match', () => {
      const { container } = renderAtPath('/course/123')
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-07.webp')
    })
  
    it('uses fallback when no path matches', () => {
      const { container } = renderAtPath('/some-random-path')
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el.style.backgroundImage).toContain('AAU_BOELGER_RGB-10.webp')
    })
  
    it('uses dark mode URL when isDarkMode is true', () => {
      const { container } = renderAtPath('/', true)
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el.style.backgroundImage).toContain('AAU_BOELGER_WHITE-01.webp')
    })
  
    it('handles image load and transition', () => {
      let loadHandler: (() => void) | null = null
      const originalImage = globalThis.Image
      globalThis.Image = class {
        set onload(fn: () => void) { loadHandler = fn }
        set src(_: string) { /* start loading */ }
      } as any
  
      const { container } = renderAtPath('/')
      
      // Trigger load
      act(() => {
        if (loadHandler) loadHandler()
      })
  
      const el = container.querySelector('.dynamic-waves') as HTMLElement
      expect(el.style.opacity).toBe('0.15')
      
      globalThis.Image = originalImage
    })
  
    it('returns null when image fails to load', () => {
      const originalImage = globalThis.Image
      globalThis.Image = class {
        onerror: (() => void) | null = null
        set src(_: string) {
          act(() => { this.onerror?.() })
        }
      } as any
  
      const { container } = renderAtPath('/')
      expect(container.querySelector('.dynamic-waves')).not.toBeInTheDocument()
  
      globalThis.Image = originalImage
    })
  })
}
