import { type ReactNode } from 'react';
import { Stack, type StackProps } from '@/components/Layout/LayoutPrimitives';
import PageHeader from '@/components/Layout/PageHeader';
import { type PageHeaderProps } from '@/components/Layout/PageHeader';
import { type BreadcrumbItem } from '@/store';

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

