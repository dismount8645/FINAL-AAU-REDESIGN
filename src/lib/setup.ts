import { vi } from 'vitest';

Element.prototype.scrollIntoView = vi.fn()

const createMatchMedia = () => vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: createMatchMedia(),
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

import "@testing-library/jest-dom"
import { afterEach, beforeEach } from "vitest";
import useStore from "@/lib/store";

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};

const initialStore = useStore.getInitialState();

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.matchMedia = createMatchMedia();
  }
});

afterEach(() => {
  useStore.setState(initialStore, true);
  if (typeof window !== 'undefined') {
    window.matchMedia = createMatchMedia();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
  vi.useRealTimers();
});

// Mock framer-motion to disable animations and exit transitions in jsdom/Vitest environment
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  const React = await import('react');
  
  const createMockComponent = (tag: string) => {
    type MockProps = React.PropsWithChildren<Record<string, unknown>>;
    const Component = React.forwardRef<HTMLElement, MockProps>(({ children, initial: _initial, animate: _animate, exit: _exit, transition: _transition, variants: _variants, whileHover: _whileHover, whileTap: _whileTap, ...props }: MockProps, ref: React.Ref<HTMLElement>) => {
      return React.createElement(tag, { ...props, ref }, children);
    });
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  const mockMotion: Record<string, unknown> = {
    ...actual.motion,
    create: (Component: unknown) => {
      if (typeof Component === 'string') {
        return createMockComponent(Component);
      }
      type MockProps = React.PropsWithChildren<Record<string, unknown>>;
      const Mock = React.forwardRef<HTMLElement, MockProps>(({ children, initial: _initial, animate: _animate, exit: _exit, transition: _transition, variants: _variants, whileHover: _whileHover, whileTap: _whileTap, ...props }: MockProps, ref: React.Ref<HTMLElement>) => {
        return React.createElement(Component as React.ComponentType<MockProps>, { ...props, ref }, children);
      });
      Mock.displayName = `motion.create`;
      return Mock;
    },
  };

  const tags = [
    'div', 'span', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'li',
    'svg', 'path', 'nav', 'section', 'article', 'aside', 'header', 'footer', 'a',
    'img', 'input', 'textarea', 'label', 'form'
  ];
  tags.forEach(tag => {
    (mockMotion as Record<string, unknown>)[tag] = createMockComponent(tag);
  });

  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    motion: mockMotion,
  };
});
