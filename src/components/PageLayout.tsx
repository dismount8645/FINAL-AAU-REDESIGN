import { type ReactNode } from 'react';
import { Stack, type StackProps } from '@/components/LayoutPrimitives';
import PageHeader, { type PageHeaderProps } from '@/components/PageHeader';
import { type BreadcrumbItem } from '@/store';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/lib/test-utils';

export interface PageLayoutProps extends Omit<StackProps, 'children'> {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  pageKey?: string;
  actions?: ReactNode;
  headerChildren?: ReactNode;
  children?: ReactNode;
  flat?: boolean;
  headerClassName?: string;
  titleProps?: PageHeaderProps['titleProps'];
  actionsAlign?: PageHeaderProps['actionsAlign'];
}

export default function PageLayout({
  title,
  subtitle,
  breadcrumbs,
  pageKey,
  actions,
  headerChildren,
  children,
  flat,
  headerClassName,
  titleProps,
  actionsAlign,
  ...stackProps
}: PageLayoutProps) {
  return (
    <Stack {...stackProps}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        pageKey={pageKey}
        actions={actions}
        flat={flat}
        className={headerClassName}
        titleProps={titleProps}
        actionsAlign={actionsAlign}
      >
        {headerChildren}
      </PageHeader>
      {children}
    </Stack>
  );
}

if (import.meta.vitest) {
  describe('PageLayout', () => {
    it('renders header title and main content children', () => {
      renderWithProviders(
        <PageLayout title="Layout Title" pageKey="test">
          <div data-testid="layout-content">Main Content</div>
        </PageLayout>
      )
      expect(screen.getByText('Layout Title')).toBeDefined()
      expect(screen.getByTestId('layout-content')).toBeDefined()
    })
  })
}
