import { Link, useNavigate } from '@remix-run/react';
import classNames from 'classnames';
import { useState } from 'react';
import { MenuIcon } from '~/src/components/icons';
import { getCartItemCount, useCart } from '~/src/api';
import { SidebarNavigationMenu } from '../sidebar-navigation-menu/sidebar-navigation-menu';

import styles from './header.module.scss';

export interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    const { cart, isOpen: isCartOpen, setIsOpen: setCartOpen } = useCart();
    const navigate = useNavigate();

    const onSearchSubmit = (search: string) => {
        navigate(`/products/all-products?search=${encodeURIComponent(search)}`);
    };

    const cartItemCount = cart ? getCartItemCount(cart) : 0;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <header className={classNames(styles.root, className)}>
            <section className={styles.topBar}>
                <Link to="/" className={styles.logo}>
                    MZ Prestige
                </Link>
                <div className={styles.div1}>
                    <Link className={styles.shopNow} to="/products/all-products">
                        Shop Now
                    </Link>
                </div>
            </section>

            <SidebarNavigationMenu open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </header>
    );
};
