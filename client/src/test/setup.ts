import './globals';
import { vi } from 'vitest';
import { render as rtlRender, screen as rtlScreen, fireEvent as rtlFireEvent, act as rtlAct, renderHook as rtlRenderHook } from '@testing-library/react';
import { renderWithProviders as rtlRenderWithProviders } from './test-utils';

globalThis.render = rtlRender;
Object.defineProperty(globalThis, 'screen', { value: rtlScreen, writable: true, configurable: true });
globalThis.fireEvent = rtlFireEvent;
globalThis.act = rtlAct;
globalThis.renderHook = rtlRenderHook;
globalThis.renderWithProviders = rtlRenderWithProviders;

Element.prototype.scrollIntoView = vi.fn()

import "@testing-library/jest-dom"
import { afterEach } from "vitest";
import useStore from '@/store';

const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};

const initialStore = useStore.getInitialState();

afterEach(() => {
  useStore.setState(initialStore, true);
  if (typeof window !== 'undefined') {
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

