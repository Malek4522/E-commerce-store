import { NavLink, NavLinkProps } from '@remix-run/react';

export interface CategoryLinkProps extends Omit<NavLinkProps, 'to'> {
    categorySlug: string;
}

export const CategoryLink = ({ categorySlug, children, ...rest }: CategoryLinkProps) => {
    return (
        <NavLink to={`/products/${categorySlug}`} {...rest}>
            {children}
        </NavLink>
    );
};
