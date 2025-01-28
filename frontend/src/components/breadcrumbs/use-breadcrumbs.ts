import { useMemo } from 'react';
import { useLocation, useMatches, UIMatch, Location } from '@remix-run/react';
import { BreadcrumbData } from './breadcrumbs';

export type RouteBreadcrumbs<LoaderData = unknown, LocationState = unknown> = (
    match: UIMatch<LoaderData>,
    location: Location<LocationState>,
) => BreadcrumbData[];

export function useBreadcrumbs(): BreadcrumbData[] {
    const matches = useMatches() as UIMatch<unknown, { breadcrumbs?: RouteBreadcrumbs }>[];
    const location = useLocation();

    return useMemo(
        () => matches.flatMap((match) => match.handle?.breadcrumbs?.(match, location) ?? []),
        [matches, location],
    );
}
