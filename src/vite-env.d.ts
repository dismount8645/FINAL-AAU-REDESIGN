/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

import { render as rtlRender, screen as rtlScreen, fireEvent as rtlFireEvent, act as rtlAct, renderHook as rtlRenderHook, Screen as RTLScreen } from '@testing-library/react';
import { renderWithProviders as customRenderWithProviders } from './test/test-utils';

declare global {
  interface ImportMeta {
    readonly vitest: boolean;
  }

  interface Screen extends RTLScreen {}

  var render: typeof rtlRender;
  var screen: Screen;
  var fireEvent: typeof rtlFireEvent;
  var act: typeof rtlAct;
  var renderHook: typeof rtlRenderHook;
  var renderWithProviders: typeof customRenderWithProviders;
}
