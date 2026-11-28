import { Link } from 'wouter';
import type { BreadcrumbItem } from '@/lib/breadcrumbs';

type Props = {
  items: BreadcrumbItem[];
};

/** Visible breadcrumbs rendered in the React tree (and therefore in App SSR HTML). */
export function PageBreadcrumbs({ items }: Props) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted-foreground mb-6">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href ?? 'current'}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="px-0.5">
                  /
                </span>
              )}
              {!last && item.href ? (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground" aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
