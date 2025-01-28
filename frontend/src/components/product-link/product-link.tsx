import { NavLink, NavLinkProps } from '@remix-run/react';

export interface ProductLinkProps extends Omit<NavLinkProps, 'to'> {
    productSlug: string;
}

export const ProductLink = ({ productSlug, children, ...rest }: ProductLinkProps) => {
    return (
        <NavLink to={`/product-details/${productSlug}`} {...rest}>
            {children}
        </NavLink>
    );
};
